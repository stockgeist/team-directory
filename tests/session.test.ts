import { describe, expect, it } from 'vitest'
import { get, login, postForm } from './helpers'

// Example tests for the login flow that already works.

describe('session', () => {
  it('logs in with a form post and sets an HttpOnly session cookie', async () => {
    const res = await postForm('/api/login', { username: 'bob', password: 'interview' })

    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/')
    const cookie = res.headers.get('set-cookie') ?? ''
    expect(cookie).toMatch(/^sid=/)
    expect(cookie).toMatch(/HttpOnly/i)
    expect(cookie).toMatch(/SameSite=Lax/i)
  })

  it('sends the user back to the login page on a wrong password', async () => {
    const res = await postForm('/api/login', { username: 'bob', password: 'wrong' })

    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/login?error=invalid')
    expect(res.headers.get('set-cookie')).toBeNull()
  })

  it('renders the logged-in user into the page on the server', async () => {
    const cookie = await login('alice')
    const html = await (await get('/', cookie)).text()

    expect(html).toContain('action="/api/logout"')
    expect(html).toMatch(/alice/)
  })
})
