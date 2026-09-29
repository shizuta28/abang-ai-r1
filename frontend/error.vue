<script setup>
const { t } = useLocale()
defineProps({ error: Object })
</script>

<template>
  <div class="grid min-h-screen place-items-center bg-[#e6e6ea] px-6 dark:bg-[#09090b]">
    <div class="panel max-w-md text-center">
      <p class="text-sm font-bold text-violet-600">{{ error?.statusCode || 500 }}</p>
      <h1 class="mt-2 text-3xl font-extrabold">{{ t('common.error') }}</h1>
      <NuxtLink to="/" class="btn-ink mt-6">Abang AI</NuxtLink>
    </div>
  </div>
</template>
