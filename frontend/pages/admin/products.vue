<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t, pick } = useLocale()
const { request, messageOf } = useApi()
const { price } = useMoney()
const { data, refresh } = await useApiFetch('/api/admin/products')
const error = ref('')
const blank = () => ({
  slug: '', titleBm: '', titleEn: '', summaryBm: '', summaryEn: '', descriptionBm: '', descriptionEn: '',
  priceCents: 0, type: 'DIGITAL', published: false, coverUrl: '', fileKey: ''
})
const form = reactive(blank())
const editing = ref(null)

function edit(product) {
  editing.value = product.id
  Object.assign(form, { ...product, coverUrl: product.coverUrl || '', fileKey: product.fileKey || '' })
}

async function save() {
  error.value = ''
  const body = { ...form, priceCents: Number(form.priceCents), coverUrl: form.coverUrl || null, fileKey: form.fileKey || null }
  try {
    if (editing.value) await request(`/api/admin/products/${editing.value}`, { method: 'PATCH', body })
    else await request('/api/admin/products', { method: 'POST', body })
    Object.assign(form, blank())
    editing.value = null
    await refresh()
  } catch (err) {
    error.value = messageOf(err)
  }
}

async function remove(product) {
  if (!confirm(product.slug)) return
  await request(`/api/admin/products/${product.id}`, { method: 'DELETE' })
  await refresh()
}

async function upload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const body = new FormData()
  body.append('file', file)
  try {
    const result = await request('/api/admin/uploads', { method: 'POST', body })
    form.fileKey = result.key
  } catch (err) {
    error.value = messageOf(err)
  }
}
</script>

<template>
  <h1 class="text-3xl font-extrabold">{{ t('admin.products') }}</h1>
  <form class="panel mt-6 grid gap-3 md:grid-cols-2" @submit.prevent="save">
    <label class="text-sm font-semibold">Slug<input v-model="form.slug" required class="field mt-1"></label>
    <label class="text-sm font-semibold">{{ t('admin.status') }}
      <select v-model="form.type" class="field mt-1"><option>COURSE</option><option>DIGITAL</option><option>RESOURCE</option></select>
    </label>
    <label class="text-sm font-semibold">Title BM<input v-model="form.titleBm" required class="field mt-1"></label>
    <label class="text-sm font-semibold">Title EN<input v-model="form.titleEn" required class="field mt-1"></label>
    <label class="text-sm font-semibold">Summary BM<input v-model="form.summaryBm" required class="field mt-1"></label>
    <label class="text-sm font-semibold">Summary EN<input v-model="form.summaryEn" required class="field mt-1"></label>
    <label class="text-sm font-semibold md:col-span-2">Description BM<textarea v-model="form.descriptionBm" rows="3" class="field mt-1" /></label>
    <label class="text-sm font-semibold md:col-span-2">Description EN<textarea v-model="form.descriptionEn" rows="3" class="field mt-1" /></label>
    <label class="text-sm font-semibold">Price (sen)<input v-model="form.priceCents" type="number" min="0" class="field mt-1"></label>
    <label class="text-sm font-semibold">Cover URL<input v-model="form.coverUrl" class="field mt-1"></label>
    <label class="text-sm font-semibold md:col-span-2">{{ t('admin.upload') }}<input type="file" class="mt-2 block text-sm" @change="upload"></label>
    <p v-if="form.fileKey" class="text-xs md:col-span-2">{{ form.fileKey }}</p>
    <label class="flex items-center gap-2 text-sm font-semibold"><input v-model="form.published" type="checkbox"> {{ t('admin.published') }}</label>
    <AlertBanner class="md:col-span-2" :message="error" error />
    <button class="btn-ink md:col-span-2">{{ editing ? t('admin.save') : t('admin.create') }}</button>
  </form>
  <div class="mt-6 space-y-3">
    <article v-for="product in data?.products || []" :key="product.id" class="panel flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="font-extrabold">{{ pick(product, 'title') }}</p>
        <p class="text-sm text-[#5c5c6b]">{{ product.type }} · {{ price(product.priceCents) }} · {{ product.published ? t('admin.published') : t('admin.draft') }}</p>
      </div>
      <div class="flex gap-2">
        <button type="button" class="btn-line" @click="edit(product)">Edit</button>
        <button type="button" class="btn-line" @click="remove(product)">{{ t('admin.delete') }}</button>
      </div>
    </article>
  </div>
</template>
