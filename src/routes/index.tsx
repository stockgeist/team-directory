import { Link, createFileRoute } from '@tanstack/react-router'
import { getPeople } from '../lib/people.functions'

export const Route = createFileRoute('/')({
  loader: () => getPeople(),
  component: PeopleList,
})

function PeopleList() {
  const people = Route.useLoaderData()

  return (
    <>
      <h1>People</h1>
      <p className="muted">{people.length} people</p>
      <ul className="people">
        {people.map((person) => (
          <li key={person.id}>
            <img src={person.picture} alt="" width={48} height={48} />
            <div>
              <Link to="/people/$id" params={{ id: person.id }}>
                {person.firstName} {person.lastName}
              </Link>
              <div className="muted">
                {person.city}, {person.country}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
