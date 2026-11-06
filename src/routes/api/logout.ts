import { createFileRoute } from '@tanstack/react-router'
import { clearedSessionCookie, deleteSession, getSessionId } from '../../server/auth.server'
import { redirect } from '../../lib/http'

export const Route = createFileRoute('/api/logout')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const sessionId = getSessionId(request)
        if (sessionId) deleteSession(sessionId)
        return redirect('/', { 'Set-Cookie': clearedSessionCookie() })
      },
    },
  },
})
