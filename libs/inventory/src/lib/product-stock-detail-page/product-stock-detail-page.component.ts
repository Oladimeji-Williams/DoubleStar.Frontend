// libs/inventory/src/lib/product-stock-detail-page/product-stock-detail-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { Product, ProductsApiService } from '@doublestar/catalog';
import { InventoryApiService } from '../inventory-api.service';
import { SerializedUnit, StockLevel } from '../models/stock.model';

@Component({
  selector: 'app-product-stock-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, KoboCurrencyPipe],
  templateUrl: './product-stock-detail-page.component.html',
  styleUrl: './product-stock-detail-page.component.scss',
})
export class ProductStockDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductsApiService);
  private readonly inventoryApi = inject(InventoryApiService);

  protected readonly product = signal<Product | null>(null);
  protected readonly stockLevel = signal<StockLevel | null>(null);
  protected readonly isLoading = signal(true);

  protected readonly serialSearch = signal('');
  protected readonly serialResult = signal<SerializedUnit | null>(null);
  protected readonly serialError = signal<string | null>(null);

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('productId'));

    this.productsApi.getById(productId).subscribe((product) => {
      this.product.set(product);

      if (product.trackingMode === 'Bulk') {
        this.inventoryApi.getLevel(productId).subscribe({
          next: (level) => {
            this.stockLevel.set(level);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false),
        });
      } else {
        this.isLoading.set(false);
      }
    });
  }

  protected lookupSerial(): void {
    const serial = this.serialSearch().trim();
    if (!serial) return;

    this.serialError.set(null);
    this.serialResult.set(null);

    this.inventoryApi.getBySerial(serial).subscribe({
      next: (unit) => this.serialResult.set(unit),
      error: () => this.serialError.set('No unit found with that serial number.'),
    });
  }
}