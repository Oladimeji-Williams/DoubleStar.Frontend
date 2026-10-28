import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { Cart, CartApiService } from '@doublestar/orders-data-access';


@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [RouterLink, KoboCurrencyPipe],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent implements OnInit {
  private readonly cartApi = inject(CartApiService);

  protected readonly cart = signal<Cart | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly busyProductId = signal<number | null>(null);
  protected readonly errorMessage = signal('');

  ngOnInit(): void {
    this.reload();
  }

  protected reload(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.cartApi.getCart().subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(this.messageFrom(error));
        this.isLoading.set(false);
      },
    });
  }

  protected changeQuantity(productId: number, quantity: number): void {
    this.update(productId, this.cartApi.setQuantity(productId, quantity));
  }

  protected removeItem(productId: number): void {
    this.update(productId, this.cartApi.removeItem(productId));
  }

  private update(productId: number, request: ReturnType<CartApiService['getCart']>): void {
    this.busyProductId.set(productId);
    this.errorMessage.set('');
    request.subscribe({
      next: (cart) => {
        this.cart.set(cart);
        this.busyProductId.set(null);
      },
      error: (error: unknown) => {
        this.errorMessage.set(this.messageFrom(error));
        this.busyProductId.set(null);
      },
    });
  }

  private messageFrom(error: unknown): string {
    return error instanceof Error ? error.message : 'Could not update your cart. Please try again.';
  }
}