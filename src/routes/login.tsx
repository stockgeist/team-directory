import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({ error: z.string().optional().catch(undefined) }),
  component: LoginPage,
})

// A plain HTML form: the browser POSTs it to /api/login, which sets the
// session cookie and redirects. It works the same with JavaScript turned off.
function LoginPage() {
  const { error } = Route.useSearch()
  const { user } = Route.useRouteContext()

  return (
    <>
      <h1>Log in</h1>
      {user && <p className="muted">You are logged in as {user.username}.</p>}
      {error && <p className="error">Wrong username or password.</p>}
      <form method="post" action="/api/login" className="stack">
        <label>
          Username
          <input name="username" autoComplete="username" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button type="submit">Log in</button>
      </form>
    </>
  )
}
