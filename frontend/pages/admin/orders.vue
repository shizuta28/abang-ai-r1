<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useLocale()
const { money } = useMoney()
const { request } = useApi()
const { data, refresh } = await useApiFetch('/api/admin/orders')

async function cancel(order) {
  await request(`/api/admin/orders/${order.id}/cancel`, { method: 'POST' })
  await refresh()
}
</script>

<template>
  <h1 class="text-3xl font-extrabold">{{ t('admin.orders') }}</h1>
  <div class="mt-6 overflow-x-auto">
    <table class="w-full min-w-[760px] text-left text-sm">
      <thead class="text-xs uppercase text-[#5c5c6b]"><tr><th class="py-2">Ref</th><th>Item</th><th>Total</th><th>{{ t('admin.status') }}</th><th></th></tr></thead>
      <tbody>
        <tr v-for="order in data?.orders || []" :key="order.id" class="border-t border-black/5 dark:border-white/10">
          <td class="py-3">{{ order.externalRef }}<p class="text-[#5c5c6b]">{{ order.email }}</p></td>
          <td>{{ order.items[0]?.title }}</td>
          <td>{{ money(order.totalCents) }}</td>
          <td><StatusPill :status="order.status" /><p class="mt-1 text-xs text-[#5c5c6b]">{{ order.paymentStatus }}</p></td>
          <td><button v-if="order.status === 'PENDING'" type="button" class="btn-line" @click="cancel(order)">{{ t('admin.cancel') }}</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
