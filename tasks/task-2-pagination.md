# Task 2: pagination

Under a long list we show links to pages, like `1 … 5 6 7 … 20`. The
functions go in `src/lib/page-links.ts`. Do the steps in order and run the
tests after each one.

### Step 1: how many pages?

Implement `pageCount(totalItems, pageSize)`.

| Call | Result |
|---|---|
| `pageCount(120, 20)` | `6` |
| `pageCount(121, 20)` | `7` |
| `pageCount(5, 20)` | `1` |

### Step 2: which links?

Implement `pageLinks(current, totalPages)`.

- Show the first page, the last page, the current page, and the pages just
  before and after the current one.
- Pages appear in ascending order, each once.
- Wherever pages are skipped, put `'…'`. It's exported as `GAP` from the same
  file, so you don't have to type it.

| Call | Result |
|---|---|
| `pageLinks(6, 20)` | `[1, '…', 5, 6, 7, '…', 20]` |
| `pageLinks(1, 20)` | `[1, 2, '…', 20]` |
| `pageLinks(1, 1)` | `[1]` |

### Step 3: one skipped page

When exactly one page is skipped, show that page instead of `'…'`, since
`'…'` would take the same space.

| Call | Step 2 gives | Step 3 gives |
|---|---|---|
| `pageLinks(4, 10)` | `[1, '…', 3, 4, 5, '…', 10]` | `[1, 2, 3, 4, 5, '…', 10]` |

Some situations are not specified, for example no items at all, or a
`current` outside the range. Decide what your functions do, and say why in a short comment.

`npm run test:task-2` runs the tests for this task.

## If you have time: likely duplicates

HR is about to import 5,000 people, and some of them may already be in the
directory. Implement `findLikelyDuplicates(people)` in `src/lib/duplicates.ts`.
It returns groups of two or more people whose first and last names match
when you ignore case, accents and extra spaces.

"José García", "JOSE GARCIA" and " jose  garcia " belong in one group.
Think about how fast your approach is for 5,000 people.
