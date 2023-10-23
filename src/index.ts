import {
  type Aggregate,
  type AggregateOptions,
  type FilterQuery,
  type PipelineStage,
  type ProjectionType,
  type QueryOptions,
  type Schema,
} from 'mongoose'

import { PaginatedResult } from './paginated-result'
import { type PaginationOptions } from './pagination-options'

export * from './paginated-model'
export * from './paginated-result'
export * from './pagination-options'

function paginateWithDefaults<T>(options?: PaginationOptions<T> | null) {
  const key = options?.key ?? '_id'

  const after = options?.after ?? undefined
  const before = options?.before ?? undefined

  const limit =
    Number.parseInt(options?.limit, 10) > 0
      ? Number.parseInt(options?.limit, 10)
      : 0

  let page = 1
  let skip = 0

  if (options?.page) {
    page = Number.parseInt(options?.page, 10)
    skip = (page - 1) * limit
  }
  return {
    key,
    after,
    before,
    limit,
    page,
    skip,
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function prepareResult<R>(
  total: number,
  items: R[],
  limit: number,
  page: number,
  queryByCursor: boolean
) {
  const result = new PaginatedResult<R>()

  result.total = total
  if (!queryByCursor) {
    const pages = limit > 0 ? Math.ceil(total / limit) ?? 1 : 0
    result.limit = total
    result.totalPages = 1
    result.page = page
    result.pagingCounter = (page - 1) * limit + 1
    result.hasPrevPage = false
    result.hasNextPage = false
    if (limit > 0) {
      result.limit = limit
      result.totalPages = pages

      if (page > 1) {
        result.hasPrevPage = true
        result.prevPage = page - 1
      }

      // Set next page
      if (page < pages) {
        result.hasNextPage = true
        result.nextPage = page + 1
      }
    }
    if (limit === 0) {
      result.limit = 0
      result.hasPrevPage = false
      result.hasNextPage = false
    }
  } else {
    const hasMore = items.length === limit + 1
    if (hasMore) {
      items.pop()
    }
    result.hasNextPage = hasMore
  }
  result.items = items
  return result
}

export const mongoosePaginate = <T>(schema: Schema<T>) => {
  schema.statics.findPaginated = async function findPaginated(
    filter: FilterQuery<T> = {},
    pagination: PaginationOptions<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null
  ): Promise<PaginatedResult<T>> {
    const { key, after, before, limit, page, skip } =
      paginateWithDefaults(pagination)

    let queryByCursor = false

    if (filter && (after || before)) {
      queryByCursor = true
      if (before) {
        filter[key] = { $lt: before }
      } else {
        filter[key] = { $gt: after }
      }
    }

    let query = this.find(filter, projection, options)

    if (limit > 0) {
      if (queryByCursor) {
        query = query.limit(limit + 1)
      } else {
        query = query.skip(skip).limit(limit)
      }
    }

    const [total, items] = await Promise.all([
      this.countDocuments(filter).exec(),
      query.exec(),
    ])

    return prepareResult<T>(total, items, limit, page, queryByCursor)
  }

  schema.statics.aggregatePaginated = async function aggregatePaginated(
    pipeline: PipelineStage[],
    paginate: PaginationOptions<T>,
    options?: AggregateOptions
  ): Promise<PaginatedResult<T>> {
    const { key, after, before, limit, page, skip } =
      paginateWithDefaults(paginate)

    let queryByCursor = false

    const match: FilterQuery<T> = {}

    if (after || before) {
      queryByCursor = true
      if (before) {
        match[key] = { $lt: before }
      } else {
        match[key] = { $gt: after }
      }
    }

    let query: Aggregate<Array<T>> = this.aggregate(pipeline, options)

    if (queryByCursor) {
      query = query.match(match)
    }

    if (limit > 0) {
      if (queryByCursor) {
        query = query.limit(limit + 1)
      } else {
        query = query.skip(skip).limit(limit)
      }
    }

    const [counts, items] = await Promise.all([
      this.aggregate(pipeline, options).count('count'),
      query.exec(),
    ])

    const total = counts?.[0]?.count

    return prepareResult<T>(total, items, limit, page, queryByCursor)
  }
}
