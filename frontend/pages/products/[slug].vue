<script setup>
const { t, pick } = useLocale()
const route = useRoute()
const { data, error } = await useApiFetch(`/api/products/${route.params.slug}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })
useHead({ title: computed(() => `${pick(data.value?.product, 'title')} · Abang AI`) })
</script>

<template>
  <div v-if="data?.product" class="grid gap-8 px-5 pb-14 sm:px-10 lg:grid-cols-[1.3fr_0.7fr]">
    <article>
      <p class="text-sm font-bold text-violet-600">{{ t('nav.products') }}</p>
      <h1 class="mt-2 text-4xl font-extrabold tracking-tight">{{ pick(data.product, 'title') }}</h1>
      <p class="mt-4 text-lg text-[#5c5c6b] dark:text-zinc-300">{{ pick(data.product, 'summary') }}</p>
      <div class="mt-6"><SafeText :text="pick(data.product, 'description')" /></div>
    </article>
    <PurchaseBox :product="data.product" :owned="data.owned" />
  </div>
</template>
