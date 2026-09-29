function required(config) {
  if (!config.clientId || !config.clientSecret || !config.redirectUri) {
    const error = new Error('Google OAuth is not configured.')
    error.code = 'oauth_not_configured'
    throw error
  }
}

export function createGoogleAuth(config) {
  const enabled = Boolean(config.clientId && config.clientSecret && config.redirectUri)
  return {
    enabled,
    authUrl(state) {
      required(config)
      const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      url.searchParams.set('client_id', config.clientId)
      url.searchParams.set('redirect_uri', config.redirectUri)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('scope', 'openid email profile')
      url.searchParams.set('state', state)
      url.searchParams.set('prompt', 'select_account')
      return url.toString()
    },
    async profileFromCode(code) {
      required(config)
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: config.redirectUri,
          grant_type: 'authorization_code'
        }),
        signal: AbortSignal.timeout(15000)
      })
      const tokenPayload = await tokenResponse.json().catch(() => ({}))
      if (!tokenResponse.ok || !tokenPayload.access_token) {
        const error = new Error('Google did not return an access token.')
        error.code = 'oauth_token'
        throw error
      }
      const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenPayload.access_token}` },
        signal: AbortSignal.timeout(15000)
      })
      const profile = await profileResponse.json().catch(() => ({}))
      if (!profileResponse.ok || !profile.email || profile.email_verified === false) {
        const error = new Error('Google did not return a verified email.')
        error.code = 'oauth_profile'
        throw error
      }
      return {
        googleId: profile.sub,
        email: String(profile.email).toLowerCase(),
        name: profile.name || profile.email,
        avatarUrl: profile.picture || null
      }
    }
  }
}
