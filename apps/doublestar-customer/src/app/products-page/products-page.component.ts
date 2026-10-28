import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  DataTableQuery,
  KoboCurrencyPipe,
  PagedResult,
  PaginationComponent,
} from '@doublestar/shared';

import {
  Product,
  ProductImageComponent,
  ProductsApiService,
} from '@doublestar/catalog';


@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [
    RouterLink,
    KoboCurrencyPipe,
    ProductImageComponent,
    PaginationComponent,
  ],
  templateUrl: './products-page.component.html',
  styleUrl: './products-page.component.scss',
})
export class ProductsPageComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);

  protected readonly result = signal<PagedResult<Product> | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(12);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);

    const query: DataTableQuery = {
      page: this.page(),
      pageSize: this.pageSize(),
      sortBy: 'name',
      sortDirection: 'asc',
      filters: [],
    };

    this.productsApi.getAll(query, false).subscribe({
      next: (result: PagedResult<Product>) => {
        this.result.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.result.set(null);
        this.isLoading.set(false);
      },
    });
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
    this.load();
  }

  protected onPageSizeChange(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.page.set(1);
    this.load();
  }
}
