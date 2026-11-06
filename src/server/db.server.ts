import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import seedPeople from '../../db/seed/people.json'
import { hashPassword } from './auth.server'

// One SQLite file, created and seeded on first use.
// `npm run db:reset` deletes it so the next start reseeds from scratch.
const DATABASE_PATH = process.env.DATABASE_PATH ?? 'data/app.db'

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS people (
    id         TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name  TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL,
    city       TEXT NOT NULL,
    country    TEXT NOT NULL,
    picture    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY,
    username      TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('admin', 'member'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id         TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id         INTEGER PRIMARY KEY,
    person_id  TEXT NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    author_id  INTEGER NOT NULL REFERENCES users(id),
    body       TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`

function seed(db: DatabaseSync) {
  const insertPerson = db.prepare(`
    INSERT INTO people (id, first_name, last_name, email, phone, city, country, picture)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  for (const p of seedPeople) {
    insertPerson.run(p.id, p.firstName, p.lastName, p.email, p.phone, p.city, p.country, p.picture)
  }

  const insertUser = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)')
  insertUser.run('alice', hashPassword('interview'), 'admin')
  insertUser.run('bob', hashPassword('interview'), 'member')

  const insertNote = db.prepare('INSERT INTO notes (person_id, author_id, body) VALUES (?, ?, ?)')
  insertNote.run(seedPeople[0].id, 1, 'Joined the platform team in March.')
  insertNote.run(seedPeople[0].id, 2, 'Prefers async updates over meetings.')
}

function open(): DatabaseSync {
  if (DATABASE_PATH !== ':memory:') mkdirSync(dirname(DATABASE_PATH), { recursive: true })
  const db = new DatabaseSync(DATABASE_PATH)
  db.exec('PRAGMA foreign_keys = ON')
  db.exec(SCHEMA)

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM people').get() as { count: number }
  if (count === 0) seed(db)
  return db
}

// Keep a single connection across dev-server hot reloads.
const globalForDb = globalThis as unknown as { __db?: DatabaseSync }

export function getDb(): DatabaseSync {
  globalForDb.__db ??= open()
  return globalForDb.__db
}
