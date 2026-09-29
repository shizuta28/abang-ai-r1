<script setup>
const { t, pick } = useLocale()
const { data, error } = await useFetch('/api/content/articles')
useHead({ title: `${t('nav.articles')} · Abang AI` })
</script>

<template>
  <PageIntro :title="t('nav.articles')" :text="t('home.value1Text')" />
  <div class="grid gap-4 px-5 pb-12 sm:px-10 lg:grid-cols-3">
    <p v-if="error" class="lg:col-span-3">{{ t('common.offline') }}</p>
    <NuxtLink v-for="article in data?.items || []" :key="article.slug" :to="`/articles/${article.slug}`" class="panel block">
      <h2 class="text-xl font-extrabold">{{ pick(article, 'title') }}</h2>
      <p class="mt-3 text-sm leading-6 text-[#5c5c6b] dark:text-zinc-400">{{ pick(article, 'excerpt') }}</p>
    </NuxtLink>
  </div>
</template>
