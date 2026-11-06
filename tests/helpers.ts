import { inject } from 'vitest'
import seedPeople from '../db/seed/people.json'

/** The people the database is seeded with (same data as db/seed/people.json). */
export const people = seedPeople

export function url(path: string): string {
  return new URL(path, inject('baseUrl')).toString()
}

/** GET a path. Redirects are not followed, so you can assert on them. */
export function get(path: string, cookie?: string): Promise<Response> {
  return fetch(url(path), { headers: cookie ? { cookie } : {}, redirect: 'manual' })
}

/** POST a form the way a browser does (application/x-www-form-urlencoded). */
export function postForm(
  path: string,
  fields: Record<string, string>,
  cookie?: string,
): Promise<Response> {
  return fetch(url(path), {
    method: 'POST',
    body: new URLSearchParams(fields),
    headers: cookie ? { cookie } : {},
    redirect: 'manual',
  })
}

/** Logs in and returns a `cookie` header value carrying the session. */
export async function login(username: 'alice' | 'bob'): Promise<string> {
  const res = await postForm('/api/login', { username, password: 'interview' })
  const setCookie = res.headers.get('set-cookie')
  if (res.status !== 303 || !setCookie) throw new Error(`Login as ${username} failed (${res.status})`)
  return setCookie.split(';')[0]
}

/** A string that is unique per call, so tests don't see each other's data. */
export function unique(label: string): string {
  return `${label} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
