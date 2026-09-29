<script setup>
const { t } = useLocale()
</script>

<template>
  <footer class="border-t border-black/5 px-5 py-8 text-sm text-[#5c5c6a] dark:border-white/10 dark:text-zinc-400 sm:px-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-base font-extrabold text-[#16161c] dark:text-white">Abang AI</p>
        <p class="mt-1 max-w-md">{{ t('footer.blurb') }}</p>
      </div>
      <div class="flex flex-wrap gap-3 font-semibold">
        <NuxtLink to="/courses">{{ t('nav.courses') }}</NuxtLink>
        <NuxtLink to="/articles">{{ t('nav.articles') }}</NuxtLink>
        <NuxtLink to="/resources">{{ t('nav.resources') }}</NuxtLink>
        <NuxtLink to="/products">{{ t('nav.products') }}</NuxtLink>
      </div>
    </div>
    <p class="mt-6 text-xs">© {{ new Date().getFullYear() }} {{ t('footer.rights') }}</p>
  </footer>
</template>
