<script setup>
const { t, locale, setLocale } = useLocale()
const colorMode = useColorMode()
const route = useRoute()
const links = [
  ['/admin', 'admin.dashboard'],
  ['/admin/leads', 'admin.leads'],
  ['/admin/products', 'admin.products'],
  ['/admin/orders', 'admin.orders'],
  ['/admin/pages', 'admin.pages'],
  ['/admin/threads', 'admin.threads']
]
</script>

<template>
  <aside class="border-b border-black/5 bg-white p-4 dark:border-white/10 dark:bg-[#141418] lg:min-h-screen lg:border-b-0 lg:border-r">
    <NuxtLink to="/" class="text-lg font-extrabold">Abang AI</NuxtLink>
    <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-violet-600">{{ t('admin.portal') }}</p>
    <nav class="mt-4 flex gap-2 overflow-x-auto lg:flex-col">
      <NuxtLink
        v-for="link in links"
        :key="link[0]"
        :to="link[0]"
        class="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold"
        :class="route.path === link[0] ? 'bg-[#17171c] text-white dark:bg-white dark:text-black' : 'hover:bg-black/5 dark:hover:bg-white/10'"
      >
        {{ t(link[1]) }}
      </NuxtLink>
    </nav>
    <div class="mt-4 flex gap-2">
      <button type="button" class="btn-line !px-3 !py-1" @click="setLocale(locale === 'bm' ? 'en' : 'bm')">{{ locale === 'bm' ? 'EN' : 'BM' }}</button>
      <button type="button" class="btn-line !px-3 !py-1" @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">{{ colorMode.value === 'dark' ? 'Light' : 'Dark' }}</button>
    </div>
  </aside>
</template>
