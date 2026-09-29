<script setup>
definePageMeta({ middleware: 'auth' })
const { t, locale, setLocale } = useLocale()
const { request, messageOf } = useApi()
const { money } = useMoney()
const auth = useAuth()
const { data } = await useApiFetch('/api/orders/mine')
const name = ref(auth.user.value?.name || '')
const message = ref('')
const error = ref('')

async function save() {
  error.value = ''
  message.value = ''
  try {
    const result = await request('/api/account', { method: 'PATCH', body: { name: name.value, locale: locale.value } })
    auth.user.value = result.user
    message.value = t('account.saved')
  } catch (err) {
    error.value = messageOf(err)
  }
}

watch(locale, () => {
  if (auth.user.value) request('/api/account', { method: 'PATCH', body: { locale: locale.value } }).catch(() => {})
})

useHead({ title: `${t('account.title')} · Abang AI` })
</script>

<template>
  <div class="grid gap-8 px-5 pb-14 sm:px-10 lg:grid-cols-[0.8fr_1.2fr]">
    <form class="panel space-y-3" @submit.prevent="save">
      <h1 class="text-3xl font-extrabold">{{ t('account.title') }}</h1>
      <p class="text-sm text-[#5c5c6b] dark:text-zinc-400">{{ auth.user.value?.email }}</p>
      <label class="block text-sm font-semibold">{{ t('auth.name') }}<input v-model="name" class="field mt-2"></label>
      <div class="flex gap-2">
        <button type="button" class="btn-line" :class="locale === 'bm' ? 'bg-[#17171c] text-white' : ''" @click="setLocale('bm')">BM</button>
        <button type="button" class="btn-line" :class="locale === 'en' ? 'bg-[#17171c] text-white' : ''" @click="setLocale('en')">EN</button>
      </div>
      <AlertBanner :message="error" error />
      <AlertBanner :message="message" />
      <button class="btn-ink">{{ t('account.save') }}</button>
      <button type="button" class="btn-line w-full" @click="auth.logout()">{{ t('nav.logout') }}</button>
    </form>
    <section>
      <h2 class="text-2xl font-extrabold">{{ t('account.orders') }}</h2>
      <p v-if="!(data?.orders || []).length" class="mt-4 text-sm">{{ t('account.noOrders') }}</p>
      <div v-else class="mt-4 space-y-3">
        <article v-for="order in data.orders" :key="order.id" class="panel flex items-center justify-between gap-3">
          <div>
            <p class="font-bold">{{ order.items[0]?.title }}</p>
            <p class="text-sm text-[#5c5c6b] dark:text-zinc-400">{{ money(order.totalCents) }}</p>
          </div>
          <StatusPill :status="order.status" />
        </article>
      </div>
    </section>
  </div>
</template>
