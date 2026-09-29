<script setup>
const { t } = useLocale()
const { request, messageOf } = useApi()
const auth = useAuth()
const route = useRoute()
const form = reactive({ name: '', email: '', password: '' })
const pending = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  pending.value = true
  try {
    const result = await request('/api/auth/signup', { method: 'POST', body: form })
    auth.user.value = result.user
    await navigateTo(safeNext(route.query.next))
  } catch (err) {
    error.value = messageOf(err)
  } finally {
    pending.value = false
  }
}

useHead({ title: `${t('auth.signupTitle')} · Abang AI` })
</script>

<template>
  <div class="mx-auto max-w-md px-5 pb-16">
    <h1 class="text-4xl font-extrabold tracking-tight">{{ t('auth.signupTitle') }}</h1>
    <a :href="`/api/auth/google?next=${encodeURIComponent(safeNext(route.query.next))}`" class="btn-line mt-6 w-full">
      <span class="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-black text-[#4285F4]">G</span>
      {{ t('auth.google') }}
    </a>
    <form class="mt-4 space-y-3" @submit.prevent="submit">
      <label class="block text-sm font-semibold">{{ t('auth.name') }}<input v-model="form.name" required minlength="2" class="field mt-2" autocomplete="name"></label>
      <label class="block text-sm font-semibold">{{ t('auth.email') }}<input v-model="form.email" type="email" required class="field mt-2" autocomplete="email"></label>
      <label class="block text-sm font-semibold">{{ t('auth.password') }}
        <input v-model="form.password" type="password" required minlength="8" class="field mt-2" autocomplete="new-password">
        <span class="mt-1 block font-normal text-[#5c5c6b] dark:text-zinc-400">{{ t('auth.passwordHint') }}</span>
      </label>
      <AlertBanner :message="error" error />
      <button class="btn-ink w-full" :disabled="pending">{{ pending ? t('common.loading') : t('auth.submitSignup') }}</button>
    </form>
    <p class="mt-4 text-sm">{{ t('auth.hasAccount') }} <NuxtLink to="/login" class="font-bold text-violet-600">{{ t('nav.login') }}</NuxtLink></p>
  </div>
</template>
