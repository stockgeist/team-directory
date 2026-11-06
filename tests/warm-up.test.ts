import { describe, expect, it } from 'vitest'
import { initials } from '../src/lib/initials'
import { get, people } from './helpers'

// Warm-up: these fail until you do the warm-up (see tasks/warm-up.md).

describe('Warm-up 1: initials', () => {
  it("initials('August', 'Hansen')", () => {
    expect(initials('August', 'Hansen')).toBe('AH')
  })

  it("initials('ada', 'lovelace')", () => {
    expect(initials('ada', 'lovelace')).toBe('AL')
  })
})

describe('Warm-up 2: emails on the list', () => {
  it("shows each person's email on the home page", async () => {
    const html = await (await get('/')).text()
    // Only the rendered page: the data for React is also in a <script>.
    const page = html.replace(/<script[\s\S]*?<\/script>/g, '')

    for (const person of people) expect(page).toContain(person.email)
  })
})

describe('Warm-up 3: count endpoint', () => {
  it('GET /api/people/count returns the number of people', async () => {
    const res = await get('/api/people/count')

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ count: people.length })
  })
})
