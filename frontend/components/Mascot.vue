<script setup>
defineProps({
  kind: { type: String, default: 'blob' }
})
</script>

<template>
  <svg viewBox="0 0 120 120" class="h-28 w-28" aria-hidden="true">
    <g v-if="kind === 'cloud'">
      <ellipse cx="60" cy="68" rx="34" ry="24" fill="white" />
      <circle cx="42" cy="62" r="16" fill="white" />
      <circle cx="74" cy="58" r="18" fill="white" />
      <circle cx="48" cy="66" r="2" fill="#17171c" />
      <circle cx="66" cy="66" r="2" fill="#17171c" />
      <path d="M50 76c6 6 14 6 20 0" fill="none" stroke="#17171c" stroke-width="2" stroke-linecap="round" />
    </g>
    <g v-else-if="kind === 'book'">
      <rect x="28" y="28" width="64" height="68" rx="10" fill="white" />
      <path d="M60 34v56" stroke="#ff9aa8" stroke-width="3" />
      <circle cx="48" cy="58" r="2" fill="#17171c" />
      <circle cx="74" cy="58" r="2" fill="#17171c" />
      <path d="M52 70c5 5 12 5 18 0" fill="none" stroke="#17171c" stroke-width="2" stroke-linecap="round" />
    </g>
    <g v-else-if="kind === 'blob'">
      <path d="M30 70c0-30 18-48 40-42 22 4 28 28 22 46-8 24-40 30-62-4z" fill="white" />
      <circle cx="52" cy="62" r="3" fill="#083533" />
      <circle cx="74" cy="60" r="3" fill="#083533" />
      <path d="M54 76c8 8 16 6 22-2" fill="none" stroke="#083533" stroke-width="3" stroke-linecap="round" />
      <circle cx="86" cy="40" r="8" fill="#dff56a" />
    </g>
    <g v-else-if="kind === 'robot'">
      <rect x="34" y="36" width="52" height="46" rx="14" fill="white" />
      <rect x="46" y="24" width="28" height="16" rx="6" fill="white" />
      <circle cx="50" cy="58" r="4" fill="#24310d" />
      <circle cx="70" cy="58" r="4" fill="#24310d" />
      <rect x="48" y="70" width="24" height="4" rx="2" fill="#24310d" />
    </g>
    <g v-else>
      <circle cx="60" cy="62" r="28" fill="#ffe38a" />
      <circle cx="60" cy="62" r="14" fill="#f4a340" />
      <circle cx="54" cy="60" r="2" fill="#17171c" />
      <circle cx="66" cy="60" r="2" fill="#17171c" />
      <path d="M54 70c4 4 10 4 14 0" fill="none" stroke="#17171c" stroke-width="2" stroke-linecap="round" />
    </g>
  </svg>
</template>
