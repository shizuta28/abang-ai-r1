<script setup>
const { t, pick } = useLocale()
const route = useRoute()
const { data, error } = await useFetch(`/api/pages/${route.params.slug}`)
if (error.value) throw createError({ statusCode: 404, statusMessage: 'Not found' })
useHead({ title: computed(() => `${pick(data.value?.page, 'title')} · Abang AI`) })
</script>

<template>
  <article v-if="data?.page" class="mx-auto max-w-3xl px-5 pb-16 sm:px-8">
    <p class="text-sm font-bold text-violet-600">{{ t('home.campaign') }}</p>
    <h1 class="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{{ pick(data.page, 'title') }}</h1>
    <div class="mt-8"><SafeText :text="pick(data.page, 'body')" /></div>
    <NuxtLink to="/courses" class="btn-lime mt-8">{{ t('hero.primary') }}</NuxtLink>
  </article>
</template>
