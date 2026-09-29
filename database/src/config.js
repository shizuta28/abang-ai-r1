export function resolveDatabaseConfig(env = process.env) {
  const provider = String(env.DATABASE_PROVIDER || 'postgres').toLowerCase()

  if (provider === 'postgres') {
    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required when DATABASE_PROVIDER=postgres.')
    }
    return { provider, strategy: 'prisma', connectionString: env.DATABASE_URL }
  }

  if (provider === 'hyperdrive') {
    const connectionString = env.HYPERDRIVE_DATABASE_URL || env.DATABASE_URL
    if (!connectionString) {
      throw new Error('HYPERDRIVE_DATABASE_URL is required when DATABASE_PROVIDER=hyperdrive.')
    }
    return { provider, strategy: 'prisma', connectionString }
  }

  if (provider === 'd1') {
    const accountId = env.CLOUDFLARE_ACCOUNT_ID
    const databaseId = env.CLOUDFLARE_D1_DATABASE_ID
    const apiToken = env.CLOUDFLARE_API_TOKEN
    if (!accountId || !databaseId || !apiToken) {
      throw new Error('CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN are required when DATABASE_PROVIDER=d1.')
    }
    return { provider, strategy: 'd1', accountId, databaseId, apiToken }
  }

  throw new Error(`Unknown DATABASE_PROVIDER "${provider}". Use postgres, hyperdrive, or d1.`)
}
