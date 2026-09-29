<script setup>
const { t, pick } = useLocale()
const route = useRoute()
const { data, error } = await useFetch(`/api/content/articles/${route.params.slug}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })
useHead({ title: computed(() => `${pick(data.value?.item, 'title')} · Abang AI`) })
</script>

<template>
  <article v-if="data?.item" class="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
    <NuxtLink to="/articles" class="text-sm font-bold text-violet-600">{{ t('nav.articles') }}</NuxtLink>
    <h1 class="mt-3 text-4xl font-extrabold tracking-tight">{{ pick(data.item, 'title') }}</h1>
    <p class="mt-4 text-lg text-[#5c5c6b] dark:text-zinc-300">{{ pick(data.item, 'excerpt') }}</p>
    <div class="mt-8">
      <SafeText :text="pick(data.item, 'body')" />
    </div>
  </article>
</template>
