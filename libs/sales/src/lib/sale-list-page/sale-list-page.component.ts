import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  DataTableColumn,
  DataTableComponent,
  DataTableFilter,
  DataTableQuery,
} from '@doublestar/shared';

import { SalesApiService } from '../sales-api.service';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-sale-list-page',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DataTableComponent,
  ],
  templateUrl:
    './sale-list-page.component.html',
  styleUrl:
    './sale-list-page.component.scss',
})
export class SaleListPageComponent
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

  protected readonly selectedSale =
    signal<Sale | null>(null);

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
        label: '#',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'status',
        label: 'Status',
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
              label: 'Pending',
              value: 'Pending',
            },
            {
              label: 'Completed',
              value: 'Completed',
            },
            {
              label: 'Cancelled',
              value: 'Cancelled',
            },
          ],
        },
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

    this.selectedSale.set(null);

    this.load();
  }

  protected onSaleSelected(
    sale: Sale,
  ): void {
    if (
      this.selectedSale()?.id ===
      sale.id
    ) {
      this.selectedSale.set(null);
      return;
    }

    this.selectedSale.set(sale);
  }

  protected closeSaleDetails(): void {
    this.selectedSale.set(null);
  }

  protected retryLoad(): void {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.salesApi
      .getAll({
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
            'Could not load sales.',
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