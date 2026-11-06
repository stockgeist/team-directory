import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getPerson, listNotes, listPeople } from '../server/people.server'

export const getPeople = createServerFn().handler(() => listPeople())

export const getPersonWithNotes = createServerFn()
  .validator(z.string())
  .handler(({ data: id }) => {
    const person = getPerson(id)
    if (!person) throw notFound()
    return { person, notes: listNotes(id) }
  })
