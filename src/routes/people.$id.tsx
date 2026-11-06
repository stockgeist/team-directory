import { Link, createFileRoute } from '@tanstack/react-router'
import { getPersonWithNotes } from '../lib/people.functions'

export const Route = createFileRoute('/people/$id')({
  loader: ({ params }) => getPersonWithNotes({ data: params.id }),
  component: PersonPage,
})

function PersonPage() {
  const { person, notes } = Route.useLoaderData()

  return (
    <>
      <Link to="/">← All people</Link>
      <div className="person">
        <img src={person.picture} alt="" width={96} height={96} />
        <div>
          <h1>
            {person.firstName} {person.lastName}
          </h1>
          <div>
            {person.city}, {person.country}
          </div>
          <div>
            <a href={`mailto:${person.email}`}>{person.email}</a> · {person.phone}
          </div>
        </div>
      </div>

      <h2>Notes</h2>
      {notes.length === 0 ? (
        <p className="muted">No notes yet.</p>
      ) : (
        <ul className="notes">
          {notes.map((note) => (
            <li key={note.id} className="note">
              <p>{note.body}</p>
              <small className="muted">
                by {note.author} · {note.createdAt}
              </small>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
