<script setup>
defineProps({
  message: { type: String, default: '' },
  error: { type: Boolean, default: false }
})
</script>

<template>
  <p v-if="message" class="rounded-2xl px-4 py-3 text-sm" :class="error ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200' : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200'">
    {{ message }}
  </p>
</template>
