<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useLocale()
const { money } = useMoney()
const { data: summary } = await useApiFetch('/api/admin/summary')
const { data: status } = await useApiFetch('/api/admin/status')
const stats = computed(() => summary.value?.summary)
const maxBar = computed(() => Math.max(...(stats.value?.last7Days || []).map((day) => day.revenueCents), 1))
useHead({ title: 'Admin · Abang AI' })
</script>

<template>
  <h1 class="text-3xl font-extrabold">{{ t('admin.dashboard') }}</h1>
  <p class="mt-2 text-sm text-[#5c5c6b] dark:text-zinc-400">{{ t('admin.strapi') }}
    <a v-if="status?.strapiUrl" :href="`${status.strapiUrl}/admin`" class="font-bold text-violet-600" target="_blank" rel="noreferrer">{{ t('admin.openStrapi') }}</a>
  </p>
  <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
    <article class="panel"><p class="text-sm">{{ t('admin.revenue') }}</p><p class="mt-2 text-2xl font-extrabold">{{ money(stats?.paidRevenueCents || 0) }}</p></article>
    <article class="panel"><p class="text-sm">{{ t('admin.paid') }}</p><p class="mt-2 text-2xl font-extrabold">{{ stats?.paidOrders || 0 }}</p></article>
    <article class="panel"><p class="text-sm">{{ t('admin.pending') }}</p><p class="mt-2 text-2xl font-extrabold">{{ stats?.pendingOrders || 0 }}</p></article>
    <article class="panel"><p class="text-sm">{{ t('admin.failed') }}</p><p class="mt-2 text-2xl font-extrabold">{{ stats?.failedOrders || 0 }}</p></article>
    <article class="panel"><p class="text-sm">{{ t('admin.leadCount') }}</p><p class="mt-2 text-2xl font-extrabold">{{ stats?.leads || 0 }}</p></article>
    <article class="panel"><p class="text-sm">{{ t('admin.productCount') }}</p><p class="mt-2 text-2xl font-extrabold">{{ stats?.products || 0 }}</p></article>
  </div>
  <section class="panel mt-6">
    <h2 class="font-extrabold">{{ t('admin.last7') }}</h2>
    <div class="mt-4 flex h-40 items-end gap-2">
      <div v-for="day in stats?.last7Days || []" :key="day.date" class="flex flex-1 flex-col items-center justify-end">
        <div class="w-full rounded-t-lg bg-violet-500" :style="{ height: `${Math.max(8, (day.revenueCents / maxBar) * 120)}px` }" />
        <span class="mt-2 text-[10px]">{{ day.date.slice(5) }}</span>
      </div>
    </div>
  </section>
</template>
