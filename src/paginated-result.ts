export class PaginatedResult<T> {
  /**
   * Documents on page
   */
  items: T[] = []

  /**
   * total documents count
   */
  total: number = 0

  /**
   * page
   */
  page: number = 1
  /**
   * total pages count
   */
  totalPages: number = 1

  /**
   * items per page
   */
  limit?: number = undefined

  /**
   * has previous page
   */
  hasPrevPage: boolean = false
  /**
   * has next page
   */
  hasNextPage: boolean = false

  /**
   * previous page number
   */
  prevPage?: number = undefined
  /**
   * next page number
   */
  nextPage?: number = undefined

  /**
   * The starting index/serial/chronological number of first document in current page.
   * (Eg: if page=2 and limit=10, then pagingCounter will be 11)
   */
  pagingCounter: number = 0

  constructor(data: PaginatedResult<T>) {
    Object.assign(this, data)
  }
}
