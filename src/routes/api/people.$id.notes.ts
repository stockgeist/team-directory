import { createFileRoute } from '@tanstack/react-router'

// Task 1: receives the "Add note" form. See tasks/task-1-notes.md.
export const Route = createFileRoute('/api/people/$id/notes')({
  server: {
    handlers: {
      POST: async ({ params }) => {
        return new Response(`Adding notes to ${params.id} is not implemented yet`, { status: 501 })
      },
    },
  },
})
