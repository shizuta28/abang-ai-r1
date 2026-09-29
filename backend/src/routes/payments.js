import { decidePaymentOutcome } from '@abang/integrations'

function cleanCallback(body = {}) {
  const payload = { ...body }
  delete payload.userSecretKey
  delete payload.user_secret_key
  return payload
}

export async function paymentRoutes(app) {
  app.post('/api/payments/toyyibpay/callback', {
    config: { rateLimit: { max: 60, timeWindow: '1 minute' } }
  }, async (request, reply) => {
    const callback = cleanCallback(request.body)
    const externalRef = callback.order_id || callback.orderId
    const order = externalRef ? await app.repos.findOrderByExternalRef(String(externalRef)) : null
    let transactions = []
    let providerError = false
    if (order?.billCode && app.integrations.toyyibpay.enabled) {
      try {
        transactions = await app.integrations.toyyibpay.getTransactions(order.billCode)
      } catch (error) {
        providerError = true
        request.log.error({ err: error, externalRef }, 'ToyyibPay verification failed')
      }
    } else if (order && !app.integrations.toyyibpay.enabled) {
      providerError = true
    }

    const outcome = decidePaymentOutcome({ order, callback, transactions, providerError })
    request.log.info({ action: outcome.action, reason: outcome.reason, externalRef }, 'ToyyibPay callback')

    if (outcome.action === 'retry') return reply.code(503).send('RETRY')
    if (outcome.action === 'reject' && outcome.reason === 'billcode_mismatch') {
      return reply.code(400).send('REJECTED')
    }
    if (outcome.action === 'reject' && outcome.reason === 'reference_mismatch') {
      return reply.code(400).send('REJECTED')
    }
    if (outcome.action === 'mark_paid' && order) {
      await app.repos.markOrderPaid(order.id, {
        billCode: order.billCode,
        refNo: outcome.refNo,
        amountCents: outcome.amountCents,
        rawPayload: callback
      })
    }
    if (outcome.action === 'mark_failed' && order) {
      await app.repos.markOrderFailed(order.id, outcome.reason)
    }
    if (outcome.action === 'reject' && order) {
      await app.repos.markOrderFailed(order.id, outcome.reason)
    }
    return reply.type('text/plain').code(200).send('OK')
  })
}
