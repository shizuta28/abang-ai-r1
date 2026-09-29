export function toIso(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.toISOString()
}

export function presentUser(row) {
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    name: row.name ?? null,
    avatarUrl: row.avatarUrl ?? row.avatar_url ?? null,
    role: row.role,
    locale: row.locale ?? 'bm',
    createdAt: toIso(row.createdAt ?? row.created_at)
  }
}

export function presentProduct(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    titleBm: row.titleBm ?? row.title_bm,
    titleEn: row.titleEn ?? row.title_en,
    summaryBm: row.summaryBm ?? row.summary_bm,
    summaryEn: row.summaryEn ?? row.summary_en,
    descriptionBm: row.descriptionBm ?? row.description_bm ?? '',
    descriptionEn: row.descriptionEn ?? row.description_en ?? '',
    priceCents: row.priceCents ?? row.price_cents,
    currency: row.currency ?? 'MYR',
    type: row.type,
    published: Boolean(row.published),
    coverUrl: row.coverUrl ?? row.cover_url ?? null,
    fileKey: row.fileKey ?? row.file_key ?? null,
    createdAt: toIso(row.createdAt ?? row.created_at)
  }
}

export function presentOrder(row) {
  if (!row) return null
  const items = row.items ?? row.order_items ?? []
  const payment = row.payment ?? null
  return {
    id: row.id,
    userId: row.userId ?? row.user_id ?? null,
    email: row.email,
    phone: row.phone,
    status: row.status,
    totalCents: row.totalCents ?? row.total_cents,
    currency: row.currency ?? 'MYR',
    billCode: row.billCode ?? row.bill_code ?? null,
    externalRef: row.externalRef ?? row.external_ref,
    paymentStatus: row.paymentStatus ?? row.payment_status ?? null,
    failureReason: row.failureReason ?? row.failure_reason ?? null,
    paidAt: toIso(row.paidAt ?? row.paid_at),
    createdAt: toIso(row.createdAt ?? row.created_at),
    items: items.map((item) => ({
      id: item.id,
      productId: item.productId ?? item.product_id,
      title: item.title,
      priceCents: item.priceCents ?? item.price_cents
    })),
    payment: payment
      ? {
          status: payment.status,
          refNo: payment.refNo ?? payment.ref_no ?? null,
          amountCents: payment.amountCents ?? payment.amount_cents,
          verifiedAt: toIso(payment.verifiedAt ?? payment.verified_at)
        }
      : null
  }
}

export function presentLead(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? null,
    source: row.source ?? null,
    message: row.message ?? null,
    status: row.status,
    createdAt: toIso(row.createdAt ?? row.created_at)
  }
}

export function presentPage(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    titleBm: row.titleBm ?? row.title_bm,
    titleEn: row.titleEn ?? row.title_en,
    bodyBm: row.bodyBm ?? row.body_bm,
    bodyEn: row.bodyEn ?? row.body_en,
    published: Boolean(row.published),
    updatedAt: toIso(row.updatedAt ?? row.updated_at)
  }
}

export function presentThread(row) {
  if (!row) return null
  return {
    id: row.id,
    body: row.body,
    status: row.status,
    scheduledAt: toIso(row.scheduledAt ?? row.scheduled_at),
    publishedAt: toIso(row.publishedAt ?? row.published_at),
    threadsMediaId: row.threadsMediaId ?? row.threads_media_id ?? null,
    reviewNote: row.reviewNote ?? row.review_note ?? null,
    createdAt: toIso(row.createdAt ?? row.created_at)
  }
}
