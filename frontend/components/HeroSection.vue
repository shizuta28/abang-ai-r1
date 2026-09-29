<script setup>
const { t } = useLocale()
</script>

<template>
  <section class="px-2 pb-2 sm:px-4">
    <h1 class="sr-only">{{ t('hero.titleA') }} {{ t('hero.titleB') }}</h1>
    <img
      src="/header.png"
      :alt="`${t('hero.titleA')} ${t('hero.titleB')}. ${t('hero.subtitle')}`"
      class="h-auto w-full rounded-[22px]"
      width="1024"
      height="576"
    />
    <div class="mt-4 flex flex-wrap gap-3 px-2 sm:px-3">
      <NuxtLink to="/courses" class="btn-lime">{{ t('hero.primary') }}</NuxtLink>
      <NuxtLink to="/products" class="btn-line">{{ t('hero.secondary') }}</NuxtLink>
    </div>
  </section>
</template>
