import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import helmet from '@fastify/helmet'
import multipart from '@fastify/multipart'
import rateLimit from '@fastify/rate-limit'
import Fastify from 'fastify'
import { createRepositories } from '@abang/database'
import { createIntegrations } from '@abang/integrations'
import { createAuth } from './auth.js'
import { loadConfig } from './config.js'
import { errorHandler } from './errors.js'
import { adminRoutes } from './routes/admin.js'
import { authRoutes } from './routes/auth.js'
import { catalogRoutes } from './routes/catalog.js'
import { orderRoutes } from './routes/orders.js'
import { paymentRoutes } from './routes/payments.js'
import { startScheduler } from './scheduler.js'

async function health(app, reply) {
  try {
    await app.repos.ping()
    return {
      ok: true,
      database: { provider: process.env.DATABASE_PROVIDER || 'postgres', connected: true },
      integrations: {
        google: app.integrations.google.enabled,
        toyyibpay: app.integrations.toyyibpay.enabled,
        r2: app.integrations.r2.enabled,
        strapi: app.integrations.strapi.enabled,
        threads: app.integrations.threads.enabled
      }
    }
  } catch (error) {
    app.log.error(error)
    return reply.code(503).send({
      ok: false,
      database: { provider: process.env.DATABASE_PROVIDER || 'postgres', connected: false }
    })
  }
}

export async function buildApp(options = {}) {
  const config = options.config || loadConfig()
  const repos = options.repos || createRepositories(process.env)
  const integrations = options.integrations || createIntegrations(config)
  const app = Fastify({ logger: options.logger ?? true, trustProxy: true })
  app.decorate('config', config)
  app.decorate('repos', repos)
  app.decorate('integrations', integrations)
  app.decorate('auth', createAuth(app))

  await app.register(cookie)
  await app.register(formbody)
  await app.register(multipart, { limits: { fileSize: 20 * 1024 * 1024, files: 1 } })
  await app.register(helmet)
  await app.register(cors, { origin: config.corsOrigin, credentials: true })
  await app.register(rateLimit, { max: 300, timeWindow: '1 minute' })
  app.setErrorHandler(errorHandler)
  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: 'not_found', message: 'That page or record was not found.' })
  })

  app.get('/health', (request, reply) => health(app, reply))
  app.get('/api/health', (request, reply) => health(app, reply))
  await authRoutes(app)
  await catalogRoutes(app)
  await orderRoutes(app)
  await paymentRoutes(app)
  await app.register(adminRoutes, { prefix: '/api/admin' })
  app.addHook('onClose', async () => {
    await repos.disconnect()
  })
  if (options.scheduler !== false) startScheduler(app)
  return app
}
