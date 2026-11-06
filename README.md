# Team directory

A small app for browsing the people in a company. It is a full-stack TypeScript
app: one codebase renders HTML on the server, serves a JSON API, talks to a
SQLite database and runs React in the browser.

## Getting started

The dependencies are installed and the dev server starts by itself. Open the
app with the preview's "open in a new tab" button: logging in doesn't work
inside the editor's built-in preview.

```bash
npm run dev          # the app, on port 3000 (already running)
npm test             # all tests; starts its own server on :3100 with a throwaway database
npm run test:task-1  # only one task's tests (also test:warm-up and test:task-2)
```

The database is a single file, `data/app.db`, created and seeded the first time
the app starts. `npm run db:reset` deletes it, and the next start reseeds it.

Two accounts are seeded:

| Username | Password    | Role   |
|----------|-------------|--------|
| `alice`  | `interview` | admin  |
| `bob`    | `interview` | member |

## The tasks

| | What |
|---|---|
| Warm-up | [Three small changes](tasks/warm-up.md): a function, a page and an endpoint |
| Task 1 | [Add notes to a person](tasks/task-1-notes.md): a form, an endpoint and a query |
| Task 2 | [Pagination](tasks/task-2-pagination.md): a short logic task |

`npm test` runs every test, and fails at the start: the failing tests belong
to the tasks. Each task ends with the command that runs only its tests, such
as `npm run test:task-1`. In the sandbox, the same commands are also in the
task list, so you can run them with a click. Add `-- --watch` to rerun the
tests every time you save a file. The
tests are a starting point, not the whole spec.

## How the app fits together

The app uses [TanStack Start](https://tanstack.com/start/latest) (React +
Vite). You don't need to know it already. These are the pieces you will use:

**Pages** live in `src/routes/` and map to URLs by file name:
`index.tsx` → `/`, `people.$id.tsx` → `/people/:id`. A page's `loader` fetches
its data. On the first request the server runs the loader, renders HTML and
sends it to the browser. React then takes over in the browser (hydration), and
later navigations run the loader again without a full page reload.

**Server routes** are plain HTTP endpoints: a handler receives a standard
[`Request`](https://developer.mozilla.org/docs/Web/API/Request) and returns a
[`Response`](https://developer.mozilla.org/docs/Web/API/Response). They use the
same file naming, e.g. `routes/api/login.ts` → `POST /api/login`. Use them for
anything called from outside the app: HTML form posts, `curl`, other services.

```ts
export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: async ({ request }) => Response.json({ hello: 'world' }),
    },
  },
})
```

**Server functions** (`createServerFn`, in `src/lib/*.functions.ts`) are
functions that always run on the server but can be called from anywhere,
including loaders and components. When the browser calls one, Start turns the
call into an HTTP request for you. Open the Network tab to see it.

**Server-only code** lives in `src/server/*.server.ts`: the database, password
hashing, sessions. Never import these from components. Call them from a server
route or a server function.

```
src/
  routes/            pages (*.tsx) and server routes (api/*.ts)
  lib/
    *.functions.ts   server functions
    types.ts         types shared by server and browser
    http.ts          small Response helpers
  server/
    db.server.ts     SQLite schema, connection and seed data
    auth.server.ts   passwords, sessions, cookies
    people.server.ts SQL queries for people and notes
tests/               HTTP tests against a real server (Vitest)
tasks/               the tasks
```

Input from outside (forms, query strings, server function arguments) is
validated with [Zod](https://zod.dev). `routes/api/login.ts` shows the pattern.
Using it is optional: plain checks are fine too.

The database is Node's built-in
[`node:sqlite`](https://nodejs.org/api/sqlite.html), used with raw SQL and
prepared statements (`db.prepare(sql).all(...params)`). There is no ORM.

## Useful commands

```bash
# Log in with curl and keep the session cookie in a file
curl -i -c cookies.txt -d 'username=bob&password=interview' http://localhost:3000/api/login

# Send it back on later requests
curl -i -b cookies.txt http://localhost:3000/

# Run one task's tests
npm run test:task-1
```
