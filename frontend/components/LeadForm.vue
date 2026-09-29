<script setup>
const { t } = useLocale()
const { request, messageOf } = useApi()
const form = reactive({ name: '', email: '', phone: '', message: '', source: 'home' })
const pending = ref(false)
const error = ref('')
const success = ref('')

async function submit() {
  error.value = ''
  success.value = ''
  pending.value = true
  try {
    await request('/api/leads', { method: 'POST', body: form })
    success.value = t('lead.success')
    form.name = ''
    form.email = ''
    form.phone = ''
    form.message = ''
  } catch (err) {
    error.value = messageOf(err)
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="panel grid gap-3" @submit.prevent="submit">
    <label class="text-sm font-semibold">{{ t('lead.name') }}<input v-model="form.name" required class="field mt-2"></label>
    <label class="text-sm font-semibold">{{ t('lead.email') }}<input v-model="form.email" type="email" required class="field mt-2"></label>
    <label class="text-sm font-semibold">{{ t('lead.phone') }}<input v-model="form.phone" class="field mt-2"></label>
    <label class="text-sm font-semibold">{{ t('lead.message') }}<textarea v-model="form.message" rows="4" class="field mt-2" /></label>
    <AlertBanner :message="error" error />
    <AlertBanner :message="success" />
    <button class="btn-ink" :disabled="pending">{{ pending ? t('common.loading') : t('lead.submit') }}</button>
  </form>
</template>
