<script setup>
const props = defineProps({
  eyebrow: String,
  title: String,
  text: String
})
</script>

<template>
  <section class="px-5 pb-8 pt-2 sm:px-10">
    <p v-if="eyebrow" class="text-sm font-bold text-violet-600">{{ eyebrow }}</p>
    <h1 class="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">{{ title }}</h1>
    <p v-if="text" class="mt-3 max-w-2xl text-[#5c5c6b] dark:text-zinc-300">{{ text }}</p>
  </section>
</template>
