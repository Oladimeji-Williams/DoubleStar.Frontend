import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  DataTableColumn,
  DataTableComponent,
  DataTableFilter,
  DataTableQuery,
} from '@doublestar/shared';

import { SalesApiService } from '../sales-api.service';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-my-sales-page',
  standalone: true,
  imports: [
    DataTableComponent,
  ],
  templateUrl:
    './my-sales-page.component.html',
  styleUrl:
    './my-sales-page.component.scss',
})
export class MySalesPageComponent
  implements OnInit
{
  private readonly salesApi =
    inject(SalesApiService);

  protected readonly sales =
    signal<Sale[]>([]);

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

  protected readonly filters =
    signal<DataTableFilter[]>([]);

  protected readonly sortBy =
    signal<string | undefined>('id');

  protected readonly sortDirection =
    signal<
      'asc' | 'desc' | undefined
    >('desc');

  protected readonly columns:
    DataTableColumn<Sale>[] = [
      {
        key: 'id',
        label: 'Order #',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'lines',
        label: 'Items',
        sortable: false,
        filterable: false,
        format: sale =>
          String(sale.lines.length),
      },
      {
        key: 'totalKobo',
        label: 'Total',
        sortable: true,
        filterable: false,
        dataType: 'currency',
        format: sale =>
          this.formatCurrency(
            sale.totalKobo,
          ),
      },
    ];

  ngOnInit(): void {
    this.load();
  }

  protected onTableQuery(
    query: DataTableQuery,
  ): void {
    this.page.set(query.page);
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

  protected retryLoad(): void {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.salesApi
      .getMine({
        page: this.page(),
        pageSize: this.pageSize(),
        sortBy: this.sortBy(),
        sortDirection:
          this.sortDirection(),
        filters: this.filters(),
      })
      .subscribe({
        next: result => {
          this.sales.set(
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

        error: () => {
          this.isLoading.set(false);

          this.errorMessage.set(
            'Could not load your orders.',
          );
        },
      });
  }

  private formatCurrency(
    kobo: number,
  ): string {
    return new Intl.NumberFormat(
      'en-NG',
      {
        style: 'currency',
        currency: 'NGN',
      },
    ).format(kobo / 100);
  }
}