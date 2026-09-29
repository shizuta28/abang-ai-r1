<template>
  <div class="min-h-screen bg-[#f3f3f6] text-[#16161c] dark:bg-[#0c0c10] dark:text-white">
    <div class="mx-auto grid max-w-7xl lg:grid-cols-[240px_1fr]">
      <AdminNav />
      <main class="px-4 py-6 sm:px-8">
        <slot />
      </main>
    </div>
  </div>
</template>
