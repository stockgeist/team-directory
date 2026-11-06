import type { Note, Person } from '../lib/types'
import { getDb } from './db.server'

const PERSON_COLUMNS = `
  id, first_name AS firstName, last_name AS lastName, email, phone, city, country, picture
`

export function listPeople(): Person[] {
  return getDb()
    .prepare(`SELECT ${PERSON_COLUMNS} FROM people ORDER BY last_name, first_name, id`)
    .all() as Person[]
}

export function getPerson(id: string): Person | undefined {
  return getDb().prepare(`SELECT ${PERSON_COLUMNS} FROM people WHERE id = ?`).get(id) as
    | Person
    | undefined
}

export function listNotes(personId: string): Note[] {
  return getDb()
    .prepare(
      `SELECT notes.id, notes.body, users.username AS author, notes.created_at AS createdAt
       FROM notes JOIN users ON users.id = notes.author_id
       WHERE notes.person_id = ?
       ORDER BY notes.created_at, notes.id`,
    )
    .all(personId) as Note[]
}
