<script setup>
const props = defineProps({
  text: { type: String, default: '' }
})

const html = computed(() => {
  const escaped = String(props.text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  return escaped
    .split(/\n\n/)
    .map((part) => `<p>${part.replace(/\n/g, '<br>')}</p>`)
    .join('')
})
</script>

<template>
  <div class="space-y-3 text-[15px] leading-7" v-html="html" />
</template>
