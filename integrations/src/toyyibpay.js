export function toCents(value) {
  if (value == null || value === '') return null
  const raw = String(value).trim().replace(/,/g, '')
  if (!/^\d+(\.\d+)?$/.test(raw)) return null
  if (raw.includes('.')) {
    const [whole, fraction = ''] = raw.split('.')
    const sen = `${fraction}00`.slice(0, 2)
    return Number(whole) * 100 + Number(sen)
  }
  return Number(raw)
}

export function extractTransactions(payload) {
  if (Array.isArray(payload)) return payload.filter((item) => item && typeof item === 'object')
  if (Array.isArray(payload?.transactions)) return payload.transactions
  if (payload && typeof payload === 'object' && (payload.billpaymentStatus != null || payload.billPaymentStatus != null)) {
    return [payload]
  }
  return []
}

function transactionStatus(transaction) {
  return String(transaction?.billpaymentStatus ?? transaction?.billPaymentStatus ?? transaction?.status ?? '')
}

function transactionAmount(transaction) {
  return toCents(transaction?.billpaymentAmount ?? transaction?.billPaymentAmount ?? transaction?.amount)
}

export function decidePaymentOutcome({ order, callback = {}, transactions = [], providerError = false }) {
  if (providerError) return { action: 'retry', reason: 'provider_unreachable' }
  if (!order) return { action: 'ignore', reason: 'order_not_found' }
  if (order.status === 'PAID') return { action: 'already_paid', reason: 'already_paid' }

  const callbackBill = callback.billcode || callback.billCode || ''
  const callbackRef = callback.order_id || callback.orderId || ''
  if (callbackBill && order.billCode && String(callbackBill) !== String(order.billCode)) {
    return { action: 'reject', reason: 'billcode_mismatch' }
  }
  if (callbackRef && String(callbackRef) !== String(order.externalRef)) {
    return { action: 'reject', reason: 'reference_mismatch' }
  }

  const success = transactions.find((transaction) => transactionStatus(transaction) === '1')
  if (success) {
    const amountCents = transactionAmount(success)
    if (amountCents !== order.totalCents) return { action: 'reject', reason: 'amount_mismatch' }
    return {
      action: 'mark_paid',
      reason: 'verified',
      refNo: callback.refno || success.billpaymentInvoiceNo || success.invoiceNo || null,
      amountCents
    }
  }

  const callbackStatus = String(callback.status || '')
  if (callbackStatus === '3' || callbackStatus === '4') {
    return { action: 'mark_failed', reason: callback.reason || 'payment_failed' }
  }
  return { action: 'pending', reason: 'not_yet_successful' }
}

async function postForm(url, fields) {
  const body = new URLSearchParams()
  for (const [key, value] of Object.entries(fields)) {
    if (value != null) body.set(key, String(value))
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(20000)
  })
  const text = await response.text()
  let payload = text
  try {
    payload = JSON.parse(text)
  } catch {
    payload = text
  }
  if (!response.ok) {
    const error = new Error('ToyyibPay request failed.')
    error.code = 'toyyibpay_http'
    error.payload = payload
    throw error
  }
  return payload
}

export function createToyyibPay(config) {
  const enabled = Boolean(config.userSecretKey && config.categoryCode && config.baseUrl)
  const baseUrl = String(config.baseUrl || '').replace(/\/$/, '')

  return {
    enabled,
    paymentUrl(billCode) {
      return `${baseUrl}/${billCode}`
    },
    async createBill(input) {
      if (!enabled) {
        const error = new Error('ToyyibPay is not configured.')
        error.code = 'payments_not_configured'
        throw error
      }
      const payload = await postForm(`${baseUrl}/index.php/api/createBill`, {
        userSecretKey: config.userSecretKey,
        categoryCode: config.categoryCode,
        billName: String(input.billName).slice(0, 30),
        billDescription: String(input.billDescription).slice(0, 100),
        billPriceSetting: 1,
        billPayorInfo: 1,
        billAmount: input.amountCents,
        billReturnUrl: config.returnUrl,
        billCallbackUrl: config.callbackUrl,
        billExternalReferenceNo: input.externalRef,
        billTo: input.name,
        billEmail: input.email,
        billPhone: input.phone,
        billPaymentChannel: config.channel || '2'
      })
      const billCode = Array.isArray(payload) ? payload[0]?.BillCode : payload?.BillCode
      if (!billCode) {
        const error = new Error(payload?.msg || payload?.[0]?.msg || 'ToyyibPay did not return a bill code.')
        error.code = 'toyyibpay_rejected'
        throw error
      }
      return { billCode, paymentUrl: `${baseUrl}/${billCode}` }
    },
    async getTransactions(billCode) {
      if (!enabled) {
        const error = new Error('ToyyibPay is not configured.')
        error.code = 'payments_not_configured'
        throw error
      }
      const payload = await postForm(`${baseUrl}/index.php/api/getBillTransactions`, {
        userSecretKey: config.userSecretKey,
        billCode
      })
      return extractTransactions(payload)
    }
  }
}
