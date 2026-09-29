<script setup>
defineProps({ status: { type: String, default: '' } })

const tones = {
  PAID: 'bg-emerald-100 text-emerald-800',
  PENDING: 'bg-amber-100 text-amber-800',
  FAILED: 'bg-rose-100 text-rose-800',
  CANCELLED: 'bg-zinc-200 text-zinc-700',
  DRAFT: 'bg-zinc-200 text-zinc-700',
  IN_REVIEW: 'bg-violet-100 text-violet-800',
  SCHEDULED: 'bg-sky-100 text-sky-800',
  PUBLISHED: 'bg-emerald-100 text-emerald-800',
  new: 'bg-sky-100 text-sky-800',
  contacted: 'bg-amber-100 text-amber-800',
  qualified: 'bg-violet-100 text-violet-800',
  closed: 'bg-zinc-200 text-zinc-700'
}
</script>

<template>
  <span class="rounded-full px-2.5 py-1 text-xs font-bold" :class="tones[status] || 'bg-zinc-100 text-zinc-700'">{{ status }}</span>
</template>
