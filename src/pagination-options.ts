import { type PopulateOption, type Types } from 'mongoose'

export interface PaginationOptions<T> extends PopulateOption {
  /**
   * Cursor field
   * @default '_id'
   */
  key?: keyof T

  /**
   * Cursor pagination, request items after this _id
   */
  after?: Types.ObjectId
  /**
   * Cursor pagination, request items before this _id
   */
  before?: Types.ObjectId

  /**
   * page number
   */
  page?: number | undefined

  /**
   * docs skip, overrides page
   */
  skip?: number | undefined
  /**
   * Docs per page
   */
  limit?: number | undefined
}
