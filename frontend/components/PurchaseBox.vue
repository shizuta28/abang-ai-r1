<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  owned: { type: Boolean, default: false }
})
const { t } = useLocale()
const { price } = useMoney()
const { request, messageOf } = useApi()
const auth = useAuth()
const phone = ref('')
const pending = ref(false)
const error = ref('')

async function buy() {
  error.value = ''
  if (!auth.user.value) {
    await navigateTo(`/login?next=${encodeURIComponent(useRoute().fullPath)}`)
    return
  }
  pending.value = true
  try {
    const result = await request('/api/orders', {
      method: 'POST',
      body: { productId: props.product.id, phone: phone.value }
    })
    if (result.paymentUrl) {
      window.location.href = result.paymentUrl
      return
    }
  } catch (err) {
    error.value = messageOf(err)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="panel space-y-4">
    <p class="text-2xl font-extrabold">{{ price(product.priceCents) }}</p>
    <AlertBanner v-if="owned" :message="t('catalog.owned')" />
    <template v-else-if="product.priceCents > 0">
      <label class="block text-sm font-semibold">
        {{ t('catalog.phone') }}
        <input v-model="phone" class="field mt-2" inputmode="tel" autocomplete="tel" placeholder="0123456789">
      </label>
      <button type="button" class="btn-ink w-full" :disabled="pending" @click="buy">
        {{ pending ? t('common.loading') : t('catalog.pay') }}
      </button>
    </template>
    <a v-else :href="`/api/downloads/${product.id}`" class="btn-lime w-full">{{ t('catalog.download') }}</a>
    <AlertBanner :message="error" error />
    <p v-if="product.priceCents === 0 && !product.fileKey" class="text-sm text-[#5c5c6b] dark:text-zinc-400">{{ t('catalog.fileSoon') }}</p>
  </div>
</template>
