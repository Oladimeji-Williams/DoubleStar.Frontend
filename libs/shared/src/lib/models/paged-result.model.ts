// libs/shared/src/lib/models/paged-result.model.ts
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}