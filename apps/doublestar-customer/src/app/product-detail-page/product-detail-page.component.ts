// apps/doublestar-customer/src/app/product-detail-page/product-detail-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrentUserStore, KoboCurrencyPipe } from '@doublestar/shared';
import { Product, ProductImageComponent, ProductsApiService } from '@doublestar/catalog';
import { PageSeoService } from '@doublestar/shared';
import { CartApiService } from '@doublestar/orders-data-access';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [RouterLink, KoboCurrencyPipe, ProductImageComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsApi = inject(ProductsApiService);
  private readonly cartApi = inject(CartApiService);
  protected readonly currentUserStore = inject(CurrentUserStore);
  private readonly seo = inject(PageSeoService, { optional: true });

  protected readonly product = signal<Product | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isAddingToCart = signal(false);
  protected readonly cartMessage = signal('');
  protected readonly cartError = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productsApi.getById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
        this.seo?.set({ title: `${product.name} — Double Star`, description: product.description ?? `${product.name}, available at Double Star.`, path: `/products/${product.id}` });
        this.seo?.setJsonLd('product-schema', {
          '@context': 'https://schema.org', '@type': 'Product', name: product.name,
          description: product.description ?? undefined, image: product.imageUrl ?? undefined,
          offers: { '@type': 'Offer', priceCurrency: 'NGN', price: (product.unitPriceKobo / 100).toFixed(2), availability: 'https://schema.org/InStock' },
        });
      },
      error: () => this.isLoading.set(false),
    });
  }

  protected orderProduct(product: Product): void {
    if (!this.currentUserStore.isCustomer()) {
      void this.router.navigate(['/cart']);
      return;
    }

    this.isAddingToCart.set(true);
    this.cartMessage.set('');
    this.cartError.set('');
    this.cartApi.addItem(product.id, 1).subscribe({
      next: () => {
        this.isAddingToCart.set(false);
        this.cartMessage.set(`${product.name} was added to your cart.`);
      },
      error: (error: unknown) => {
        this.isAddingToCart.set(false);
        this.cartError.set(
          error instanceof Error ? error.message : 'Could not add this product to your cart.',
        );
      },
    });
  }
}