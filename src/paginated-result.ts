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
  totalPages?: number = undefined

  /**
   * items per page
   */
  limit?: number = undefined

  /**
   * has previous page
   */
  hasPrevPage?: Boolean = false
  /**
   * has next page
   */
  hasNextPage?: Boolean = false

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
  pagingCounter?: number = undefined

}
