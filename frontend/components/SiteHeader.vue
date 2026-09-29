<script setup>
const { locale, t, setLocale } = useLocale()
const auth = useAuth()
const colorMode = useColorMode()
const route = useRoute()
const open = ref(false)

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/courses', key: 'nav.courses' },
  { to: '/articles', key: 'nav.articles' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/products', key: 'nav.products' }
]

function active(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

watch(() => route.path, () => {
  open.value = false
})
</script>

<template>
  <header class="relative px-4 py-4 sm:px-6">
    <a href="#content" class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-white focus:px-3 focus:py-2">Skip to content</a>
    <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3">
      <NuxtLink to="/" class="flex items-center gap-2 text-lg font-extrabold tracking-tight">
        <span class="grid h-9 w-9 place-items-center rounded-full bg-[#17171c] text-[#dff56a]">
          <svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M12 1.5l1.3 7.1L20.5 10l-7.2 1.4L12 18.5l-1.3-7.1L3.5 10l7.2-1.4L12 1.5z"/></svg>
        </span>
        Abang AI
      </NuxtLink>

      <nav class="hidden min-w-0 items-center justify-self-center rounded-full bg-[#17171c] p-1 text-sm text-white lg:flex" :aria-label="t('nav.menu')">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-2.5 py-1.5 text-white/75 transition hover:text-white xl:px-3"
          :class="active(link.to) ? 'bg-white/15 text-white' : ''"
        >
          {{ t(link.key) }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-1.5 sm:gap-2">
        <div class="flex rounded-full bg-black/5 p-1 text-xs font-bold dark:bg-white/10">
          <button type="button" class="rounded-full px-2 py-1" :class="locale === 'bm' ? 'bg-white text-black dark:bg-zinc-200' : ''" @click="setLocale('bm')">BM</button>
          <button type="button" class="rounded-full px-2 py-1" :class="locale === 'en' ? 'bg-white text-black dark:bg-zinc-200' : ''" @click="setLocale('en')">EN</button>
        </div>
        <button type="button" class="grid h-9 w-9 place-items-center rounded-full border border-black/10 dark:border-white/15" :aria-label="colorMode.value === 'dark' ? 'Light mode' : 'Dark mode'" @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'">
          <span v-if="colorMode.value === 'dark'">☀</span>
          <span v-else>☾</span>
        </button>
        <NuxtLink v-if="auth.user.value?.role === 'ADMIN'" to="/admin" class="hidden text-sm font-semibold sm:inline">{{ t('nav.admin') }}</NuxtLink>
        <NuxtLink v-if="auth.user.value" to="/account" class="hidden text-sm font-semibold sm:inline">{{ t('nav.account') }}</NuxtLink>
        <NuxtLink v-else to="/login" class="hidden text-sm font-semibold sm:inline">{{ t('nav.login') }}</NuxtLink>
        <NuxtLink v-if="!auth.user.value" to="/signup" class="btn-ink !px-3 !py-2">{{ t('nav.signup') }}</NuxtLink>
        <button type="button" class="grid h-10 w-10 place-items-center rounded-full border border-black/10 lg:hidden dark:border-white/15" :aria-expanded="open" :aria-label="t('nav.menu')" @click="open = !open">
          <span class="text-lg">{{ open ? '×' : '☰' }}</span>
        </button>
      </div>
    </div>

    <div v-if="open" class="mt-3 rounded-3xl bg-[#17171c] p-3 text-white lg:hidden">
      <NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="block rounded-2xl px-3 py-3 text-sm font-semibold text-white/90">{{ t(link.key) }}</NuxtLink>
      <NuxtLink v-if="auth.user.value" to="/account" class="block rounded-2xl px-3 py-3 text-sm font-semibold">{{ t('nav.account') }}</NuxtLink>
      <NuxtLink v-else to="/login" class="block rounded-2xl px-3 py-3 text-sm font-semibold">{{ t('nav.login') }}</NuxtLink>
      <NuxtLink v-if="auth.user.value?.role === 'ADMIN'" to="/admin" class="block rounded-2xl px-3 py-3 text-sm font-semibold">{{ t('nav.admin') }}</NuxtLink>
    </div>
  </header>
</template>
