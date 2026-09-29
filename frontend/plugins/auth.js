export default defineNuxtPlugin(async () => {
  const auth = useAuth()
  if (!auth.ready.value) await auth.refresh()
})
