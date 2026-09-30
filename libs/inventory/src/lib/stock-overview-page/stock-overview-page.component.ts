// libs/inventory/src/lib/stock-overview-page/stock-overview-page.component.ts — replace the whole class
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product, ProductsApiService } from '@doublestar/catalog';
import { InventoryApiService } from '../inventory-api.service';
import { StockLevel } from '../models/stock.model';

interface ProductWithStock {
  product: Product;
  stock: StockLevel | null;
}

@Component({
  selector: 'app-stock-overview-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './stock-overview-page.component.html',
  styleUrl: './stock-overview-page.component.scss',
})
export class StockOverviewPageComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);
  private readonly inventoryApi = inject(InventoryApiService);

  protected readonly rows = signal<ProductWithStock[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.productsApi.getAll().subscribe((products) => this.loadEach(products));
  }

  private loadEach(products: Product[]): void {
    if (products.length === 0) {
      this.isLoading.set(false);
      return;
    }

    const results: ProductWithStock[] = [];
    let remaining = products.length;

    const settle = (row: ProductWithStock) => {
      results.push(row);
      remaining--;
      if (remaining === 0) {
        results.sort((a, b) => a.product.name.localeCompare(b.product.name));
        this.rows.set(results);
        this.isLoading.set(false);
      }
    };

    for (const product of products) {
      if (product.trackingMode === 'Serialized') {
        settle({ product, stock: null });
        continue;
      }

      this.inventoryApi.getLevel(product.id).subscribe({
        next: (stock) => settle({ product, stock }),
        error: () => settle({ product, stock: { productId: product.id, availableQuantity: 0, reservedQuantity: 0 } }),
      });
    }
  }
}