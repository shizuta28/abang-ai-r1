import { z } from 'zod'

const slug = z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.')
const phone = z.string().trim().regex(/^[0-9+\-\s]{8,20}$/, 'Enter a valid phone number.')

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72)
})

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72)
})

export const accountSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  locale: z.enum(['bm', 'en']).optional()
}).refine((value) => value.name || value.locale, { message: 'Nothing to update.' })

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
  source: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal(''))
})

export const leadStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'closed'])
})

export const productSchema = z.object({
  slug,
  titleBm: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().min(2).max(160),
  summaryBm: z.string().trim().min(2).max(400),
  summaryEn: z.string().trim().min(2).max(400),
  descriptionBm: z.string().trim().max(8000).optional(),
  descriptionEn: z.string().trim().max(8000).optional(),
  priceCents: z.coerce.number().int().min(0).max(10_000_000),
  type: z.enum(['COURSE', 'DIGITAL', 'RESOURCE']),
  published: z.boolean().optional(),
  coverUrl: z.string().trim().max(500).nullable().optional(),
  fileKey: z.string().trim().max(300).nullable().optional()
})

export const orderSchema = z.object({
  productId: z.string().trim().min(1),
  phone
})

export const pageSchema = z.object({
  slug,
  titleBm: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().min(2).max(160),
  bodyBm: z.string().trim().min(2).max(20000),
  bodyEn: z.string().trim().min(2).max(20000),
  published: z.boolean().optional()
})

export const threadSchema = z.object({
  body: z.string().trim().min(2).max(500),
  reviewNote: z.string().trim().max(500).optional().or(z.literal(''))
})

export const threadUpdateSchema = z.object({
  body: z.string().trim().min(2).max(500).optional(),
  status: z.enum(['DRAFT', 'IN_REVIEW', 'SCHEDULED']).optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  reviewNote: z.string().trim().max(500).nullable().optional()
})
