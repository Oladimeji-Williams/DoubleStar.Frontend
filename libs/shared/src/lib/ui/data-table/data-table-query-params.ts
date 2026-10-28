import { DataTableQuery } from './data-table.models';

export type DataTableQueryParams = Record<
  string,
  string | number | boolean
>;

export function buildDataTableQueryParams(
  query: DataTableQuery,
): DataTableQueryParams {
  const params: DataTableQueryParams = {
    page: query.page,
    pageSize: query.pageSize,
  };

  if (query.sortBy) {
    params['sortBy'] = query.sortBy;
  }

  if (query.sortDirection) {
    params['sortDescending'] =
      query.sortDirection === 'desc';
  }

  if (query.filters.length > 0) {
    params['filters'] = JSON.stringify(query.filters);
  }

  return params;
}