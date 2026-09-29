<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { t } = useLocale()
const { request } = useApi()
const { data, refresh } = await useApiFetch('/api/admin/leads')

async function updateStatus(lead, status) {
  await request(`/api/admin/leads/${lead.id}`, { method: 'PATCH', body: { status } })
  await refresh()
}
</script>

<template>
  <h1 class="text-3xl font-extrabold">{{ t('admin.leads') }}</h1>
  <div class="mt-6 overflow-x-auto">
    <table class="w-full min-w-[720px] text-left text-sm">
      <thead class="text-xs uppercase text-[#5c5c6b]">
        <tr><th class="py-2">{{ t('lead.name') }}</th><th>{{ t('lead.email') }}</th><th>{{ t('lead.message') }}</th><th>{{ t('admin.status') }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="lead in data?.leads || []" :key="lead.id" class="border-t border-black/5 dark:border-white/10">
          <td class="py-3 font-semibold">{{ lead.name }}<p class="font-normal text-[#5c5c6b]">{{ lead.phone }}</p></td>
          <td>{{ lead.email }}</td>
          <td class="max-w-xs">{{ lead.message }}</td>
          <td>
            <select class="field !w-auto" :value="lead.status" @change="updateStatus(lead, $event.target.value)">
              <option>new</option>
              <option>contacted</option>
              <option>qualified</option>
              <option>closed</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="!(data?.leads || []).length" class="mt-4 text-sm">{{ t('catalog.empty') }}</p>
  </div>
</template>
