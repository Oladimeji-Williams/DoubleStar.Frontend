// libs/catalog/src/lib/product-list-page/product-list-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { ProductsApiService } from '../products-api.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, KoboCurrencyPipe],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);

  protected readonly products = signal<Product[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.productsApi.getAll().subscribe((products) => {
      this.products.set(products);
      this.isLoading.set(false);
    });
  }

  protected archive(product: Product): void {
    this.productsApi.archive(product.id).subscribe(() => this.load());
  }
}