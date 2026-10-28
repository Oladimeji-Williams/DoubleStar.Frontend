import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  ApiException,
  DataTableColumn,
  DataTableComponent,
  DataTableFilter,
  DataTableQuery,
} from '@doublestar/shared';

import { CustomersApiService } from '../customers-api.service';
import { Customer } from '../models/customer.model';

@Component({
  selector:
    'app-customer-list-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    DataTableComponent,
  ],
  templateUrl:
    './customer-list-page.component.html',
  styleUrl:
    './customer-list-page.component.scss',
})
export class CustomerListPageComponent
  implements OnInit
{
  private readonly customersApi =
    inject(CustomersApiService);

  protected readonly customers =
    signal<Customer[]>([]);

  protected readonly isLoading =
    signal(false);

  protected readonly errorMessage =
    signal<string | null>(null);

  protected readonly page =
    signal(1);

  protected readonly pageSize =
    signal(25);

  protected readonly totalCount =
    signal(0);

  protected readonly searchTerm =
    signal('');

  protected readonly filters =
    signal<DataTableFilter[]>([]);

  protected readonly sortBy =
    signal<string | undefined>(
      'name',
    );

  protected readonly sortDirection =
    signal<
      'asc' | 'desc' | undefined
    >('asc');

  protected readonly rowLink =
    (customer: Customer) => [
      '/customers',
      customer.id,
    ];

  protected readonly columns:
    DataTableColumn<Customer>[] = [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterConfig: {
          operators: [
            'contains',
            'equals',
            'startsWith',
            'endsWith',
            'notEquals',
            'isEmpty',
            'isNotEmpty',
          ],
        },
      },

      {
        key: 'phone',
        label: 'Phone',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },

      {
        key: 'email',
        label: 'Email',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },

      {
        key: 'hasAccount',
        label: 'Account',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterConfig: {
          operators: [
            'equals',
            'notEquals',
          ],
          options: [
            {
              label: 'Has account',
              value: 'true',
            },
            {
              label: 'Walk-in',
              value: 'false',
            },
          ],
        },
        format: customer =>
          customer.hasAccount
            ? 'Yes'
            : 'Walk-in',
      },
    ];

  ngOnInit(): void {
    this.load();
  }

  protected retryLoad(): void {
    this.load();
  }

  protected onSearch(
    value: string,
  ): void {
    this.searchTerm.set(
      value,
    );

    this.page.set(1);

    this.load();
  }

  protected onTableQuery(
    query: DataTableQuery,
  ): void {
    this.page.set(
      query.page,
    );

    this.pageSize.set(
      query.pageSize,
    );

    this.sortBy.set(
      query.sortBy,
    );

    this.sortDirection.set(
      query.sortDirection,
    );

    this.filters.set(
      query.filters,
    );

    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.customersApi
      .search({
        term:
          this.searchTerm(),

        page:
          this.page(),

        pageSize:
          this.pageSize(),

        sortBy:
          this.sortBy(),

        sortDirection:
          this.sortDirection(),

        filters:
          this.filters(),
      })
      .subscribe({
        next: result => {
          this.customers.set(
            result.items,
          );

          this.totalCount.set(
            result.totalCount,
          );

          this.page.set(
            result.page,
          );

          this.pageSize.set(
            result.pageSize,
          );

          this.isLoading.set(false);
        },

        error: (
          error: unknown,
        ) => {
          this.isLoading.set(
            false,
          );

          this.errorMessage.set(
            error instanceof
            ApiException
              ? error.message
              : 'Could not load customers.',
          );
        },
      });
  }
}