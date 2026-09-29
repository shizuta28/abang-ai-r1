export function startScheduler(app) {
  let running = false
  const timer = setInterval(async () => {
    if (running || !app.integrations.threads.enabled) return
    running = true
    try {
      const due = await app.repos.listDueThreads(new Date())
      for (const post of due) {
        try {
          const result = await app.integrations.threads.publish(post.body)
          await app.repos.updateThread(post.id, {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            threadsMediaId: result.threadsMediaId
          })
        } catch (error) {
          app.log.error({ err: error, postId: post.id }, 'Scheduled Threads publish failed')
        }
      }
    } catch (error) {
      app.log.error(error, 'Threads scheduler failed')
    } finally {
      running = false
    }
  }, 60_000)
  timer.unref?.()
  app.addHook('onClose', async () => clearInterval(timer))
}
