import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { User } from '../lib/types'
import { getDb } from './db.server'

export const SESSION_COOKIE = 'sid'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 32)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':')
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length)
  return timingSafeEqual(actual, expected)
}

/** Returns the user if the username/password pair is valid. */
export function checkCredentials(username: string, password: string): User | null {
  const row = getDb()
    .prepare('SELECT id, username, role, password_hash FROM users WHERE username = ?')
    .get(username) as (User & { password_hash: string }) | undefined
  if (!row || !verifyPassword(password, row.password_hash)) return null
  return { id: row.id, username: row.username, role: row.role }
}

export function createSession(userId: number): string {
  const id = randomBytes(32).toString('base64url')
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000
  getDb().prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(id, userId, expiresAt)
  return id
}

export function deleteSession(sessionId: string) {
  getDb().prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
}

/** Value for a `Set-Cookie` header that stores the session id in the browser. */
export function sessionCookie(sessionId: string): string {
  const attributes = [
    `${SESSION_COOKIE}=${sessionId}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ]
  if (process.env.NODE_ENV === 'production') attributes.push('Secure')
  return attributes.join('; ')
}

/** Value for a `Set-Cookie` header that removes the session cookie. */
export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

export function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {}
  for (const part of (header ?? '').split(';')) {
    const index = part.indexOf('=')
    if (index === -1) continue
    cookies[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim())
  }
  return cookies
}

export function getSessionId(request: Request): string | undefined {
  return parseCookies(request.headers.get('cookie'))[SESSION_COOKIE]
}

/** The logged-in user for this request, or null. */
export function getUserFromRequest(request: Request): User | null {
  const sessionId = getSessionId(request)
  if (!sessionId) return null

  const row = getDb()
    .prepare(
      `SELECT users.id, users.username, users.role, sessions.expires_at
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.id = ?`,
    )
    .get(sessionId) as (User & { expires_at: number }) | undefined
  if (!row || row.expires_at < Date.now()) return null
  return { id: row.id, username: row.username, role: row.role }
}
