function requestHeaders(extra) {
  const forwarded = import.meta.server ? useRequestHeaders(['cookie']) : {}
  return { ...forwarded, ...(extra || {}) }
}

export function useApi() {
  async function request(url, options = {}) {
    const { headers, ...rest } = options
    try {
      return await $fetch(url, { credentials: 'include', ...rest, headers: requestHeaders(headers) })
    } catch (error) {
      const data = error?.data || {}
      const wrapped = new Error(data.message || 'Request failed')
      wrapped.code = data.error
      wrapped.details = data.details
      wrapped.status = error?.statusCode || error?.status
      throw wrapped
    }
  }

  function messageOf(error) {
    const fields = error?.details?.fieldErrors
    if (fields) {
      const first = Object.values(fields).flat().find(Boolean)
      if (first) return String(first)
    }
    return error?.message || 'Request failed'
  }

  return { request, messageOf }
}

export function useApiFetch(url, options = {}) {
  const { headers, ...rest } = options
  return useFetch(url, {
    credentials: 'include',
    ...rest,
    headers: requestHeaders(headers)
  })
}

export function useAuth() {
  const user = useState('auth-user', () => null)
  const ready = useState('auth-ready', () => false)
  const { request } = useApi()

  async function refresh() {
    try {
      const result = await request('/api/auth/me')
      user.value = result.user
    } catch {
      user.value = null
    } finally {
      ready.value = true
    }
  }

  async function logout() {
    await request('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  return { user, ready, refresh, logout }
}

export function useMoney() {
  const { locale, t } = useLocale()

  function money(cents) {
    return new Intl.NumberFormat(locale.value === 'en' ? 'en-MY' : 'ms-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format((cents || 0) / 100)
  }

  function price(cents) {
    if (!cents) return t('catalog.free')
    return money(cents)
  }

  return { money, price }
}

export function safeNext(value, fallback = '/account') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}
