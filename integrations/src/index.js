import { createGoogleAuth } from './google.js'
import { createR2, safeObjectKey } from './r2.js'
import { createStrapi } from './strapi.js'
import { createThreads } from './threads.js'
import { createToyyibPay, decidePaymentOutcome } from './toyyibpay.js'

export function createIntegrations(config) {
  return {
    google: createGoogleAuth(config.google),
    toyyibpay: createToyyibPay(config.toyyibpay),
    r2: createR2(config.r2),
    strapi: createStrapi(config.strapi),
    threads: createThreads(config.threads)
  }
}

export { decidePaymentOutcome, safeObjectKey }
