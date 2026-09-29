export default defineNuxtConfig({
  compatibilityDate: '2026-09-29',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
    storageKey: 'abang-color-mode'
  },
  runtimeConfig: {
    apiInternal: process.env.NUXT_API_INTERNAL || process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000'
  },
  app: {
    head: {
      title: 'Abang AI',
      htmlAttrs: { lang: 'ms' },
      meta: [
        { name: 'description', content: 'Panduan, kursus, dan produk digital AI untuk semua.' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,560;1,9..144,650&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
        }
      ]
    }
  }
})
