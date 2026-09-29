<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useLocale()
const { request, messageOf } = useApi()
const { data, refresh } = await useApiFetch('/api/admin/threads')
const { data: status } = await useApiFetch('/api/admin/status')
const body = ref('')
const error = ref('')
const when = ref('')
const columns = ['DRAFT', 'IN_REVIEW', 'SCHEDULED', 'PUBLISHED']

async function create() {
  error.value = ''
  try {
    await request('/api/admin/threads', { method: 'POST', body: { body: body.value } })
    body.value = ''
    await refresh()
  } catch (err) {
    error.value = messageOf(err)
  }
}

async function move(post, statusName) {
  error.value = ''
  const payload = { status: statusName }
  if (statusName === 'SCHEDULED') {
    if (!when.value) {
      error.value = t('admin.scheduleAt')
      return
    }
    payload.scheduledAt = new Date(when.value).toISOString()
  }
  try {
    await request(`/api/admin/threads/${post.id}`, { method: 'PATCH', body: payload })
    await refresh()
  } catch (err) {
    error.value = messageOf(err)
  }
}

async function publish(post) {
  error.value = ''
  try {
    await request(`/api/admin/threads/${post.id}/publish`, { method: 'POST' })
    await refresh()
  } catch (err) {
    error.value = messageOf(err)
  }
}
</script>

<template>
  <h1 class="text-3xl font-extrabold">{{ t('admin.threads') }}</h1>
  <p v-if="status && !status.integrations.threads" class="mt-2 text-sm text-[#5c5c6b]">{{ t('admin.notReady') }}</p>
  <form class="panel mt-4" @submit.prevent="create">
    <textarea v-model="body" maxlength="500" rows="3" class="field" placeholder="Draft" />
    <AlertBanner class="mt-3" :message="error" error />
    <button class="btn-ink mt-3">{{ t('admin.draft') }}</button>
  </form>
  <label class="mt-4 block text-sm font-semibold">{{ t('admin.scheduleAt') }}<input v-model="when" type="datetime-local" class="field mt-2 max-w-xs"></label>
  <div class="mt-6 grid gap-4 lg:grid-cols-4">
    <section v-for="column in columns" :key="column">
      <h2 class="text-sm font-extrabold">{{ column }}</h2>
      <article v-for="post in (data?.posts || []).filter((item) => item.status === column)" :key="post.id" class="panel mt-3">
        <p class="text-sm">{{ post.body }}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <button v-if="column === 'DRAFT'" type="button" class="btn-line" @click="move(post, 'IN_REVIEW')">{{ t('admin.review') }}</button>
          <button v-if="column === 'IN_REVIEW'" type="button" class="btn-line" @click="move(post, 'DRAFT')">{{ t('admin.draft') }}</button>
          <button v-if="column === 'IN_REVIEW'" type="button" class="btn-line" @click="move(post, 'SCHEDULED')">{{ t('admin.schedule') }}</button>
          <button v-if="column === 'IN_REVIEW' || column === 'SCHEDULED'" type="button" class="btn-ink" @click="publish(post)">{{ t('admin.publish') }}</button>
        </div>
      </article>
    </section>
  </div>
</template>
