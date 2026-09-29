import { verifyPassword } from '@abang/database'
import { safeNext } from '../auth.js'
import { AppError, integrationError, parse } from '../errors.js'
import { accountSchema, loginSchema, signupSchema } from '../schemas.js'

let dummyHash

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    locale: user.locale
  }
}

export async function authRoutes(app) {
  const limit = { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } }

  app.post('/api/auth/signup', limit, async (request, reply) => {
    const body = parse(signupSchema, request.body)
    const email = body.email.toLowerCase()
    const existing = await app.repos.findUserByEmail(email)
    if (existing) throw new AppError(409, 'email_taken', 'An account with that email already exists.')
    const passwordHash = await app.auth.hashPassword(body.password)
    const user = await app.repos.createUser({
      email,
      name: body.name,
      passwordHash,
      role: 'MEMBER',
      locale: 'bm'
    })
    await app.auth.signSession(reply, user)
    return { user: publicUser(user) }
  })

  app.post('/api/auth/login', limit, async (request, reply) => {
    const body = parse(loginSchema, request.body)
    const email = body.email.toLowerCase()
    const user = await app.repos.findUserAuthByEmail(email)
    dummyHash ??= await app.auth.hashPassword('not-a-real-password')
    const hash = user?.passwordHash || dummyHash
    const matches = await verifyPassword(body.password, hash)
    if (!user?.passwordHash || !matches) {
      throw new AppError(401, 'invalid_login', 'Email or password is incorrect.')
    }
    await app.auth.signSession(reply, user)
    return { user: publicUser(user) }
  })

  app.post('/api/auth/logout', async (request, reply) => {
    app.auth.clearSession(reply)
    return { ok: true }
  })

  app.get('/api/auth/me', async (request) => {
    const user = await app.auth.readUser(request)
    if (!user) throw new AppError(401, 'unauthenticated', 'Please log in to continue.')
    return { user: publicUser(user) }
  })

  app.patch('/api/account', async (request) => {
    const user = await app.auth.requireUser(request)
    const body = parse(accountSchema, request.body)
    const updated = await app.repos.updateUser(user.id, body)
    return { user: publicUser(updated) }
  })

  app.get('/api/auth/google', limit, async (request, reply) => {
    try {
      const state = app.auth.beginGoogle(reply, safeNext(request.query?.next))
      reply.redirect(app.integrations.google.authUrl(state))
    } catch (error) {
      const mapped = integrationError(error)
      if (mapped) throw mapped
      throw error
    }
  })

  app.get('/api/auth/google/callback', limit, async (request, reply) => {
    const { expected, nextPath } = app.auth.takeGoogleState(request, reply)
    if (!expected || request.query?.state !== expected) {
      return reply.redirect(`${app.config.publicSiteUrl}/login?error=google`)
    }
    if (request.query?.error) {
      return reply.redirect(`${app.config.publicSiteUrl}/login?error=google`)
    }
    try {
      const profile = await app.integrations.google.profileFromCode(request.query.code)
      const allowAdmin = app.config.adminEmails.includes(profile.email)
      let existing = await app.repos.findUserByGoogleId(profile.googleId)
      if (!existing) {
        const byEmail = await app.repos.findUserAuthByEmail(profile.email)
        if (byEmail) {
          existing = await app.repos.updateUser(byEmail.id, {
            googleId: profile.googleId,
            name: byEmail.name || profile.name,
            avatarUrl: profile.avatarUrl,
            role: byEmail.role === 'ADMIN' || allowAdmin ? 'ADMIN' : byEmail.role
          })
        }
      }
      const user = existing || await app.repos.createUser({
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        googleId: profile.googleId,
        role: allowAdmin ? 'ADMIN' : 'MEMBER',
        locale: 'bm'
      })
      if (existing && allowAdmin && existing.role !== 'ADMIN') {
        const promoted = await app.repos.updateUser(existing.id, { role: 'ADMIN' })
        await app.auth.signSession(reply, promoted)
      } else {
        await app.auth.signSession(reply, user)
      }
      return reply.redirect(`${app.config.publicSiteUrl}${nextPath}`)
    } catch (error) {
      request.log.error(error)
      return reply.redirect(`${app.config.publicSiteUrl}/login?error=google`)
    }
  })
}
