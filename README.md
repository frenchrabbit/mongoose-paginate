# @frabbit/mongoose-paginate [![npm](https://img.shields.io/npm/v/@frabbit/mongoose-paginate.svg)](https://npmjs.com/package/@frabbit/mongoose-paginate)

Mongoose paginate plugin with full typescript support and support for latest mongoose package and types.

Main idea is to add pagination options to `find()` and `aggregate()` without duplicating other params.
Mongoose seems to be adding more typescript support, so old pagination plugins gets old.

[Legacy Version](https://github.com/sxzz/mongoose-paginate-legacy)

## Features

Major version is same as mongoose version

Provides 2 new methods on model

```typescript
async function findPaginated(
  filter: FilterQuery<T> = {}, // same as  mongoose.find 
  pagination: PaginationOptions<T>, // plugin's param
  projection?: ProjectionType<T> | null, // same as  mongoose.find
  options?: QueryOptions<T> | null // same as  mongoose.find
): Promise<PaginatedResult<T>> {
}
```

```typescript
async function aggregatePaginated(
  pipeline: PipelineStage[], // same as mongoose.aggregate
  paginate: PaginationOptions<T>, // plugin's param
  options?: AggregateOptions // same as mongoose.aggregate
): Promise<PaginatedResult<T>> {
}
```

the result is:

```typescript
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
```

## Install

```bash
npm i -D @frabbit/mongoose-paginate
```

## Usage

```typescript
import {mongoosePagination, PaginatedModel, PaginatedResult} from "@frabbit/mongoose-paginate";

interface Some {
  field: string
}

type SomeDocument = Document & Some

const someSchema = new Schema({
  field: String,
});

someSchema.plugin(mongoosePagination);

const someModel: PaginatedModel<SomeDocument>
("Some", someSchema);

const items: PaginatedResult<SomeDocument> = await someModel.findPaginated({}, {limit: 10, page: 1})
const items2: PaginatedResult<Some> = await someModel.findPaginated({}, {limit: 10, page: 1}, {field: 1}, {lean: true})

```

## License

[MIT](./LICENSE) License © 2023-PRESENT [frenchrabbit](https://github.com/frenchrabbit)
