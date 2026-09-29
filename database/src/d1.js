import { randomUUID } from 'node:crypto'

export function createD1Client({ accountId, databaseId, apiToken }) {
  const headers = {
    Authorization: `Bearer ${apiToken}`,
    'Content-Type': 'application/json'
  }
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`

  return {
    async query(sql, params = []) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sql, params }),
        signal: AbortSignal.timeout(20000)
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || payload.success === false) {
        const message = payload?.errors?.[0]?.message || 'Cloudflare D1 query failed.'
        const error = new Error(message)
        error.code = 'd1_error'
        throw error
      }
      return payload.result?.[0]?.results ?? []
    }
  }
}

export const newId = () => randomUUID()

export function nowIso() {
  return new Date().toISOString()
}
