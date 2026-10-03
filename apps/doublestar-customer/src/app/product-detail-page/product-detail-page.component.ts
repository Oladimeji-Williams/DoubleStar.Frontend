// apps/doublestar-customer/src/app/product-detail-page/product-detail-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { Product, ProductImageComponent, ProductsApiService } from '@doublestar/catalog';
import { PublicTopbarComponent } from '../public-topbar/public-topbar.component';
import { PageSeoService } from '@doublestar/shared';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [RouterLink, KoboCurrencyPipe, ProductImageComponent, PublicTopbarComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsApi = inject(ProductsApiService);
  private readonly seo = inject(PageSeoService, { optional: true });

  protected readonly product = signal<Product | null>(null);
  protected readonly isLoading = signal(true);

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
}