import dotenv from 'dotenv'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
dotenv.config({ path: resolve(root, '.env') })
dotenv.config({ path: resolve(root, 'backend/.env') })

const { buildApp } = await import('./app.js')
const app = await buildApp()

try {
  await app.listen({ port: app.config.port, host: '0.0.0.0' })
  app.log.info({
    google: app.integrations.google.enabled,
    toyyibpay: app.integrations.toyyibpay.enabled,
    r2: app.integrations.r2.enabled,
    strapi: app.integrations.strapi.enabled,
    threads: app.integrations.threads.enabled,
    database: process.env.DATABASE_PROVIDER || 'postgres'
  }, 'Abang API ready')
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
