import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { getCurrentUser } from '../lib/session.functions'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  // Runs before every page; child routes read the user from `context.user`.
  beforeLoad: async () => ({ user: await getCurrentUser() }),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Team directory' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: ReactNode }) {
  const { user } = Route.useRouteContext()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header className="site-header">
          <Link to="/" className="brand">
            Team directory
          </Link>
          {user ? (
            <form method="post" action="/api/logout" className="session">
              <span>
                {user.username} <small>({user.role})</small>
              </span>
              <button type="submit">Log out</button>
            </form>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </header>
        <main>{children}</main>
        <Scripts />
      </body>
    </html>
  )
}
