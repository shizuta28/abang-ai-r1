import { proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  return proxyRequest(event, `${config.apiInternal}${event.path}`)
})
