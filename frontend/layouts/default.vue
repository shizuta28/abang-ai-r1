<template>
  <div class="min-h-screen bg-[#e6e6ea] px-3 py-3 text-[#16161c] dark:bg-[#09090b] dark:text-white sm:px-5 sm:py-5">
    <div class="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1180px] overflow-hidden rounded-[28px] border border-white/80 bg-[#f6f7fb] shadow-[0_30px_80px_rgba(20,16,40,0.12)] dark:border-white/10 dark:bg-[#101014]">
      <SiteHeader />
      <main id="content">
        <slot />
      </main>
      <SiteFooter />
    </div>
  </div>
</template>
