import { describe, expect, it } from 'vitest'
import { findLikelyDuplicates } from '../src/lib/duplicates'
import { pageCount, pageLinks, type PageLink } from '../src/lib/page-links'
import type { Person } from '../src/lib/types'

// Task 2: these fail until you implement the functions (see tasks/task-2-pagination.md).
// They cover what the task specifies. Cases the task leaves open (no items, a
// page out of range) are up to you, so they aren't tested.

describe('Task 2, step 1: pageCount', () => {
  it.each([
    [120, 20, 6],
    [121, 20, 7],
    [5, 20, 1],
    [1, 20, 1],
    [20, 20, 1],
    [21, 20, 2],
    [39, 10, 4],
    [100, 1, 100],
  ])('pageCount(%i, %i)', (totalItems, pageSize, expected) => {
    expect(pageCount(totalItems, pageSize)).toBe(expected)
  })
})

describe('Task 2, step 2: pageLinks', () => {
  it.each([
    [6, 20, [1, '…', 5, 6, 7, '…', 20]],
    [1, 20, [1, 2, '…', 20]],
    [1, 1, [1]],
    [1, 2, [1, 2]],
    [2, 2, [1, 2]],
    [2, 3, [1, 2, 3]],
    [3, 5, [1, 2, 3, 4, 5]],
    [1, 5, [1, 2, '…', 5]],
    [5, 10, [1, '…', 4, 5, 6, '…', 10]],
    [10, 10, [1, '…', 9, 10]],
    [20, 20, [1, '…', 19, 20]],
    [3, 20, [1, 2, 3, 4, '…', 20]],
  ] as [number, number, PageLink[]][])('pageLinks(%i, %i)', (current, totalPages, expected) => {
    expect(pageLinks(current, totalPages)).toEqual(expected)
  })
})

describe('Task 2, step 3: one skipped page is shown, not hidden', () => {
  it.each([
    [4, 10, [1, 2, 3, 4, 5, '…', 10]],
    [7, 10, [1, '…', 6, 7, 8, 9, 10]],
    [17, 20, [1, '…', 16, 17, 18, 19, 20]],
  ] as [number, number, PageLink[]][])('pageLinks(%i, %i)', (current, totalPages, expected) => {
    expect(pageLinks(current, totalPages)).toEqual(expected)
  })

  it('follows all the rules for every page of every size up to 40', () => {
    for (let total = 1; total <= 40; total++) {
      for (let current = 1; current <= total; current++) {
        const links = pageLinks(current, total)
        const label = `pageLinks(${current}, ${total}) = ${JSON.stringify(links)}`
        const numbers = links.filter((link): link is number => link !== '…')

        for (const required of [1, total, current, current - 1, current + 1]) {
          if (required >= 1 && required <= total) expect(numbers, label).toContain(required)
        }
        for (let i = 1; i < numbers.length; i++) expect(numbers[i], label).toBeGreaterThan(numbers[i - 1])
        links.forEach((link, i) => {
          if (link !== '…') return
          const before = links[i - 1] as number
          const after = links[i + 1] as number
          expect(after - before, `${label}: '…' must hide 2 or more pages`).toBeGreaterThan(2)
        })
        for (let i = 1; i < links.length; i++) {
          if (links[i] !== '…' && links[i - 1] !== '…') {
            expect(links[i], `${label}: no pages skipped without '…'`).toBe((links[i - 1] as number) + 1)
          }
        }
      }
    }
  })
})

describe('Task 2 (if you have time): findLikelyDuplicates', () => {
  const person = (id: string, firstName: string, lastName: string): Person => ({
    id,
    firstName,
    lastName,
    email: `${id}@example.com`,
    phone: '',
    city: '',
    country: '',
    picture: '',
  })
  const ids = (groups: Person[][]) => groups.map((group) => group.map((p) => p.id).sort()).sort()

  it('groups names that differ only in case, accents and spaces', () => {
    const groups = findLikelyDuplicates([
      person('a', 'José', 'García'),
      person('b', 'Ana', 'Lopez'),
      person('c', 'JOSE', 'GARCIA'),
      person('d', ' jose ', ' garcia '),
    ])

    expect(ids(groups)).toEqual([['a', 'c', 'd']])
  })

  it('finds several groups and leaves unique names out', () => {
    const groups = findLikelyDuplicates([
      person('a', 'Özkan', 'Çamdalı'),
      person('b', 'Ana', 'López'),
      person('c', 'ozkan', 'camdalı'),
      person('d', 'Ana', 'Lopez'),
      person('e', 'Anna', 'Lopez'),
      person('f', 'Irene', 'Muñoz'),
    ])

    expect(ids(groups)).toEqual([
      ['a', 'c'],
      ['b', 'd'],
    ])
  })

  it("doesn't merge across the first and last name", () => {
    expect(findLikelyDuplicates([person('a', 'Ann', 'Alee'), person('b', 'Anna', 'Lee')])).toEqual([])
  })

  it('returns nothing for no people or all-unique people', () => {
    expect(findLikelyDuplicates([])).toEqual([])
    expect(findLikelyDuplicates([person('a', 'A', 'B'), person('b', 'C', 'D')])).toEqual([])
  })
})
