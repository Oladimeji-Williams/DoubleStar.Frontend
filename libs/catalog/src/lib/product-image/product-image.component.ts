// libs/catalog/src/lib/product-image/product-image.component.ts
import { Component, computed, inject, input, signal } from '@angular/core';
import { API_BASE_URL, IconComponent } from '@doublestar/shared';

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss',
})
export class ProductImageComponent {
  readonly imageUrl = input<string | null>(null);
  readonly alt = input<string>('Product photo');
  readonly size = input<'thumb' | 'card' | 'large'>('card');

  private readonly baseUrl = inject(API_BASE_URL);
  protected readonly loadError = signal(false);

  protected readonly fullUrl = computed(() => {
    const url = this.imageUrl();
    return url ? `${this.baseUrl}${url}` : '';
  });

  protected onError(): void {
    this.loadError.set(true);
  }
}