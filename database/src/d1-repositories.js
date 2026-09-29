import { createD1Client, newId, nowIso } from './d1.js'
import { presentLead, presentOrder, presentPage, presentProduct, presentThread, presentUser } from './present.js'
import { summarizeSales } from './summary.js'

function flag(value) {
  return value ? 1 : 0
}

async function hydrateOrder(db, row) {
  if (!row) return null
  const items = await db.query('SELECT * FROM order_items WHERE order_id = ?', [row.id])
  const payments = await db.query('SELECT * FROM payment_records WHERE order_id = ?', [row.id])
  return presentOrder({ ...row, items, payment: payments[0] || null })
}

export function createD1Repositories(database) {
  const db = createD1Client(database)

  return {
    provider: 'd1',
    async disconnect() {},
    async ping() {
      await db.query('SELECT 1 AS ok')
    },
    async findUserById(id) {
      const rows = await db.query('SELECT * FROM users WHERE id = ?', [id])
      return presentUser(rows[0])
    },
    async findUserByEmail(email) {
      const rows = await db.query('SELECT * FROM users WHERE email = ?', [email])
      return presentUser(rows[0])
    },
    async findUserAuthByEmail(email) {
      const rows = await db.query('SELECT * FROM users WHERE email = ?', [email])
      if (!rows[0]) return null
      return { ...presentUser(rows[0]), passwordHash: rows[0].password_hash, googleId: rows[0].google_id }
    },
    async findUserByGoogleId(googleId) {
      const rows = await db.query('SELECT * FROM users WHERE google_id = ?', [googleId])
      if (!rows[0]) return null
      return { ...presentUser(rows[0]), passwordHash: rows[0].password_hash, googleId: rows[0].google_id }
    },
    async createUser(data) {
      const timestamp = nowIso()
      const id = newId()
      await db.query(
        `INSERT INTO users (id, email, name, avatar_url, google_id, password_hash, role, locale, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, data.email, data.name ?? null, data.avatarUrl ?? null, data.googleId ?? null, data.passwordHash ?? null, data.role ?? 'MEMBER', data.locale ?? 'bm', timestamp, timestamp]
      )
      return this.findUserById(id)
    },
    async updateUser(id, data) {
      const rows = await db.query('SELECT * FROM users WHERE id = ?', [id])
      const row = rows[0]
      if (!row) return null
      await db.query(
        `UPDATE users SET name = ?, avatar_url = ?, google_id = ?, password_hash = ?, role = ?, locale = ?, updated_at = ? WHERE id = ?`,
        [
          data.name !== undefined ? data.name : row.name,
          data.avatarUrl !== undefined ? data.avatarUrl : row.avatar_url,
          data.googleId !== undefined ? data.googleId : row.google_id,
          data.passwordHash !== undefined ? data.passwordHash : row.password_hash,
          data.role !== undefined ? data.role : row.role,
          data.locale !== undefined ? data.locale : row.locale,
          nowIso(),
          id
        ]
      )
      return this.findUserById(id)
    },
    async listProducts({ type, publishedOnly = false } = {}) {
      const clauses = []
      const params = []
      if (type) {
        clauses.push('type = ?')
        params.push(type)
      }
      if (publishedOnly) clauses.push('published = 1')
      const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
      const rows = await db.query(`SELECT * FROM products ${where} ORDER BY created_at DESC`, params)
      return rows.map(presentProduct)
    },
    async findProductBySlug(slug) {
      const rows = await db.query('SELECT * FROM products WHERE slug = ?', [slug])
      return presentProduct(rows[0])
    },
    async findProductById(id) {
      const rows = await db.query('SELECT * FROM products WHERE id = ?', [id])
      return presentProduct(rows[0])
    },
    async createProduct(data) {
      const id = newId()
      const timestamp = nowIso()
      await db.query(
        `INSERT INTO products (id, slug, title_bm, title_en, summary_bm, summary_en, description_bm, description_en, price_cents, currency, type, published, cover_url, file_key, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'MYR', ?, ?, ?, ?, ?, ?)`,
        [id, data.slug, data.titleBm, data.titleEn, data.summaryBm, data.summaryEn, data.descriptionBm ?? '', data.descriptionEn ?? '', data.priceCents, data.type, flag(data.published), data.coverUrl ?? null, data.fileKey ?? null, timestamp, timestamp]
      )
      return this.findProductById(id)
    },
    async updateProduct(id, data) {
      const current = await this.findProductById(id)
      if (!current) return null
      const next = { ...current, ...data }
      await db.query(
        `UPDATE products SET slug = ?, title_bm = ?, title_en = ?, summary_bm = ?, summary_en = ?, description_bm = ?, description_en = ?, price_cents = ?, type = ?, published = ?, cover_url = ?, file_key = ?, updated_at = ? WHERE id = ?`,
        [next.slug, next.titleBm, next.titleEn, next.summaryBm, next.summaryEn, next.descriptionBm ?? '', next.descriptionEn ?? '', next.priceCents, next.type, flag(next.published), next.coverUrl ?? null, next.fileKey ?? null, nowIso(), id]
      )
      return this.findProductById(id)
    },
    async deleteProduct(id) {
      await db.query('DELETE FROM products WHERE id = ?', [id])
    },
    async userOwnsProduct(userId, productId) {
      const rows = await db.query(
        `SELECT order_items.id FROM order_items
         JOIN orders ON orders.id = order_items.order_id
         WHERE order_items.product_id = ? AND orders.user_id = ? AND orders.status = 'PAID' LIMIT 1`,
        [productId, userId]
      )
      return rows.length > 0
    },
    async createOrder({ userId, email, phone, externalRef, totalCents, item }) {
      const id = newId()
      const itemId = newId()
      const timestamp = nowIso()
      await db.query(
        `INSERT INTO orders (id, user_id, email, phone, status, total_cents, currency, external_ref, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'PENDING', ?, 'MYR', ?, ?, ?)`,
        [id, userId, email, phone, totalCents, externalRef, timestamp, timestamp]
      )
      await db.query(
        `INSERT INTO order_items (id, order_id, product_id, title, price_cents) VALUES (?, ?, ?, ?, ?)`,
        [itemId, id, item.productId, item.title, item.priceCents]
      )
      return this.findOrderById(id)
    },
    async findOrderById(id) {
      const rows = await db.query('SELECT * FROM orders WHERE id = ?', [id])
      return hydrateOrder(db, rows[0])
    },
    async findOrderByExternalRef(externalRef) {
      const rows = await db.query('SELECT * FROM orders WHERE external_ref = ?', [externalRef])
      return hydrateOrder(db, rows[0])
    },
    async listOrders() {
      const rows = await db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 200')
      return Promise.all(rows.map((row) => hydrateOrder(db, row)))
    },
    async listOrdersForUser(userId) {
      const rows = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId])
      return Promise.all(rows.map((row) => hydrateOrder(db, row)))
    },
    async attachBill(orderId, billCode) {
      await db.query(`UPDATE orders SET bill_code = ?, payment_status = 'bill_created', updated_at = ? WHERE id = ?`, [billCode, nowIso(), orderId])
      return this.findOrderById(orderId)
    },
    async markOrderPaid(orderId, info) {
      const current = await this.findOrderById(orderId)
      if (!current) return null
      const verifiedAt = nowIso()
      if (current.status !== 'PAID') {
        await db.query(
          `UPDATE orders SET status = 'PAID', paid_at = ?, payment_status = 'verified', failure_reason = NULL, bill_code = ?, updated_at = ? WHERE id = ? AND status <> 'PAID'`,
          [verifiedAt, info.billCode || current.billCode, verifiedAt, orderId]
        )
      }
      await db.query(
        `INSERT INTO payment_records (id, order_id, provider, bill_code, ref_no, status, amount_cents, verified_at, raw_payload, created_at)
         VALUES (?, ?, 'toyyibpay', ?, ?, 'verified', ?, ?, ?, ?)
         ON CONFLICT(order_id) DO UPDATE SET ref_no = excluded.ref_no, status = 'verified', amount_cents = excluded.amount_cents, verified_at = excluded.verified_at, raw_payload = excluded.raw_payload`,
        [newId(), orderId, info.billCode, info.refNo || null, info.amountCents, verifiedAt, JSON.stringify(info.rawPayload ?? null), verifiedAt]
      )
      return this.findOrderById(orderId)
    },
    async markOrderFailed(orderId, reason) {
      const current = await this.findOrderById(orderId)
      if (!current || current.status === 'PAID') return current
      await db.query(
        `UPDATE orders SET status = 'FAILED', payment_status = 'failed', failure_reason = ?, updated_at = ? WHERE id = ? AND status <> 'PAID'`,
        [reason, nowIso(), orderId]
      )
      return this.findOrderById(orderId)
    },
    async cancelOrder(orderId) {
      const current = await this.findOrderById(orderId)
      if (!current) return null
      if (current.status === 'PAID') {
        const error = new Error('Paid orders cannot be cancelled.')
        error.code = 'paid_order'
        throw error
      }
      await db.query(`UPDATE orders SET status = 'CANCELLED', payment_status = 'cancelled', updated_at = ? WHERE id = ?`, [nowIso(), orderId])
      return this.findOrderById(orderId)
    },
    async createLead(data) {
      const id = newId()
      const timestamp = nowIso()
      await db.query(
        `INSERT INTO leads (id, name, email, phone, source, message, status, user_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)`,
        [id, data.name, data.email, data.phone ?? null, data.source ?? null, data.message ?? null, data.userId ?? null, timestamp, timestamp]
      )
      const rows = await db.query('SELECT * FROM leads WHERE id = ?', [id])
      return presentLead(rows[0])
    },
    async listLeads() {
      const rows = await db.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 300')
      return rows.map(presentLead)
    },
    async updateLead(id, data) {
      await db.query(`UPDATE leads SET status = ?, updated_at = ? WHERE id = ?`, [data.status, nowIso(), id])
      const rows = await db.query('SELECT * FROM leads WHERE id = ?', [id])
      return presentLead(rows[0])
    },
    async listPages(publishedOnly = false) {
      const rows = await db.query(
        `SELECT * FROM sales_pages ${publishedOnly ? 'WHERE published = 1' : ''} ORDER BY updated_at DESC`
      )
      return rows.map(presentPage)
    },
    async findPageBySlug(slug) {
      const rows = await db.query('SELECT * FROM sales_pages WHERE slug = ?', [slug])
      return presentPage(rows[0])
    },
    async createPage(data) {
      const id = newId()
      const timestamp = nowIso()
      await db.query(
        `INSERT INTO sales_pages (id, slug, title_bm, title_en, body_bm, body_en, published, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, data.slug, data.titleBm, data.titleEn, data.bodyBm, data.bodyEn, flag(data.published), timestamp, timestamp]
      )
      return this.findPageBySlug(data.slug)
    },
    async updatePage(id, data) {
      const current = presentPage((await db.query('SELECT * FROM sales_pages WHERE id = ?', [id]))[0])
      if (!current) return null
      const next = { ...current, ...data }
      await db.query(
        `UPDATE sales_pages SET slug = ?, title_bm = ?, title_en = ?, body_bm = ?, body_en = ?, published = ?, updated_at = ? WHERE id = ?`,
        [next.slug, next.titleBm, next.titleEn, next.bodyBm, next.bodyEn, flag(next.published), nowIso(), id]
      )
      return this.findPageBySlug(next.slug)
    },
    async listThreads() {
      const rows = await db.query('SELECT * FROM thread_posts ORDER BY updated_at DESC LIMIT 200')
      return rows.map(presentThread)
    },
    async createThread(data) {
      const id = newId()
      const timestamp = nowIso()
      await db.query(
        `INSERT INTO thread_posts (id, body, status, scheduled_at, review_note, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, data.body, data.status ?? 'DRAFT', data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null, data.reviewNote ?? null, timestamp, timestamp]
      )
      return this.findThreadById(id)
    },
    async findThreadById(id) {
      const rows = await db.query('SELECT * FROM thread_posts WHERE id = ?', [id])
      return presentThread(rows[0])
    },
    async updateThread(id, data) {
      const current = await this.findThreadById(id)
      if (!current) return null
      const next = { ...current, ...data }
      await db.query(
        `UPDATE thread_posts SET body = ?, status = ?, scheduled_at = ?, published_at = ?, threads_media_id = ?, review_note = ?, updated_at = ? WHERE id = ?`,
        [next.body, next.status, next.scheduledAt, next.publishedAt, next.threadsMediaId, next.reviewNote, nowIso(), id]
      )
      return this.findThreadById(id)
    },
    async listDueThreads(now = new Date()) {
      const rows = await db.query(
        `SELECT * FROM thread_posts WHERE status = 'SCHEDULED' AND scheduled_at IS NOT NULL AND scheduled_at <= ?`,
        [now.toISOString()]
      )
      return rows.map(presentThread)
    },
    async salesSummary() {
      const since = new Date()
      since.setUTCDate(since.getUTCDate() - 6)
      since.setUTCHours(0, 0, 0, 0)
      const [recentPaid, revenue, paidCount, pendingCount, failedCount, leadCount, productCount] = await Promise.all([
        db.query(`SELECT paid_at, total_cents FROM orders WHERE status = 'PAID' AND paid_at >= ?`, [since.toISOString()]),
        db.query(`SELECT COALESCE(SUM(total_cents), 0) AS total FROM orders WHERE status = 'PAID'`),
        db.query(`SELECT COUNT(*) AS count FROM orders WHERE status = 'PAID'`),
        db.query(`SELECT COUNT(*) AS count FROM orders WHERE status = 'PENDING'`),
        db.query(`SELECT COUNT(*) AS count FROM orders WHERE status = 'FAILED'`),
        db.query('SELECT COUNT(*) AS count FROM leads'),
        db.query('SELECT COUNT(*) AS count FROM products')
      ])
      const countOf = (rows) => Number(rows[0]?.count ?? 0)
      return summarizeSales({
        paidRevenueCents: Number(revenue[0]?.total ?? 0),
        recentPaidOrders: recentPaid.map((order) => ({ paidAt: order.paid_at, totalCents: order.total_cents })),
        paidCount: countOf(paidCount),
        pendingCount: countOf(pendingCount),
        failedCount: countOf(failedCount),
        leadCount: countOf(leadCount),
        productCount: countOf(productCount)
      })
    }
  }
}
