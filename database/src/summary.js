function dayKey(value) {
  return new Date(value).toISOString().slice(0, 10)
}

export function summarizeSales({ paidRevenueCents, recentPaidOrders, paidCount, pendingCount, failedCount, leadCount, productCount }) {
  const days = []
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - offset)
    days.push({ date: date.toISOString().slice(0, 10), revenueCents: 0, orders: 0 })
  }
  const byDate = new Map(days.map((day) => [day.date, day]))
  for (const order of recentPaidOrders) {
    const bucket = byDate.get(dayKey(order.paidAt))
    if (!bucket) continue
    bucket.revenueCents += order.totalCents
    bucket.orders += 1
  }
  return {
    paidRevenueCents,
    paidOrders: paidCount,
    pendingOrders: pendingCount,
    failedOrders: failedCount,
    leads: leadCount,
    products: productCount,
    last7Days: days
  }
}
