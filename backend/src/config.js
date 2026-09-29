import { z } from 'zod'

function flag(value, fallback) {
  if (value == null || value === '') return fallback
  return value === 'true'
}

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  PUBLIC_SITE_URL: z.string().trim().url().default('http://localhost:3000'),
  CORS_ORIGIN: z.string().trim().min(1).default('http://localhost:3000'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters.'),
  COOKIE_SECURE: z.string().optional(),
  ADMIN_EMAILS: z.string().optional().default(''),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_REDIRECT_URI: z.string().optional().default(''),
  TOYYIBPAY_USER_SECRET_KEY: z.string().optional().default(''),
  TOYYIBPAY_CATEGORY_CODE: z.string().optional().default(''),
  TOYYIBPAY_BASE_URL: z.string().optional().default(''),
  TOYYIBPAY_RETURN_URL: z.string().optional().default(''),
  TOYYIBPAY_CALLBACK_URL: z.string().optional().default(''),
  TOYYIBPAY_CHANNEL: z.string().optional().default('2'),
  STRAPI_URL: z.string().trim().default(''),
  STRAPI_API_TOKEN: z.string().optional().default(''),
  R2_ACCOUNT_ID: z.string().optional().default(''),
  R2_ACCESS_KEY_ID: z.string().optional().default(''),
  R2_SECRET_ACCESS_KEY: z.string().optional().default(''),
  R2_BUCKET: z.string().optional().default(''),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional().default(''),
  THREADS_USER_ID: z.string().optional().default(''),
  THREADS_ACCESS_TOKEN: z.string().optional().default('')
})

export function loadConfig(env = process.env) {
  const parsed = envSchema.safeParse(env)
  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join(' ')
    throw new Error(`Invalid environment. ${message}`)
  }
  const value = parsed.data
  return {
    nodeEnv: value.NODE_ENV,
    port: value.PORT,
    publicSiteUrl: value.PUBLIC_SITE_URL.replace(/\/$/, ''),
    corsOrigin: value.CORS_ORIGIN,
    jwtSecret: value.JWT_SECRET,
    cookieSecure: flag(value.COOKIE_SECURE, value.NODE_ENV === 'production'),
    adminEmails: value.ADMIN_EMAILS.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean),
    google: {
      clientId: value.GOOGLE_CLIENT_ID,
      clientSecret: value.GOOGLE_CLIENT_SECRET,
      redirectUri: value.GOOGLE_REDIRECT_URI
    },
    toyyibpay: {
      userSecretKey: value.TOYYIBPAY_USER_SECRET_KEY,
      categoryCode: value.TOYYIBPAY_CATEGORY_CODE,
      baseUrl: value.TOYYIBPAY_BASE_URL,
      returnUrl: value.TOYYIBPAY_RETURN_URL || `${value.PUBLIC_SITE_URL.replace(/\/$/, '')}/checkout/return`,
      callbackUrl: value.TOYYIBPAY_CALLBACK_URL,
      channel: value.TOYYIBPAY_CHANNEL
    },
    strapi: {
      url: value.STRAPI_URL,
      token: value.STRAPI_API_TOKEN
    },
    r2: {
      accountId: value.R2_ACCOUNT_ID || value.CLOUDFLARE_ACCOUNT_ID,
      accessKeyId: value.R2_ACCESS_KEY_ID,
      secretAccessKey: value.R2_SECRET_ACCESS_KEY,
      bucket: value.R2_BUCKET
    },
    threads: {
      userId: value.THREADS_USER_ID,
      accessToken: value.THREADS_ACCESS_TOKEN
    }
  }
}
