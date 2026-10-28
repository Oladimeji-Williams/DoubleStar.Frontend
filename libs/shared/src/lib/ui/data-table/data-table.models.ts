import { IconName } from '../icon/icon.component';

export type DataTableFilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty';

export type DataTableFilterType =
  | 'text'
  | 'select';

export interface DataTableFilterOption {
  label: string;
  value: string;
}

export interface DataTableFilterConfig {
  operators?: DataTableFilterOperator[];
  options?: DataTableFilterOption[];
}

export interface DataTableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: DataTableFilterType;
  filterConfig?: DataTableFilterConfig;
  filterOptions?: DataTableFilterOption[];
  dataType?:
    | 'text'
    | 'number'
    | 'currency'
    | 'date'
    | 'boolean'
    | 'enum';
  format?: (row: T) => string;
  cellClass?: (row: T) => string;
  width?: string;
  hidden?: boolean;
  exportable?: boolean;
  sortKey?: string;
  filterKey?: string;
}

export interface DataTableFilter {
  field: string;
  operator: DataTableFilterOperator;
  value?: string;
}

export interface DataTableQuery {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters: DataTableFilter[];
}

export interface DataTableRowAction<T = unknown> {
  label: string;
  icon?: IconName;
  action: (row: T) => void;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  className?: string;
}