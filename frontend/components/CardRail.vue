<script setup>
const { t } = useLocale()

const cards = [
  { href: '/resources', title: 'rail.tools', caption: 'rail.toolsCaption', tone: 'bg-[#7461f2] text-white', kind: 'cloud' },
  { href: '/courses', title: 'rail.courses', caption: 'rail.coursesCaption', tone: 'bg-[#ff9aa8] text-[#3a2030]', kind: 'book' },
  { href: '/resources', title: 'rail.prompts', caption: 'rail.promptsCaption', tone: 'bg-[#2ad4cf] text-[#083533]', kind: 'blob', featured: true },
  { href: '/articles', title: 'rail.guides', caption: 'rail.guidesCaption', tone: 'bg-[#c6ef73] text-[#24310d]', kind: 'robot' },
  { href: '/articles', title: 'rail.news', caption: 'rail.newsCaption', tone: 'bg-[#6aa4ff] text-white', kind: 'sun' }
]
</script>

<template>
  <section class="relative overflow-hidden bg-[#070709] px-4 pb-8 pt-10 text-white sm:px-6">
    <span class="absolute left-8 top-6 text-xs text-white/30">✦</span>
    <span class="absolute right-16 top-10 text-xs text-white/25">✦</span>
    <span class="absolute bottom-8 left-1/3 text-xs text-white/20">+</span>

    <div class="mx-auto hidden max-w-5xl items-end justify-center md:flex">
      <div class="flex items-end justify-center">
        <NuxtLink
          v-for="(card, index) in cards"
          :key="card.title"
          :to="card.href"
          class="relative flex w-[148px] flex-col justify-between rounded-[28px] p-4 shadow-2xl transition duration-300 hover:-translate-y-2 xl:w-[180px]"
          :class="[card.tone, card.featured ? 'z-30 -mx-2 h-[300px] xl:h-[330px]' : 'z-10 -mx-4 h-[250px] xl:h-[270px]']"
          :style="{ transform: `rotate(${(index - 2) * 3.5}deg)` }"
        >
          <span v-if="card.featured" class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-black shadow-float">
            {{ t('rail.getStarted') }} <span class="ml-1 inline-grid h-5 w-5 place-items-center rounded-full bg-[#dff56a] text-[10px]">↗</span>
          </span>
          <Mascot :kind="card.kind" />
          <span>
            <span class="block text-xl font-extrabold leading-none">{{ t(card.title) }}</span>
            <span class="mt-1 block text-xs opacity-80">{{ t(card.caption) }}</span>
          </span>
        </NuxtLink>
      </div>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-2 md:hidden">
      <NuxtLink v-for="card in cards" :key="card.title" :to="card.href" class="flex h-[280px] min-w-[210px] snap-center flex-col justify-between rounded-[28px] p-4" :class="card.tone">
        <Mascot :kind="card.kind" />
        <span>
          <span class="block text-xl font-extrabold">{{ t(card.title) }}</span>
          <span class="mt-1 block text-xs opacity-80">{{ t(card.caption) }}</span>
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
