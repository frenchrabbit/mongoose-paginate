import {
  type AggregateOptions,
  type FilterQuery,
  type Model,
  type PipelineStage,
  type ProjectionType,
  type QueryOptions,
} from 'mongoose'

import { type PaginatedResult } from './paginated-result'
import { type PaginationOptions } from './pagination-options'

export interface PaginatedModel<T> extends Model<T> {
  findPaginated(
    filter: FilterQuery<T>,
    pagination: PaginationOptions<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null
  ): Promise<PaginatedResult<T>>
  aggregatePaginated(
    pipeline: PipelineStage[],
    paginate: PaginationOptions<T>,
    options?: AggregateOptions
  ): Promise<PaginatedResult<T>>
}
