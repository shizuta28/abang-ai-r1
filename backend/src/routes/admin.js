import { safeObjectKey } from '@abang/integrations'
import { AppError, integrationError, parse } from '../errors.js'
import { leadStatusSchema, pageSchema, productSchema, threadSchema, threadUpdateSchema } from '../schemas.js'

function defined(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined))
}

const transitions = {
  DRAFT: ['IN_REVIEW'],
  IN_REVIEW: ['DRAFT', 'SCHEDULED'],
  SCHEDULED: ['IN_REVIEW'],
  PUBLISHED: []
}

export async function adminRoutes(app) {
  app.addHook('preHandler', async (request) => {
    request.user = await app.auth.requireAdmin(request)
  })

  app.get('/status', async () => ({
    strapiUrl: app.config.strapi.url || null,
    integrations: {
      google: app.integrations.google.enabled,
      toyyibpay: app.integrations.toyyibpay.enabled && Boolean(app.config.toyyibpay.callbackUrl),
      r2: app.integrations.r2.enabled,
      strapi: app.integrations.strapi.enabled,
      threads: app.integrations.threads.enabled
    }
  }))

  app.get('/summary', async () => ({ summary: await app.repos.salesSummary() }))
  app.get('/leads', async () => ({ leads: await app.repos.listLeads() }))
  app.patch('/leads/:id', async (request) => {
    const body = parse(leadStatusSchema, request.body)
    return { lead: await app.repos.updateLead(request.params.id, body) }
  })

  app.get('/products', async () => ({ products: await app.repos.listProducts({ publishedOnly: false }) }))
  app.post('/products', async (request) => {
    const body = parse(productSchema, request.body)
    return {
      product: await app.repos.createProduct({
        ...body,
        descriptionBm: body.descriptionBm || '',
        descriptionEn: body.descriptionEn || '',
        published: Boolean(body.published)
      })
    }
  })
  app.patch('/products/:id', async (request) => {
    const body = defined(parse(productSchema.partial(), request.body))
    return { product: await app.repos.updateProduct(request.params.id, body) }
  })
  app.delete('/products/:id', async (request) => {
    await app.repos.deleteProduct(request.params.id)
    return { ok: true }
  })

  app.post('/uploads', async (request) => {
    const file = await request.file()
    if (!file) throw new AppError(400, 'validation_error', 'Choose a file to upload.')
    try {
      const key = safeObjectKey(file.filename)
      const body = await file.toBuffer()
      await app.integrations.r2.upload({ key, body, contentType: file.mimetype })
      return { key }
    } catch (error) {
      const mapped = integrationError(error)
      if (mapped) throw mapped
      throw error
    }
  })

  app.get('/orders', async () => ({ orders: await app.repos.listOrders() }))
  app.post('/orders/:id/cancel', async (request) => {
    try {
      const order = await app.repos.cancelOrder(request.params.id)
      if (!order) throw new AppError(404, 'not_found', 'That order was not found.')
      return { order }
    } catch (error) {
      if (error.code === 'paid_order') throw new AppError(409, 'paid_order', error.message)
      throw error
    }
  })

  app.get('/pages', async () => ({ pages: await app.repos.listPages(false) }))
  app.post('/pages', async (request) => {
    const body = parse(pageSchema, request.body)
    return { page: await app.repos.createPage({ ...body, published: Boolean(body.published) }) }
  })
  app.patch('/pages/:id', async (request) => ({
    page: await app.repos.updatePage(request.params.id, defined(parse(pageSchema.partial(), request.body)))
  }))

  app.get('/threads', async () => ({ posts: await app.repos.listThreads() }))
  app.post('/threads', async (request) => {
    const body = parse(threadSchema, request.body)
    return { post: await app.repos.createThread({ body: body.body, reviewNote: body.reviewNote || null, status: 'DRAFT' }) }
  })
  app.patch('/threads/:id', async (request) => {
    const current = await app.repos.findThreadById(request.params.id)
    if (!current) throw new AppError(404, 'not_found', 'That post was not found.')
    const body = parse(threadUpdateSchema, request.body)
    if (body.status && !transitions[current.status]?.includes(body.status)) {
      throw new AppError(409, 'invalid_transition', 'Move the post through draft, review, then schedule.')
    }
    if (body.status === 'SCHEDULED') {
      if (!body.scheduledAt) throw new AppError(400, 'validation_error', 'Choose a schedule time.')
      if (new Date(body.scheduledAt).getTime() < Date.now() - 60_000) {
        throw new AppError(400, 'validation_error', 'Choose a schedule time in the future.')
      }
    }
    const changes = defined(body)
    if (changes.scheduledAt) changes.scheduledAt = new Date(changes.scheduledAt)
    return { post: await app.repos.updateThread(current.id, changes) }
  })
  app.post('/threads/:id/publish', async (request) => {
    const current = await app.repos.findThreadById(request.params.id)
    if (!current) throw new AppError(404, 'not_found', 'That post was not found.')
    if (!['IN_REVIEW', 'SCHEDULED'].includes(current.status)) {
      throw new AppError(409, 'invalid_transition', 'Review the post before publishing it.')
    }
    try {
      const result = await app.integrations.threads.publish(current.body)
      const post = await app.repos.updateThread(current.id, {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        threadsMediaId: result.threadsMediaId
      })
      return { post }
    } catch (error) {
      const mapped = integrationError(error)
      if (mapped) throw mapped
      throw error
    }
  })
}
