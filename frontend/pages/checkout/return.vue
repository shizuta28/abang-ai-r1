<script setup>
definePageMeta({ middleware: 'auth' })
const { t } = useLocale()
const route = useRoute()
const ref = computed(() => String(route.query.order_id || route.query.orderId || ''))
const { data, error, refresh } = await useApiFetch(() => (ref.value ? `/api/orders/ref/${ref.value}` : null))
const tries = ref(0)

onMounted(() => {
  const timer = setInterval(async () => {
    tries.value += 1
    if (!ref.value || tries.value > 10 || ['PAID', 'FAILED', 'CANCELLED'].includes(data.value?.order?.status)) {
      clearInterval(timer)
      return
    }
    await refresh()
  }, 3000)
  onBeforeUnmount(() => clearInterval(timer))
})

useHead({ title: `${t('checkout.title')} · Abang AI` })
</script>

<template>
  <div class="mx-auto max-w-lg px-5 pb-16">
    <h1 class="text-4xl font-extrabold tracking-tight">{{ t('checkout.title') }}</h1>
    <p class="mt-3 text-[#5c5c6b] dark:text-zinc-300">{{ t('checkout.confirming') }}</p>
    <div class="panel mt-6">
      <p v-if="!ref || error">{{ t('checkout.missing') }}</p>
      <template v-else-if="data?.order">
        <StatusPill :status="data.order.status" />
        <p class="mt-4 font-semibold">
          {{ data.order.status === 'PAID' ? t('checkout.paid') : data.order.status === 'FAILED' ? t('checkout.failed') : t('checkout.pending') }}
        </p>
      </template>
    </div>
    <NuxtLink to="/products" class="btn-line mt-6">{{ t('checkout.shop') }}</NuxtLink>
  </div>
</template>
