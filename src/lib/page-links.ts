/** Stands for skipped pages in the list of links. */
export const GAP = '…'
export type PageLink = number | typeof GAP

/** How many pages `totalItems` fill with `pageSize` items per page. See tasks/task-2-pagination.md. */
export function pageCount(totalItems: number, pageSize: number): number {
  throw new Error(`pageCount(${totalItems}, ${pageSize}) is not implemented yet`)
}

/**
 * The page links to show under a paginated list, e.g. 1 … 5 6 7 … 20.
 * See tasks/task-2-pagination.md.
 */
export function pageLinks(current: number, totalPages: number): PageLink[] {
  throw new Error(`pageLinks(${current}, ${totalPages}) is not implemented yet`)
}
