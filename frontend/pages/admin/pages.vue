<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t, pick } = useLocale()
const { request, messageOf } = useApi()
const { data, refresh } = await useApiFetch('/api/admin/pages')
const error = ref('')
const editing = ref(null)
const form = reactive({ slug: '', titleBm: '', titleEn: '', bodyBm: '', bodyEn: '', published: false })

function edit(page) {
  editing.value = page.id
  Object.assign(form, page)
}

async function save() {
  error.value = ''
  try {
    if (editing.value) await request(`/api/admin/pages/${editing.value}`, { method: 'PATCH', body: form })
    else await request('/api/admin/pages', { method: 'POST', body: form })
    editing.value = null
    Object.assign(form, { slug: '', titleBm: '', titleEn: '', bodyBm: '', bodyEn: '', published: false })
    await refresh()
  } catch (err) {
    error.value = messageOf(err)
  }
}
</script>

<template>
  <h1 class="text-3xl font-extrabold">{{ t('admin.pages') }}</h1>
  <form class="panel mt-6 grid gap-3" @submit.prevent="save">
    <input v-model="form.slug" required placeholder="slug" class="field">
    <input v-model="form.titleBm" required placeholder="Title BM" class="field">
    <input v-model="form.titleEn" required placeholder="Title EN" class="field">
    <textarea v-model="form.bodyBm" required rows="5" placeholder="Body BM" class="field" />
    <textarea v-model="form.bodyEn" required rows="5" placeholder="Body EN" class="field" />
    <label class="text-sm font-semibold"><input v-model="form.published" type="checkbox"> {{ t('admin.published') }}</label>
    <AlertBanner :message="error" error />
    <button class="btn-ink">{{ editing ? t('admin.save') : t('admin.create') }}</button>
  </form>
  <div class="mt-6 space-y-3">
    <article v-for="page in data?.pages || []" :key="page.id" class="panel flex items-center justify-between gap-3">
      <div>
        <p class="font-extrabold">{{ pick(page, 'title') }}</p>
        <NuxtLink :to="`/p/${page.slug}`" class="text-sm text-violet-600">/p/{{ page.slug }}</NuxtLink>
      </div>
      <button type="button" class="btn-line" @click="edit(page)">Edit</button>
    </article>
  </div>
</template>
