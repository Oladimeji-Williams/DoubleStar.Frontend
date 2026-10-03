// libs/sales/src/lib/new-sale-page/new-sale-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { ApiException, KoboCurrencyPipe } from '@doublestar/shared';
import { ProductsApiService, Product } from '@doublestar/catalog';
import { CustomerSelection, CustomerSelectorComponent } from '@doublestar/customers';
import { SalesApiService } from '../sales-api.service';
import { Sale } from '../models/sale.model';
import { ToastService } from '@doublestar/shared';

@Component({
  selector: 'app-new-sale-page',
  standalone: true,
  imports: [CommonModule, FormsModule, KoboCurrencyPipe, CustomerSelectorComponent],
  templateUrl: './new-sale-page.component.html',
  styleUrl: './new-sale-page.component.scss',
})
export class NewSalePageComponent {
  private readonly salesApi = inject(SalesApiService);
  private readonly productsApi = inject(ProductsApiService);
  private readonly toastService = inject(ToastService);

  protected readonly sale = signal<Sale | null>(null);
  protected readonly customer = signal<CustomerSelection | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected readonly searchTerm = signal('');
  protected readonly searchResults = signal<Product[]>([]);
  private readonly searchTerm$ = new Subject<string>();

  protected readonly quantityByProductId = signal<Record<number, number>>({});
  protected readonly serialByProductId = signal<Record<number, string>>({});

  constructor() {
    this.searchTerm$
      .pipe(
        takeUntilDestroyed(),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) =>
          term.trim().length > 0
            ? this.productsApi.search(term).pipe(catchError(() => of([] as Product[])))
            : of([] as Product[]),
        ),
      )
      .subscribe((results) => this.searchResults.set(results));
  }

  protected onSearchInput(term: string): void {
    this.searchTerm.set(term);
    this.searchTerm$.next(term);
  }

  protected startSale(): void {
    const selection = this.customer();
    if (!selection) return;

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.salesApi.create(selection).subscribe({
      next: (sale) => {
        this.isBusy.set(false);
        this.sale.set(sale);
      },
      error: (error: unknown) => this.handleError(error),
    });
  }

  protected quantityFor(productId: number): number {
    return this.quantityByProductId()[productId] ?? 1;
  }

  protected setQuantity(productId: number, quantity: number): void {
    this.quantityByProductId.update((current) => ({ ...current, [productId]: quantity }));
  }

  protected setSerial(productId: number, serial: string): void {
    this.serialByProductId.update((current) => ({ ...current, [productId]: serial }));
  }

  protected addProduct(product: Product): void {
    const currentSale = this.sale();
    if (!currentSale) return;

    const isSerialized = product.trackingMode === 'Serialized';
    const serial = this.serialByProductId()[product.id]?.trim() || null;

    if (isSerialized && !serial) {
      this.errorMessage.set('Enter a serial number for this product before adding it.');
      return;
    }

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.salesApi
      .addLine(currentSale.id, {
        productId: product.id,
        quantity: isSerialized ? null : this.quantityFor(product.id),
        serialNumber: serial,
      })
      .subscribe({
        next: () => this.reloadSale(currentSale.id),
        error: (error: unknown) => this.handleError(error),
      });
  }

// libs/sales/src/lib/new-sale-page/new-sale-page.component.ts — replace just the `completeSale()` method
  protected completeSale(): void {
    const currentSale = this.sale();
    if (!currentSale) return;

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.salesApi.complete(currentSale.id).subscribe({
      next: (sale) => {
        this.isBusy.set(false);
        this.sale.set(sale);
        this.toastService.success(`Sale #${sale.id} completed.`);
      },
      error: (error: unknown) => this.handleError(error),
    });
  }

  private reloadSale(saleId: number): void {
    this.salesApi.getById(saleId).subscribe({
      next: (sale) => {
        this.isBusy.set(false);
        this.sale.set(sale);
      },
      error: (error: unknown) => this.handleError(error),
    });
  }

  private handleError(error: unknown): void {
    this.isBusy.set(false);
    this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
  }
}