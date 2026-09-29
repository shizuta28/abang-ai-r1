import { randomBytes } from 'node:crypto'
import { SignJWT, jwtVerify } from 'jose'
import { hashPassword } from '@abang/database'
import { AppError } from './errors.js'

const SESSION = 'abang_session'
const STATE = 'abang_oauth_state'
const NEXT = 'abang_oauth_next'

export function safeNext(value, fallback = '/account') {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback
  return value
}

function cookieBase(config) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: config.cookieSecure
  }
}

export function createAuth(app) {
  const secret = new TextEncoder().encode(app.config.jwtSecret)

  async function signSession(reply, user) {
    const token = await new SignJWT({ role: user.role, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime('14d')
      .sign(secret)
    reply.setCookie(SESSION, token, { ...cookieBase(app.config), maxAge: 60 * 60 * 24 * 14 })
  }

  async function readUser(request) {
    const token = request.cookies?.[SESSION]
    if (!token) return null
    try {
      const { payload } = await jwtVerify(token, secret)
      if (!payload.sub) return null
      return app.repos.findUserById(payload.sub)
    } catch {
      return null
    }
  }

  async function requireUser(request) {
    const user = await readUser(request)
    if (!user) throw new AppError(401, 'unauthenticated', 'Please log in to continue.')
    return user
  }

  async function requireAdmin(request) {
    const user = await requireUser(request)
    if (user.role !== 'ADMIN') throw new AppError(403, 'forbidden', 'This area is for admins.')
    return user
  }

  function clearSession(reply) {
    reply.clearCookie(SESSION, cookieBase(app.config))
  }

  function beginGoogle(reply, nextPath) {
    const state = randomBytes(24).toString('hex')
    reply.setCookie(STATE, state, { ...cookieBase(app.config), maxAge: 60 * 10 })
    reply.setCookie(NEXT, safeNext(nextPath), { ...cookieBase(app.config), maxAge: 60 * 10 })
    return state
  }

  function takeGoogleState(request, reply) {
    const expected = request.cookies?.[STATE]
    const nextPath = safeNext(request.cookies?.[NEXT])
    reply.clearCookie(STATE, cookieBase(app.config))
    reply.clearCookie(NEXT, cookieBase(app.config))
    return { expected, nextPath }
  }

  return { signSession, readUser, requireUser, requireAdmin, clearSession, beginGoogle, takeGoogleState, hashPassword }
}
