<script setup>
const { t, pick } = useLocale()
const { data: courses, error: coursesError } = await useFetch('/api/products', { query: { type: 'COURSE' } })
const { data: products } = await useFetch('/api/products', { query: { type: 'DIGITAL' } })
const { data: articles, error: articlesError } = await useFetch('/api/content/articles')
const { data: pages } = await useFetch('/api/pages')

const campaign = computed(() => pages.value?.pages?.[0] || null)
const values = [
  ['home.value1Title', 'home.value1Text'],
  ['home.value2Title', 'home.value2Text'],
  ['home.value3Title', 'home.value3Text']
]

useHead({ title: 'Abang AI' })
</script>

<template>
  <HeroSection />
  <CardRail />

  <div class="space-y-14 px-4 py-12 sm:px-8">
    <NuxtLink v-if="campaign" :to="`/p/${campaign.slug}`" class="panel flex items-center justify-between gap-4 bg-[#17171c] text-white dark:bg-white dark:text-[#17171c]">
      <span>
        <span class="text-xs font-bold uppercase tracking-wide opacity-70">{{ t('home.campaign') }}</span>
        <span class="mt-1 block text-2xl font-extrabold">{{ pick(campaign, 'title') }}</span>
      </span>
      <span class="btn-lime">{{ t('home.viewAll') }}</span>
    </NuxtLink>

    <section>
      <h2 class="text-3xl font-extrabold tracking-tight">{{ t('home.valuesTitle') }}</h2>
      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <article v-for="item in values" :key="item[0]" class="panel">
          <h3 class="text-lg font-extrabold">{{ t(item[0]) }}</h3>
          <p class="mt-2 text-sm leading-6 text-[#5c5c6b] dark:text-zinc-400">{{ t(item[1]) }}</p>
        </article>
      </div>
    </section>

    <section>
      <div class="mb-5 flex items-end justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight">{{ t('home.courses') }}</h2>
        <NuxtLink to="/courses" class="text-sm font-bold text-violet-600">{{ t('home.viewAll') }}</NuxtLink>
      </div>
      <p v-if="coursesError" class="text-sm text-[#5c5c6b]">{{ t('common.offline') }}</p>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="product in courses?.products || []" :key="product.id" :product="product" :href="`/courses/${product.slug}`" />
      </div>
    </section>

    <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <div class="mb-5 flex items-end justify-between">
          <h2 class="text-3xl font-extrabold tracking-tight">{{ t('home.articles') }}</h2>
          <NuxtLink to="/articles" class="text-sm font-bold text-violet-600">{{ t('home.viewAll') }}</NuxtLink>
        </div>
        <p v-if="articlesError" class="text-sm">{{ t('common.offline') }}</p>
        <div v-else class="space-y-3">
          <NuxtLink v-for="article in (articles?.items || []).slice(0, 3)" :key="article.slug" :to="`/articles/${article.slug}`" class="panel block">
            <h3 class="text-lg font-extrabold">{{ pick(article, 'title') }}</h3>
            <p class="mt-2 text-sm text-[#5c5c6b] dark:text-zinc-400">{{ pick(article, 'excerpt') }}</p>
          </NuxtLink>
        </div>
      </div>
      <div id="leads">
        <h2 class="text-3xl font-extrabold tracking-tight">{{ t('home.leadTitle') }}</h2>
        <p class="mb-4 mt-2 text-sm text-[#5c5c6b] dark:text-zinc-400">{{ t('home.leadText') }}</p>
        <LeadForm />
      </div>
    </section>

    <section>
      <div class="mb-5 flex items-end justify-between">
        <h2 class="text-3xl font-extrabold tracking-tight">{{ t('home.products') }}</h2>
        <NuxtLink to="/products" class="text-sm font-bold text-violet-600">{{ t('home.viewAll') }}</NuxtLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="product in products?.products || []" :key="product.id" :product="product" :href="`/products/${product.slug}`" />
      </div>
    </section>
  </div>
</template>
