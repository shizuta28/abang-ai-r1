<script setup>
const { t, pick } = useLocale()
const { data: resources, error } = await useFetch('/api/content/resources')
const { data: files } = await useFetch('/api/products', { query: { type: 'RESOURCE' } })
useHead({ title: `${t('home.resources')} · Abang AI` })
</script>

<template>
  <PageIntro :title="t('home.resources')" :text="t('home.value3Text')" />
  <div class="space-y-10 px-5 pb-14 sm:px-10">
    <p v-if="error">{{ t('common.offline') }}</p>
    <div class="grid gap-4 lg:grid-cols-2">
      <article v-for="item in resources?.items || []" :key="item.slug" class="panel">
        <h2 class="text-xl font-extrabold">{{ pick(item, 'title') }}</h2>
        <p class="mt-2 text-sm text-[#5c5c6b] dark:text-zinc-400">{{ pick(item, 'summary') }}</p>
        <div class="mt-4 text-sm">
          <SafeText :text="pick(item, 'body')" />
        </div>
      </article>
    </div>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="product in files?.products || []" :key="product.id" :product="product" :href="`/products/${product.slug}`" />
    </div>
  </div>
</template>
