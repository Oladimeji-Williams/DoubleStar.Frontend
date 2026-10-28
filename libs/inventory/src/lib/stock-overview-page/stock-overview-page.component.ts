import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  DataTableColumn,
  DataTableFilter,
  DataTableQuery,
  DataTableRowAction,
  DataTableComponent,
} from '@doublestar/shared';

import {
  Product,
  ProductsApiService,
} from '@doublestar/catalog';

import { InventoryApiService } from '../inventory-api.service';
import { StockLevel } from '../models/stock.model';

export interface InventoryRow {
  productId: number;
  productName: string;
  sku: string;
  trackingMode: 'Bulk' | 'Serialized';
  availableQuantity: number;
  reservedQuantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

@Component({
  selector: 'app-stock-overview-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DataTableComponent,
  ],
  templateUrl:
    './stock-overview-page.component.html',
  styleUrl:
    './stock-overview-page.component.scss',
})
export class StockOverviewPageComponent
  implements OnInit
{
  private readonly productsApi =
    inject(ProductsApiService);

  private readonly inventoryApi =
    inject(InventoryApiService);

  private readonly router =
    inject(Router);

  protected readonly rows =
    signal<InventoryRow[]>([]);

  protected readonly totalCount =
    signal(0);

  protected readonly isLoading =
    signal(false);

  protected readonly query =
    signal<DataTableQuery>({
      page: 1,
      pageSize: 25,
      filters: [],
    });

  protected readonly columns:
    DataTableColumn<InventoryRow>[] = [
      {
        key: 'productName',
        label: 'Product',
        sortable: true,
        filterable: true,
      },
      {
        key: 'sku',
        label: 'SKU',
        sortable: true,
        filterable: true,
      },
      {
        key: 'trackingMode',
        label: 'Tracking',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          {
            label: 'Bulk',
            value: 'Bulk',
          },
          {
            label: 'Serialized',
            value: 'Serialized',
          },
        ],
      },
      {
        key: 'availableQuantity',
        label: 'Available',
        sortable: true,
        filterable: true,
        dataType: 'number',
      },
      {
        key: 'reservedQuantity',
        label: 'Reserved',
        sortable: true,
        filterable: true,
        dataType: 'number',
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          {
            label: 'In Stock',
            value: 'In Stock',
          },
          {
            label: 'Low Stock',
            value: 'Low Stock',
          },
          {
            label: 'Out of Stock',
            value: 'Out of Stock',
          },
        ],
      },
    ];

  protected readonly rowActions:
    DataTableRowAction<InventoryRow>[] = [
      {
        label: 'View',
        icon: 'profile',
        action: row => this.view(row),
      },
      {
        label: 'Restock',
        icon: 'inventory',
        action: row => this.restock(row),
      },
    ];

  protected readonly rowLink =
    (row: InventoryRow): unknown[] => [
      '/inventory',
      row.productId,
    ];

  ngOnInit(): void {
    this.load();
  }

  protected onQueryChange(
    query: DataTableQuery,
  ): void {
    this.query.set(query);
    this.load();
  }

  protected view(
    row: InventoryRow,
  ): void {
    void this.router.navigate([
      '/inventory',
      row.productId,
    ]);
  }

  protected restock(
    row: InventoryRow,
  ): void {
    void this.router.navigate(
      ['/inventory/restock'],
      {
        queryParams: {
          productId: row.productId,
        },
      },
    );
  }

  private load(): void {
    this.isLoading.set(true);

    const currentQuery =
      this.query();

    this.productsApi
      .getAll({
        page: currentQuery.page,
        pageSize: currentQuery.pageSize,
        sortBy:
          currentQuery.sortBy,
        sortDirection:
          currentQuery.sortDirection,
        filters:
          this.catalogFilters(
            currentQuery.filters,
          ),
      })
      .subscribe({
        next: result => {
          this.totalCount.set(
            result.totalCount,
          );

          this.loadStock(
            result.items,
          );
        },
        error: () => {
          this.rows.set([]);
          this.totalCount.set(0);
          this.isLoading.set(false);
        },
      });
  }

  private loadStock(
    products: Product[],
  ): void {
    if (products.length === 0) {
      this.rows.set([]);
      this.isLoading.set(false);
      return;
    }

    const productIds =
      products.map(
        product => product.id,
      );

    this.inventoryApi
      .getLevels(productIds)
      .subscribe({
        next: stockLevels => {
          const stockMap =
            new Map<number, StockLevel>(
              stockLevels.map(
                stock => [
                  stock.productId,
                  stock,
                ],
              ),
            );

          const rows =
            products.map(product => {
              const stock =
                stockMap.get(
                  product.id,
                );

              const available =
                stock?.availableQuantity ??
                0;

              const reserved =
                stock?.reservedQuantity ??
                0;

              return {
                productId:
                  product.id,

                productName:
                  product.name,

                sku:
                  product.sku,

                trackingMode:
                  product.trackingMode,

                availableQuantity:
                  available,

                reservedQuantity:
                  reserved,

                status:
                  this.getStatus(
                    available,
                  ),
              };
            });

          this.rows.set(rows);
          this.isLoading.set(false);
        },

        error: () => {
          this.rows.set([]);
          this.isLoading.set(false);
        },
      });
  }

  private catalogFilters(
    filters: DataTableFilter[],
  ): DataTableFilter[] {
    return filters.filter(
      filter =>
        filter.field ===
          'productName' ||
        filter.field === 'sku' ||
        filter.field ===
          'trackingMode',
    );
  }

  private getStatus(
    availableQuantity: number,
  ):
    | 'In Stock'
    | 'Low Stock'
    | 'Out of Stock' {
    if (availableQuantity <= 0) {
      return 'Out of Stock';
    }

    if (availableQuantity <= 5) {
      return 'Low Stock';
    }

    return 'In Stock';
  }
}