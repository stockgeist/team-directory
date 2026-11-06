import { describe, expect, it } from 'vitest'
import { get, login, people, postForm, unique, url } from './helpers'

// Task 1: these fail until you implement adding notes (see tasks/task-1-notes.md).
// They cover the requirements in the task.

const person = people[3]
const notesPath = `/api/people/${person.id}/notes`

/** The HTML that follows `text` on the person page, up to the end of its list item. */
function noteMarkup(html: string, text: string): string {
  const start = html.indexOf(text)
  return start === -1 ? '' : html.slice(start, html.indexOf('</li>', start))
}

describe('Task 1: the form', () => {
  it('shows logged-in users a plain HTML form that posts to the notes endpoint', async () => {
    const cookie = await login('bob')
    const html = await (await get(`/people/${person.id}`, cookie)).text()

    const formTag = html.match(/<form[^>]*>/g)?.find((tag) => tag.includes(`action="${notesPath}"`))
    expect(formTag, 'form with the right action').toBeDefined()
    expect(formTag).toMatch(/method="post"/i)
    expect(html).toMatch(/<textarea[^>]*name="body"/)

    const loggedOut = await (await get(`/people/${person.id}`)).text()
    expect(loggedOut, 'no form for logged-out users').not.toContain(`action="${notesPath}"`)
  })
})

describe('Task 1: the endpoint', () => {
  it('saves the note and redirects back to the person page', async () => {
    const cookie = await login('bob')
    const body = unique('Met at the meetup')

    const res = await postForm(notesPath, { body }, cookie)

    expect(res.status).toBe(303)
    // A relative or an absolute URL is fine, as long as it points to the person page.
    expect(new URL(res.headers.get('location') ?? '', url('/')).pathname).toBe(`/people/${person.id}`)
    const html = await (await get(`/people/${person.id}`, cookie)).text()
    expect(html).toContain(body)
  })

  it('401 when not logged in', async () => {
    const res = await postForm(notesPath, { body: unique('anonymous') })

    expect(res.status).toBe(401)
  })

  it('400 for a missing, empty or whitespace-only note', async () => {
    const cookie = await login('bob')

    expect((await postForm(notesPath, {}, cookie)).status).toBe(400)
    expect((await postForm(notesPath, { body: '' }, cookie)).status).toBe(400)
    expect((await postForm(notesPath, { body: '   \n  ' }, cookie)).status).toBe(400)
  })

  it('stores the note trimmed, with the logged-in user as author', async () => {
    const cookie = await login('alice')
    const text = unique('trimmed')

    await postForm(notesPath, { body: `   ${text}   ` }, cookie)

    const html = await (await get(`/people/${person.id}`)).text()
    expect(html).toContain(`>${text}<`)
    expect(noteMarkup(html, text)).toContain('alice')
  })
})
