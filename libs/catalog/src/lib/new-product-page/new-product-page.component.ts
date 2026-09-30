// libs/catalog/src/lib/new-product-page/new-product-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiException } from '@doublestar/shared';
import { ProductsApiService } from '../products-api.service';
import { CategoriesApiService } from '../categories-api.service';
import { BrandsApiService } from '../brands-api.service';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';
import { StockTrackingMode } from '../models/product.model';

@Component({
  selector: 'app-new-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-product-page.component.html',
  styleUrl: './new-product-page.component.scss',
})
export class NewProductPageComponent implements OnInit {
  private readonly productsApi = inject(ProductsApiService);
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly brandsApi = inject(BrandsApiService);
  private readonly router = inject(Router);

  protected readonly categories = signal<Category[]>([]);
  protected readonly brands = signal<Brand[]>([]);

  protected readonly name = signal('');
  protected readonly sku = signal('');
  protected readonly description = signal('');
  protected readonly categoryId = signal<number | null>(null);
  protected readonly brandId = signal<number | null>(null);
  protected readonly priceNaira = signal<number | null>(null);
  protected readonly trackingMode = signal<StockTrackingMode>('Bulk');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  ngOnInit(): void {
    this.categoriesApi.getAll().subscribe((categories) => this.categories.set(categories));
    this.brandsApi.getAll().subscribe((brands) => this.brands.set(brands));
  }

  protected readonly canSubmit = () =>
    this.name().trim().length > 0 && this.sku().trim().length > 0 && (this.priceNaira() ?? 0) > 0;

  protected submit(): void {
    if (!this.canSubmit()) return;

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.productsApi
      .create({
        name: this.name(),
        sku: this.sku(),
        description: this.description() || null,
        categoryId: this.categoryId(),
        brandId: this.brandId(),
        unitPriceKobo: Math.round(this.priceNaira()! * 100),
        trackingMode: this.trackingMode(),
      })
      .subscribe({
        next: () => this.router.navigateByUrl('/catalog'),
        error: (error: unknown) => {
          this.isBusy.set(false);
          this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
        },
      });
  }
}