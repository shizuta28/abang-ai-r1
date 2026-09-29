<script setup>
const { t } = useLocale()
const { request, messageOf } = useApi()
const auth = useAuth()
const route = useRoute()
const form = reactive({ email: '', password: '' })
const pending = ref(false)
const error = ref(route.query.error === 'google' ? t('auth.googleError') : '')

async function submit() {
  error.value = ''
  pending.value = true
  try {
    const result = await request('/api/auth/login', { method: 'POST', body: form })
    auth.user.value = result.user
    await navigateTo(safeNext(route.query.next))
  } catch (err) {
    error.value = messageOf(err)
  } finally {
    pending.value = false
  }
}

const googleHref = computed(() => `/api/auth/google?next=${encodeURIComponent(safeNext(route.query.next))}`)
useHead({ title: `${t('auth.loginTitle')} · Abang AI` })
</script>

<template>
  <div class="mx-auto max-w-md px-5 pb-16">
    <h1 class="text-4xl font-extrabold tracking-tight">{{ t('auth.loginTitle') }}</h1>
    <a :href="googleHref" class="btn-line mt-6 w-full">
      <span class="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-black text-[#4285F4]">G</span>
      {{ t('auth.google') }}
    </a>
    <form class="mt-4 space-y-3" @submit.prevent="submit">
      <label class="block text-sm font-semibold">{{ t('auth.email') }}<input v-model="form.email" type="email" required class="field mt-2" autocomplete="email"></label>
      <label class="block text-sm font-semibold">{{ t('auth.password') }}<input v-model="form.password" type="password" required minlength="8" class="field mt-2" autocomplete="current-password"></label>
      <AlertBanner :message="error" error />
      <button class="btn-ink w-full" :disabled="pending">{{ pending ? t('common.loading') : t('auth.submitLogin') }}</button>
    </form>
    <p class="mt-4 text-sm">{{ t('auth.noAccount') }} <NuxtLink to="/signup" class="font-bold text-violet-600">{{ t('nav.signup') }}</NuxtLink></p>
  </div>
</template>
