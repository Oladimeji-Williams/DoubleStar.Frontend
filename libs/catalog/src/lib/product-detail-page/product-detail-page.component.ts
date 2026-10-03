// libs/catalog/src/lib/product-detail-page/product-detail-page.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiException, ConfirmService, ToastService } from '@doublestar/shared';
import { ProductsApiService } from '../products-api.service';
import { CategoriesApiService } from '../categories-api.service';
import { BrandsApiService } from '../brands-api.service';
import { Category } from '../models/category.model';
import { Brand } from '../models/brand.model';
import { Product } from '../models/product.model';
import { ProductImageComponent } from '../product-image/product-image.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [FormsModule, ProductImageComponent],
  templateUrl: './product-detail-page.component.html',
  styleUrl: './product-detail-page.component.scss',
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsApi = inject(ProductsApiService);
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly brandsApi = inject(BrandsApiService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);

  protected readonly product = signal<Product | null>(null);
  protected readonly categories = signal<Category[]>([]);
  protected readonly brands = signal<Brand[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly name = signal('');
  protected readonly description = signal('');
  protected readonly categoryId = signal<number | null>(null);
  protected readonly brandId = signal<number | null>(null);
  protected readonly priceNaira = signal<number | null>(null);

  private productId!: number;

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.categoriesApi.getAll().subscribe((categories) => this.categories.set(categories));
    this.brandsApi.getAll().subscribe((brands) => this.brands.set(brands));

    this.productsApi.getById(this.productId).subscribe((product) => {
      this.product.set(product);
      this.name.set(product.name);
      this.description.set(product.description ?? '');
      this.categoryId.set(product.categoryId);
      this.brandId.set(product.brandId);
      this.priceNaira.set(product.unitPriceKobo / 100);
      this.isLoading.set(false);
    });
  }

  protected saveDetails(): void {
    if (!this.name().trim()) return;
    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.productsApi
      .update(this.productId, { name: this.name(), description: this.description() || null, categoryId: this.categoryId(), brandId: this.brandId() })
      .subscribe({
        next: () => { this.isSaving.set(false); this.toastService.success('Details saved.'); },
        error: (error: unknown) => { this.isSaving.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
      });
  }

  protected savePrice(): void {
    const naira = this.priceNaira();
    if (naira === null || naira <= 0) return;
    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.productsApi.setPrice(this.productId, Math.round(naira * 100)).subscribe({
      next: () => { this.isSaving.set(false); this.toastService.success('Price updated.'); },
      error: (error: unknown) => { this.isSaving.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
    });
  }

  protected async archive(): Promise<void> {
    const confirmed = await this.confirmService.confirm('Archive this product? It will stop appearing in Sales and Repairs product searches.', 'Archive');
    if (!confirmed) return;

    this.productsApi.archive(this.productId).subscribe(() => {
      this.toastService.success('Product archived.');
      this.router.navigateByUrl('/catalog');
    });
  }

  protected onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.productsApi.uploadImage(this.productId, file).subscribe({
      next: (product) => { this.product.set(product); this.toastService.success('Image updated.'); },
      error: () => this.toastService.error('Could not upload image.'),
    });
  }

  protected removeImage(): void {
    this.productsApi.removeImage(this.productId).subscribe((product) => {
      this.product.set(product);
      this.toastService.success('Image removed.');
    });
  }
}