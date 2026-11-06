# Task 1: add notes to a person

The person page (`/people/:id`) already lists notes. Make it possible to add one.

## Requirements

1. **The form.** On `/people/:id`, logged-in users see a form with a textarea
   (`name="body"`) and an "Add note" button. It is a plain HTML form
   (`method="post"`) that submits to `/api/people/:id/notes`, and it works with
   JavaScript turned off. Logged-out users don't see it.
2. **The endpoint.** Finish the `POST` handler in
   `src/routes/api/people.$id.notes.ts`. It receives the form and responds:

   | Situation | Response |
   |---|---|
   | Not logged in | `401` |
   | `body` is missing or empty (after trimming) | `400` |
   | Otherwise: save the trimmed note with the current user as author | `303` redirect to `/people/:id` |

3. **Show it works.** Add a note in the browser, then send one request with
   `curl` (the README shows how to log in with a cookie file).

`npm run test:task-1` runs the tests for this task.
