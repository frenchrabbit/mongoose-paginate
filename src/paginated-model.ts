import {PaginatedResult} from "./paginated-result";
import {PaginationOptions} from "./pagination-options";
import {Model} from "mongoose";

export interface PaginatedModel<T> extends Model<T> {
  paginate(
    options?: PaginationOptions<T>,
    onError?: Function
    ): Promise<PaginatedResult<T> | undefined>
}
