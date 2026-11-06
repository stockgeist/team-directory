import { createFileRoute } from '@tanstack/react-router'
import { listPeople } from '../../server/people.server'

// JSON API for clients outside the app (scripts, curl, tests).
export const Route = createFileRoute('/api/people')({
  server: {
    handlers: {
      GET: async () => Response.json({ items: listPeople() }),
    },
  },
})
