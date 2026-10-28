import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  ConfirmService,
  DataTableColumn,
  DataTableComponent,
  DataTableFilter,
  DataTableQuery,
  KoboCurrencyPipe,
  ToastService,
  DataTableRowAction,
} from '@doublestar/shared';

import { ProductsApiService } from '../products-api.service';
import {
  Product,
  StockTrackingMode,
} from '../models/product.model';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    RouterLink,
    DataTableComponent,
  ],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);

  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly showArchived = signal(false);

  protected rowLink(product: Product): string[] {
    return ['/catalog/products', product.id.toString()];
  }

  protected readonly totalCount =
    signal(0);

  protected readonly page =
    signal(1);

  protected readonly pageSize =
    signal(25);

  protected readonly sortBy =
    signal<string | undefined>('name');

  protected readonly sortDirection =
    signal<'asc' | 'desc' | undefined>('asc');

  protected readonly filters =
    signal<DataTableFilter[]>([]);

  protected readonly columns:
    DataTableColumn<Product>[] = [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'sku',
        label: 'SKU',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'categoryId',
        label: 'Category',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'brandId',
        label: 'Brand',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'unitPriceKobo',
        label: 'Price',
        sortable: true,
        filterable: true,
        filterType: 'text',
        dataType: 'currency',
        format: (product) =>
          this.formatCurrency(
            product.unitPriceKobo,
          ),
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
        key: 'isArchived',
        label: 'Status',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          {
            label: 'Active',
            value: 'false',
          },
          {
            label: 'Archived',
            value: 'true',
          },
        ],
      },
    ];

  ngOnInit(): void {
    this.load();
  }

  protected toggleArchived(): void {
    this.showArchived.update(
      (value) => !value,
    );

    this.page.set(1);
    this.filters.set([]);

    this.load();
  }

  protected handleQueryChange(
    query: DataTableQuery,
  ): void {
    this.page.set(query.page);

    this.pageSize.set(query.pageSize);

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

  protected async archive(
    product: Product,
  ): Promise<void> {
    const confirmed =
      await this.confirmService.confirm(
        `Archive "${product.name}"? It will stop appearing in Sales and Repairs product searches.`,
        'Archive',
      );

    if (!confirmed) {
      return;
    }

    this.productsApi
      .archive(product.id)
      .subscribe({
        next: () => {
          this.toastService.success(
            `${product.name} archived.`,
          );

          this.load();
        },
      });
  }

  protected unarchive(
    product: Product,
  ): void {
    this.productsApi
      .unarchive(product.id)
      .subscribe({
        next: () => {
          this.toastService.success(
            `${product.name} unarchived.`,
          );

          this.load();
        },
      });
  }

  private load(): void {
    this.isLoading.set(true);

    const query: DataTableQuery = {
      page: this.page(),
      pageSize: this.pageSize(),
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
      filters: this.filters(),
    };

    this.productsApi
      .getAll(
        query,
        this.showArchived(),
      )
      .subscribe({
        next: (result) => {
          this.products.set(
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

          this.toastService.error(
            'Failed to load products.',
          );
        },
      });
  }

  private formatCurrency(
    amountKobo: number,
  ): string {
    return `₦${(
      amountKobo / 100
    ).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  protected readonly rowActions:
    DataTableRowAction<Product>[] = [
      {
        label: 'Archive',
        visible: (product) => !product.isArchived,
        className: 'dt-row-action archive-action',
        action: (product) => {
          void this.archive(product);
        },
      },
      {
        label: 'Unarchive',
        visible: (product) => product.isArchived,
        className: 'dt-row-action unarchive-action',
        action: (product) => {
          this.unarchive(product);
        },
      },
    ];
}