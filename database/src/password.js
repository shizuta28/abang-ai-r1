import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = await scrypt(password, salt, 64)
  return `scrypt$${salt}$${derived.toString('hex')}`
}

export async function verifyPassword(password, stored) {
  if (!stored || !stored.startsWith('scrypt$')) return false
  const [, salt, hex] = stored.split('$')
  if (!salt || !hex) return false
  const derived = await scrypt(password, salt, 64)
  const expected = Buffer.from(hex, 'hex')
  if (expected.length !== derived.length) return false
  return timingSafeEqual(expected, derived)
}
