import { PrismaClient } from '@prisma/client'
import { presentLead, presentOrder, presentPage, presentProduct, presentThread, presentUser } from './present.js'
import { summarizeSales } from './summary.js'

const orderInclude = { items: true, payment: true }

export function createPrismaRepositories(connectionString) {
  process.env.DATABASE_URL = connectionString
  const prisma = new PrismaClient({
    datasources: { db: { url: connectionString } }
  })

  return {
    provider: 'prisma',
    async disconnect() {
      await prisma.$disconnect()
    },
    async ping() {
      await prisma.$queryRaw`SELECT 1`
    },
    async findUserById(id) {
      return presentUser(await prisma.user.findUnique({ where: { id } }))
    },
    async findUserByEmail(email) {
      return presentUser(await prisma.user.findUnique({ where: { email } }))
    },
    async findUserAuthByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return null
      return { ...presentUser(user), passwordHash: user.passwordHash, googleId: user.googleId }
    },
    async findUserByGoogleId(googleId) {
      const user = await prisma.user.findUnique({ where: { googleId } })
      if (!user) return null
      return { ...presentUser(user), passwordHash: user.passwordHash, googleId: user.googleId }
    },
    async createUser(data) {
      const user = await prisma.user.create({ data })
      return presentUser(user)
    },
    async updateUser(id, data) {
      const user = await prisma.user.update({ where: { id }, data })
      return presentUser(user)
    },
    async listProducts({ type, publishedOnly = false } = {}) {
      const rows = await prisma.product.findMany({
        where: {
          ...(type ? { type } : {}),
          ...(publishedOnly ? { published: true } : {})
        },
        orderBy: { createdAt: 'desc' }
      })
      return rows.map(presentProduct)
    },
    async findProductBySlug(slug) {
      return presentProduct(await prisma.product.findUnique({ where: { slug } }))
    },
    async findProductById(id) {
      return presentProduct(await prisma.product.findUnique({ where: { id } }))
    },
    async createProduct(data) {
      return presentProduct(await prisma.product.create({ data }))
    },
    async updateProduct(id, data) {
      return presentProduct(await prisma.product.update({ where: { id }, data }))
    },
    async deleteProduct(id) {
      await prisma.product.delete({ where: { id } })
    },
    async userOwnsProduct(userId, productId) {
      const hit = await prisma.orderItem.findFirst({
        where: { productId, order: { userId, status: 'PAID' } }
      })
      return Boolean(hit)
    },
    async createOrder({ userId, email, phone, externalRef, totalCents, item }) {
      const order = await prisma.order.create({
        data: {
          userId,
          email,
          phone,
          externalRef,
          totalCents,
          currency: 'MYR',
          items: {
            create: {
              productId: item.productId,
              title: item.title,
              priceCents: item.priceCents
            }
          }
        },
        include: orderInclude
      })
      return presentOrder(order)
    },
    async findOrderById(id) {
      return presentOrder(await prisma.order.findUnique({ where: { id }, include: orderInclude }))
    },
    async findOrderByExternalRef(externalRef) {
      return presentOrder(await prisma.order.findUnique({ where: { externalRef }, include: orderInclude }))
    },
    async listOrders() {
      const rows = await prisma.order.findMany({ include: orderInclude, orderBy: { createdAt: 'desc' }, take: 200 })
      return rows.map(presentOrder)
    },
    async listOrdersForUser(userId) {
      const rows = await prisma.order.findMany({
        where: { userId },
        include: orderInclude,
        orderBy: { createdAt: 'desc' }
      })
      return rows.map(presentOrder)
    },
    async attachBill(orderId, billCode) {
      return presentOrder(await prisma.order.update({
        where: { id: orderId },
        data: { billCode, paymentStatus: 'bill_created' },
        include: orderInclude
      }))
    },
    async markOrderPaid(orderId, info) {
      return prisma.$transaction(async (tx) => {
        const current = await tx.order.findUnique({ where: { id: orderId } })
        if (!current) return null
        if (current.status !== 'PAID') {
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: 'PAID',
              paidAt: new Date(),
              paymentStatus: 'verified',
              failureReason: null,
              billCode: info.billCode || current.billCode
            }
          })
        }
        await tx.paymentRecord.upsert({
          where: { orderId },
          create: {
            orderId,
            provider: 'toyyibpay',
            billCode: info.billCode,
            refNo: info.refNo || null,
            status: 'verified',
            amountCents: info.amountCents,
            verifiedAt: new Date(),
            rawPayload: info.rawPayload ?? undefined
          },
          update: {
            refNo: info.refNo || null,
            status: 'verified',
            amountCents: info.amountCents,
            verifiedAt: new Date(),
            rawPayload: info.rawPayload ?? undefined
          }
        })
        return presentOrder(await tx.order.findUnique({ where: { id: orderId }, include: orderInclude }))
      })
    },
    async markOrderFailed(orderId, reason) {
      const current = await prisma.order.findUnique({ where: { id: orderId } })
      if (!current || current.status === 'PAID') return presentOrder(await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude }))
      return presentOrder(await prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILED', paymentStatus: 'failed', failureReason: reason },
        include: orderInclude
      }))
    },
    async cancelOrder(orderId) {
      const current = await prisma.order.findUnique({ where: { id: orderId } })
      if (!current) return null
      if (current.status === 'PAID') {
        const error = new Error('Paid orders cannot be cancelled.')
        error.code = 'paid_order'
        throw error
      }
      return presentOrder(await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED', paymentStatus: 'cancelled' },
        include: orderInclude
      }))
    },
    async createLead(data) {
      return presentLead(await prisma.lead.create({ data }))
    },
    async listLeads() {
      const rows = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 300 })
      return rows.map(presentLead)
    },
    async updateLead(id, data) {
      return presentLead(await prisma.lead.update({ where: { id }, data }))
    },
    async listPages(publishedOnly = false) {
      const rows = await prisma.salesPage.findMany({
        where: publishedOnly ? { published: true } : {},
        orderBy: { updatedAt: 'desc' }
      })
      return rows.map(presentPage)
    },
    async findPageBySlug(slug) {
      return presentPage(await prisma.salesPage.findUnique({ where: { slug } }))
    },
    async createPage(data) {
      return presentPage(await prisma.salesPage.create({ data }))
    },
    async updatePage(id, data) {
      return presentPage(await prisma.salesPage.update({ where: { id }, data }))
    },
    async listThreads() {
      const rows = await prisma.threadPost.findMany({ orderBy: { updatedAt: 'desc' }, take: 200 })
      return rows.map(presentThread)
    },
    async createThread(data) {
      return presentThread(await prisma.threadPost.create({ data }))
    },
    async updateThread(id, data) {
      return presentThread(await prisma.threadPost.update({ where: { id }, data }))
    },
    async findThreadById(id) {
      return presentThread(await prisma.threadPost.findUnique({ where: { id } }))
    },
    async listDueThreads(now = new Date()) {
      const rows = await prisma.threadPost.findMany({
        where: { status: 'SCHEDULED', scheduledAt: { lte: now } }
      })
      return rows.map(presentThread)
    },
    async salesSummary() {
      const since = new Date()
      since.setUTCDate(since.getUTCDate() - 6)
      since.setUTCHours(0, 0, 0, 0)
      const [recentPaid, revenue, paidCount, pendingCount, failedCount, leadCount, productCount] = await Promise.all([
        prisma.order.findMany({
          where: { status: 'PAID', paidAt: { gte: since } },
          select: { paidAt: true, totalCents: true }
        }),
        prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { totalCents: true } }),
        prisma.order.count({ where: { status: 'PAID' } }),
        prisma.order.count({ where: { status: 'PENDING' } }),
        prisma.order.count({ where: { status: 'FAILED' } }),
        prisma.lead.count(),
        prisma.product.count()
      ])
      return summarizeSales({
        paidRevenueCents: revenue._sum.totalCents || 0,
        recentPaidOrders: recentPaid.map((order) => ({ paidAt: order.paidAt, totalCents: order.totalCents })),
        paidCount,
        pendingCount,
        failedCount,
        leadCount,
        productCount
      })
    }
  }
}
