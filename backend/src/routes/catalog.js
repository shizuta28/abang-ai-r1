import { AppError, parse } from '../errors.js'
import { leadSchema } from '../schemas.js'

export async function catalogRoutes(app) {
  app.get('/api/products', async (request) => {
    const type = ['COURSE', 'DIGITAL', 'RESOURCE'].includes(request.query?.type) ? request.query.type : undefined
    const products = await app.repos.listProducts({ type, publishedOnly: true })
    return { products }
  })

  app.get('/api/products/:slug', async (request) => {
    const product = await app.repos.findProductBySlug(request.params.slug)
    if (!product || !product.published) throw new AppError(404, 'not_found', 'That product was not found.')
    const user = await app.auth.readUser(request)
    const owned = Boolean(user) && (product.priceCents === 0 || await app.repos.userOwnsProduct(user.id, product.id))
    return { product, owned }
  })

  app.get('/api/pages', async () => {
    return { pages: await app.repos.listPages(true) }
  })

  app.get('/api/pages/:slug', async (request) => {
    const page = await app.repos.findPageBySlug(request.params.slug)
    if (!page || !page.published) throw new AppError(404, 'not_found', 'That page was not found.')
    return { page }
  })

  app.post('/api/leads', async (request) => {
    const body = parse(leadSchema, request.body)
    const user = await app.auth.readUser(request)
    const lead = await app.repos.createLead({
      name: body.name,
      email: body.email.toLowerCase(),
      phone: body.phone || null,
      source: body.source || 'website',
      message: body.message || null,
      userId: user?.id || null
    })
    return { lead }
  })

  app.get('/api/content/articles', async () => app.integrations.strapi.articles())

  app.get('/api/content/articles/:slug', async (request) => {
    const result = await app.integrations.strapi.findArticle(request.params.slug)
    if (!result.item) throw new AppError(404, 'not_found', 'That article was not found.')
    return result
  })

  app.get('/api/content/lessons', async (request) => {
    return app.integrations.strapi.lessons(request.query?.courseSlug)
  })

  app.get('/api/content/resources', async () => app.integrations.strapi.resources())

  app.get('/api/downloads/:productId', async (request, reply) => {
    const user = await app.auth.requireUser(request)
    const product = await app.repos.findProductById(request.params.productId)
    if (!product || !product.published) throw new AppError(404, 'not_found', 'That file was not found.')
    if (product.priceCents > 0) {
      const owned = await app.repos.userOwnsProduct(user.id, product.id)
      if (!owned) throw new AppError(403, 'not_purchased', 'Purchase this file before downloading it.')
    }
    if (!product.fileKey) throw new AppError(404, 'file_missing', 'This file has not been uploaded yet.')
    const url = await app.integrations.r2.signedDownload(product.fileKey)
    return reply.redirect(url)
  })
}
