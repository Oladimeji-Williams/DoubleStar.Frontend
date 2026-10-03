// libs/catalog/src/lib/product-list-page/product-list-page.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmService, KoboCurrencyPipe, ToastService } from '@doublestar/shared';
import { ProductsApiService } from '../products-api.service';
import { Product } from '../models/product.model';
import { ProductImageComponent } from '../product-image/product-image.component';


@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [RouterLink, KoboCurrencyPipe, ProductImageComponent],
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

  ngOnInit(): void {
    this.load();
  }

  protected toggleArchived(): void {
    this.showArchived.update((v) => !v);
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    const source = this.showArchived() ? this.productsApi.getArchived() : this.productsApi.getAll();
    source.subscribe((products) => {
      this.products.set(products);
      this.isLoading.set(false);
    });
  }

  protected async archive(product: Product): Promise<void> {
    const confirmed = await this.confirmService.confirm(`Archive "${product.name}"? It will stop appearing in Sales and Repairs product searches.`, 'Archive');
    if (!confirmed) return;

    this.productsApi.archive(product.id).subscribe(() => {
      this.toastService.success(`${product.name} archived.`);
      this.load();
    });
  }

  protected unarchive(product: Product): void {
    this.productsApi.unarchive(product.id).subscribe(() => {
      this.toastService.success(`${product.name} unarchived.`);
      this.load();
    });
  }
}