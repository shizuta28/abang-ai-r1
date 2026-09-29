<script setup>
const { t } = useLocale()
const { data, error } = await useFetch('/api/products', { query: { type: 'DIGITAL' } })
useHead({ title: `${t('home.products')} · Abang AI` })
</script>

<template>
  <PageIntro :title="t('home.products')" :text="t('home.value2Text')" />
  <div class="px-5 pb-12 sm:px-10">
    <p v-if="error">{{ t('common.offline') }}</p>
    <p v-else-if="!(data?.products || []).length">{{ t('catalog.empty') }}</p>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="product in data.products" :key="product.id" :product="product" :href="`/products/${product.slug}`" />
    </div>
  </div>
</template>
