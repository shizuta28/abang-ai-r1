import { randomBytes } from 'node:crypto'
import { AppError, integrationError, parse } from '../errors.js'
import { orderSchema } from '../schemas.js'

async function startBill(app, order, product, payer) {
  if (!app.integrations.toyyibpay.enabled || !app.config.toyyibpay.callbackUrl) {
    throw new AppError(503, 'payments_not_configured', 'ToyyibPay is not configured yet.')
  }
  try {
    const bill = await app.integrations.toyyibpay.createBill({
      billName: product.titleEn || product.titleBm,
      billDescription: product.summaryEn || product.summaryBm,
      amountCents: order.totalCents,
      externalRef: order.externalRef,
      name: payer.name || payer.email,
      email: payer.email,
      phone: order.phone
    })
    const updated = await app.repos.attachBill(order.id, bill.billCode)
    return { order: updated, paymentUrl: bill.paymentUrl }
  } catch (error) {
    const mapped = integrationError(error)
    if (mapped) throw mapped
    app.log.error(error)
    throw new AppError(502, 'payment_start_failed', 'Payment could not be started. Please try again.')
  }
}

export async function orderRoutes(app) {
  app.post('/api/orders', async (request) => {
    const user = await app.auth.requireUser(request)
    if (!app.integrations.toyyibpay.enabled || !app.config.toyyibpay.callbackUrl) {
      throw new AppError(503, 'payments_not_configured', 'ToyyibPay is not configured yet.')
    }
    const body = parse(orderSchema, request.body)
    const product = await app.repos.findProductById(body.productId)
    if (!product || !product.published) throw new AppError(404, 'not_found', 'That product was not found.')
    if (product.priceCents === 0) throw new AppError(400, 'free_product', 'This item is free. Download it from your account.')
    if (product.priceCents < 100) throw new AppError(400, 'invalid_price', 'Paid items must cost at least RM 1.00.')
    const order = await app.repos.createOrder({
      userId: user.id,
      email: user.email,
      phone: body.phone,
      externalRef: `ord_${randomBytes(8).toString('hex')}`,
      totalCents: product.priceCents,
      item: {
        productId: product.id,
        title: product.titleEn,
        priceCents: product.priceCents
      }
    })
    return startBill(app, order, product, user)
  })

  app.get('/api/orders/mine', async (request) => {
    const user = await app.auth.requireUser(request)
    return { orders: await app.repos.listOrdersForUser(user.id) }
  })

  app.get('/api/orders/ref/:ref', async (request) => {
    const user = await app.auth.requireUser(request)
    const order = await app.repos.findOrderByExternalRef(request.params.ref)
    if (!order || order.userId !== user.id) throw new AppError(404, 'not_found', 'That order was not found.')
    return { order }
  })

  app.post('/api/orders/:id/pay', async (request) => {
    const user = await app.auth.requireUser(request)
    const order = await app.repos.findOrderById(request.params.id)
    if (!order || order.userId !== user.id) throw new AppError(404, 'not_found', 'That order was not found.')
    if (order.status === 'PAID') return { order, paymentUrl: null }
    if (order.status !== 'PENDING') throw new AppError(409, 'order_closed', 'This order can no longer be paid.')
    if (order.billCode && app.integrations.toyyibpay.enabled) {
      return { order, paymentUrl: app.integrations.toyyibpay.paymentUrl(order.billCode) }
    }
    const product = await app.repos.findProductById(order.items[0]?.productId)
    if (!product) throw new AppError(404, 'not_found', 'That product was not found.')
    return startBill(app, order, product, user)
  })
}
