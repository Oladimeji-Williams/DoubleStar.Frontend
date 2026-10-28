import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DataTableColumn,
  DataTableFilter,
  DataTableFilterOperator,
  DataTableFilterOption,
  DataTableQuery,
  DataTableRowAction,
} from './data-table.models';

import { IconComponent } from '../icon/icon.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    FormsModule,
    IconComponent,
    PaginationComponent,
  ],
  templateUrl:
    './data-table.component.html',
  styleUrl:
    './data-table.component.scss',
})
export class DataTableComponent<
  T = unknown
> {
  private readonly router =
    inject(Router);

  readonly columns =
    input.required<DataTableColumn<T>[]>();
  readonly rowActions =
    input<DataTableRowAction<T>[]>([]);
  readonly rows =
    input.required<T[]>();

  readonly totalCount =
    input(0);

  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  readonly pageSizePreferenceKey = input<string>('');
  readonly page =
    input(1);

  readonly pageSize =
    input(10);

  readonly sortBy =
    input<string | undefined>();

  readonly sortDirection =
    input<
      'asc' | 'desc' | undefined
    >();

  readonly filters =
    input<DataTableFilter[]>([]);

  readonly rowLink =
    input<
      | ((row: T) => unknown[] | null)
      | undefined
    >();

  readonly rowClick =
    output<T>();

  readonly queryChange =
    output<DataTableQuery>();

  readonly emptyMessage =
    input('No results found.');

  readonly loading =
    input(false);
  protected readonly math = Math;
  protected readonly filterColumn =
    signal<
      DataTableColumn<T> | undefined
    >(undefined);

  protected readonly filterValue =
    signal('');

  protected readonly filterOperator =
    signal<DataTableFilterOperator>(
      'contains',
    );

  protected readonly totalPages =
    computed(() =>
      Math.max(
        1,
        Math.ceil(
          this.totalCount() /
            this.pageSize(),
        ),
      ),
    );

  protected readonly hasActiveFilters =
    computed(
      () => this.filters().length > 0,
    );

  protected cellValue(
    row: T,
    key: string,
  ): unknown {
    return (
      row as Record<
        string,
        unknown
      >
    )[key];
  }

  protected displayValue(
    column: DataTableColumn<T>,
    row: T,
  ): string {
    if (column.format) {
      return column.format(row);
    }

    const value =
      this.cellValue(
        row,
        column.key,
      );

    if (
      value === null ||
      value === undefined
    ) {
      return '';
    }

    if (
      column.dataType ===
      'boolean'
    ) {
      return value
        ? 'Yes'
        : 'No';
    }

    return String(value);
  }

  protected sortDirectionFor(
    column: DataTableColumn<T>,
  ):
    | 'asc'
    | 'desc'
    | undefined {
    const key =
      column.sortKey ??
      column.key;

    return this.sortBy() === key
      ? this.sortDirection()
      : undefined;
  }

  protected openFilter(
    column: DataTableColumn<T>,
  ): void {
    this.filterColumn.set(
      column,
    );

    const field =
      column.filterKey ??
      column.key;

    const existing =
      this.filters().find(
        filter =>
          filter.field ===
          field,
      );

    this.filterValue.set(
      existing?.value ?? '',
    );

    this.filterOperator.set(
      existing?.operator ??
        this.defaultOperator(
          column,
        ),
    );
  }

  protected closeFilter(): void {
    this.filterColumn.set(
      undefined,
    );
  }

  protected applyFilter(): void {
    const column =
      this.filterColumn();

    if (!column) {
      return;
    }

    const field =
      column.filterKey ??
      column.key;

    const operator =
      this.filterOperator();

    const value =
      this.filterValue().trim();

    let nextFilters =
      this.filters().filter(
        filter =>
          filter.field !==
          field,
      );

    const operatorNeedsValue =
      ![
        'isEmpty',
        'isNotEmpty',
      ].includes(operator);

    if (
      operatorNeedsValue &&
      !value
    ) {
      this.emitQuery({
        page: 1,
        pageSize:
          this.pageSize(),
        sortBy:
          this.sortBy(),
        sortDirection:
          this.sortDirection(),
        filters: nextFilters,
      });

      this.closeFilter();
      return;
    }

    nextFilters = [
      ...nextFilters,
      {
        field,
        operator,
        ...(operatorNeedsValue
          ? { value }
          : {}),
      },
    ];

    this.emitQuery({
      page: 1,
      pageSize:
        this.pageSize(),
      sortBy:
        this.sortBy(),
      sortDirection:
        this.sortDirection(),
      filters: nextFilters,
    });

    this.closeFilter();
  }

  protected removeFilter(
    column: DataTableColumn<T>,
  ): void {
    const field =
      column.filterKey ??
      column.key;

    const filters =
      this.filters().filter(
        filter =>
          filter.field !==
          field,
      );

    this.emitQuery({
      page: 1,
      pageSize:
        this.pageSize(),
      sortBy:
        this.sortBy(),
      sortDirection:
        this.sortDirection(),
      filters,
    });
  }

  protected clearFilters(): void {
    this.emitQuery({
      page: 1,
      pageSize:
        this.pageSize(),
      sortBy:
        this.sortBy(),
      sortDirection:
        this.sortDirection(),
      filters: [],
    });
  }

  protected onHeaderClick(
    column: DataTableColumn<T>,
  ): void {
    if (!column.sortable) {
      return;
    }

    const key =
      column.sortKey ??
      column.key;

    let direction:
      | 'asc'
      | 'desc'
      | undefined;

    if (
      this.sortBy() !== key
    ) {
      direction = 'asc';
    } else if (
      this.sortDirection() ===
      'asc'
    ) {
      direction = 'desc';
    }

    this.emitQuery({
      page: 1,
      pageSize:
        this.pageSize(),
      sortBy:
        direction
          ? key
          : undefined,
      sortDirection:
        direction,
      filters:
        this.filters(),
    });
  }

  protected handlePageChange(
    page: number,
  ): void {
    this.emitQuery({
      page,
      pageSize:
        this.pageSize(),
      sortBy:
        this.sortBy(),
      sortDirection:
        this.sortDirection(),
      filters:
        this.filters(),
    });
  }

  protected handlePageSizeChange(
    pageSize: number,
  ): void {
    this.emitQuery({
      page: 1,
      pageSize,
      sortBy:
        this.sortBy(),
      sortDirection:
        this.sortDirection(),
      filters:
        this.filters(),
    });
  }

  protected handleRowClick(
    row: T,
  ): void {
    this.rowClick.emit(row);

    const link =
      this.rowLink()?.(row);

    if (link) {
      void this.router.navigate(
        link,
      );
    }
  }

  protected filterFor(
    column: DataTableColumn<T>,
  ): DataTableFilter | undefined {
    const field =
      column.filterKey ??
      column.key;

    return this.filters().find(
      filter =>
        filter.field === field,
    );
  }

  protected filterLabel(
    column: DataTableColumn<T>,
  ): string {
    const filter =
      this.filterFor(
        column,
      );

    if (!filter) {
      return '';
    }

    if (
      filter.operator ===
      'isEmpty'
    ) {
      return 'Empty';
    }

    if (
      filter.operator ===
      'isNotEmpty'
    ) {
      return 'Not empty';
    }

    return filter.value ?? '';
  }

  protected operatorsFor(
    column: DataTableColumn<T>,
  ): DataTableFilterOperator[] {
    if (
      column.filterConfig
        ?.operators
    ) {
      return column
        .filterConfig
        .operators;
    }

    if (
      column.filterType ===
      'select'
    ) {
      return [
        'equals',
        'notEquals',
      ];
    }

    return [
      'contains',
      'equals',
      'startsWith',
      'endsWith',
      'notEquals',
      'isEmpty',
      'isNotEmpty',
    ];
  }

  protected operatorLabel(
    operator: DataTableFilterOperator,
  ): string {
    switch (operator) {
      case 'equals':
        return 'Equals';

      case 'notEquals':
        return 'Does not equal';

      case 'contains':
        return 'Contains';

      case 'startsWith':
        return 'Starts with';

      case 'endsWith':
        return 'Ends with';

      case 'isEmpty':
        return 'Is empty';

      case 'isNotEmpty':
        return 'Is not empty';
    }
  }

  private defaultOperator(
    column: DataTableColumn<T>,
  ): DataTableFilterOperator {
    return column.filterType ===
      'select'
      ? 'equals'
      : 'contains';
  }

  private emitQuery(
    query: DataTableQuery,
  ): void {
    this.queryChange.emit(
      query,
    );
  }

  protected filterOptionsFor(
    column: DataTableColumn<T>,
  ): DataTableFilterOption[] {
    return (
      column.filterConfig?.options ??
      column.filterOptions ??
      []
    );
  }

  protected visibleRowActions(
    row: T,
  ): DataTableRowAction<T>[] {
    return this.rowActions().filter(
      action =>
        !action.visible ||
        action.visible(row),
    );
  }

  protected handleRowAction(
    event: MouseEvent,
    action: DataTableRowAction<T>,
    row: T,
  ): void {
    event.stopPropagation();

    if (
      action.disabled &&
      action.disabled(row)
    ) {
      return;
    }

    action.action(row);
  }
}

