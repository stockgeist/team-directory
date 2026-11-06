import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { checkCredentials, createSession, sessionCookie } from '../../server/auth.server'
import { redirect } from '../../lib/http'

const LoginForm = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
})

export const Route = createFileRoute('/api/login')({
  server: {
    handlers: {
      // Receives the login <form> (application/x-www-form-urlencoded).
      POST: async ({ request }) => {
        const form = LoginForm.safeParse(Object.fromEntries(await request.formData()))
        if (!form.success) return redirect('/login?error=invalid')

        const user = checkCredentials(form.data.username, form.data.password)
        if (!user) return redirect('/login?error=invalid')

        const sessionId = createSession(user.id)
        return redirect('/', { 'Set-Cookie': sessionCookie(sessionId) })
      },
    },
  },
})
