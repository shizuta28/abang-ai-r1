<script setup>
const { locale } = useLocale()
useHead({
  htmlAttrs: { lang: computed(() => (locale.value === 'en' ? 'en' : 'ms')) }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
