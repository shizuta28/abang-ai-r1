export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuth()
  if (!auth.ready.value) await auth.refresh()
  if (!auth.user.value) return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`)
})
