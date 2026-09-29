export function createThreads(config) {
  const enabled = Boolean(config.userId && config.accessToken)
  return {
    enabled,
    async publish(text) {
      if (!enabled) {
        const error = new Error('Threads API is not configured.')
        error.code = 'threads_not_configured'
        throw error
      }
      const createUrl = new URL(`https://graph.threads.net/v1.0/${config.userId}/threads`)
      createUrl.searchParams.set('media_type', 'TEXT')
      createUrl.searchParams.set('text', text)
      createUrl.searchParams.set('access_token', config.accessToken)
      const createdResponse = await fetch(createUrl, { method: 'POST', signal: AbortSignal.timeout(20000) })
      const created = await createdResponse.json().catch(() => ({}))
      if (!createdResponse.ok || !created.id) {
        const error = new Error(created.error?.message || 'Threads did not accept the draft.')
        error.code = 'threads_rejected'
        throw error
      }
      const publishUrl = new URL(`https://graph.threads.net/v1.0/${config.userId}/threads_publish`)
      publishUrl.searchParams.set('creation_id', created.id)
      publishUrl.searchParams.set('access_token', config.accessToken)
      const publishedResponse = await fetch(publishUrl, { method: 'POST', signal: AbortSignal.timeout(20000) })
      const published = await publishedResponse.json().catch(() => ({}))
      if (!publishedResponse.ok || !published.id) {
        const error = new Error(published.error?.message || 'Threads did not publish the post.')
        error.code = 'threads_rejected'
        throw error
      }
      return { threadsMediaId: published.id }
    }
  }
}
