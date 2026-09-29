<script setup>
const { t } = useLocale()
const { data, error } = await useFetch('/api/products', { query: { type: 'COURSE' } })
useHead({ title: `${t('nav.courses')} · Abang AI` })
</script>

<template>
  <PageIntro :title="t('nav.courses')" :text="t('home.value1Text')" />
  <div class="px-5 pb-12 sm:px-10">
    <p v-if="error">{{ t('common.offline') }}</p>
    <p v-else-if="!(data?.products || []).length" class="text-sm">{{ t('catalog.empty') }}</p>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="product in data.products" :key="product.id" :product="product" :href="`/courses/${product.slug}`" />
    </div>
  </div>
</template>
