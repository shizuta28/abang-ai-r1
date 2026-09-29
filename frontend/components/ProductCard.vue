<script setup>
const props = defineProps({
  product: { type: Object, required: true },
  href: { type: String, required: true }
})
const { pick, t } = useLocale()
const { price } = useMoney()

const tone = {
  COURSE: 'from-violet-500 to-fuchsia-400',
  DIGITAL: 'from-cyan-400 to-sky-500',
  RESOURCE: 'from-lime-300 to-emerald-400'
}
</script>

<template>
  <NuxtLink :to="href" class="panel block overflow-hidden p-3 transition hover:-translate-y-1">
    <div class="relative flex aspect-[4/3] items-end overflow-hidden rounded-[22px] bg-gradient-to-br p-4 text-white" :class="tone[product.type] || tone.COURSE">
      <img v-if="product.coverUrl" :src="product.coverUrl" :alt="pick(product, 'title')" class="absolute inset-0 h-full w-full rounded-[22px] object-cover">
      <span class="relative text-xs font-bold uppercase tracking-wide">{{ product.type }}</span>
    </div>
    <div class="px-2 py-4">
      <h3 class="text-lg font-extrabold leading-tight">{{ pick(product, 'title') }}</h3>
      <p class="mt-2 line-clamp-2 text-sm text-[#5c5c6b] dark:text-zinc-400">{{ pick(product, 'summary') }}</p>
      <p class="mt-4 text-sm font-bold">{{ price(product.priceCents) }}</p>
    </div>
  </NuxtLink>
</template>
