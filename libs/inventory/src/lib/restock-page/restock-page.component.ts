// libs/inventory/src/lib/restock-page/restock-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiException } from '@doublestar/shared';
import { Product, ProductsApiService } from '@doublestar/catalog';
import { InventoryApiService } from '../inventory-api.service';

@Component({
  selector: 'app-restock-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './restock-page.component.html',
  styleUrl: './restock-page.component.scss',
})
export class RestockPageComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);
  private readonly inventoryApi = inject(InventoryApiService);

  protected readonly products = signal<Product[]>([]);
  protected readonly selectedProductId = signal<number | null>(null);
  protected readonly quantity = signal<number | null>(null);
  protected readonly serialNumber = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  ngOnInit(): void {
    this.productsApi.getAll().subscribe((products) => this.products.set(products));
  }

  protected get selectedProduct(): Product | null {
    return this.products().find((p) => p.id === this.selectedProductId()) ?? null;
  }

  protected submit(): void {
    const product = this.selectedProduct;
    if (!product) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.isBusy.set(true);

    const onDone = () => {
      this.isBusy.set(false);
      this.successMessage.set('Stock updated.');
      this.quantity.set(null);
      this.serialNumber.set('');
    };
    const onError = (error: unknown) => {
      this.isBusy.set(false);
      this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
    };

    if (product.trackingMode === 'Serialized') {
      const serial = this.serialNumber().trim();
      if (!serial) {
        this.isBusy.set(false);
        this.errorMessage.set('Enter a serial number.');
        return;
      }
      this.inventoryApi.addSerialized(product.id, serial).subscribe({ next: onDone, error: onError });
    } else {
      const qty = this.quantity();
      if (!qty || qty <= 0) {
        this.isBusy.set(false);
        this.errorMessage.set('Enter a quantity greater than zero.');
        return;
      }
      this.inventoryApi.restockBulk(product.id, qty, null).subscribe({ next: onDone, error: onError });
    }
  }
}