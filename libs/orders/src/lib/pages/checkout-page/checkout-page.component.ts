import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiException, CurrentUserStore, KoboCurrencyPipe } from '@doublestar/shared';
import {CheckoutApiService, CheckoutSummary, FulfillmentMethod, PlaceOrderRequest,} from '@doublestar/orders-data-access';


@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [FormsModule, RouterLink, KoboCurrencyPipe],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPageComponent implements OnInit {
  private readonly checkoutApi = inject(CheckoutApiService);
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly router = inject(Router);

  protected readonly summary = signal<CheckoutSummary | null>(null);
  protected readonly fulfillmentMethod = signal<FulfillmentMethod>('Pickup');
  protected readonly contactName = signal(this.currentUserStore.currentUser()?.displayName ?? '');
  protected readonly contactPhone = signal(this.currentUserStore.currentUser()?.phone ?? '');
  protected readonly deliveryAddress = signal('');
  protected readonly deliveryCity = signal('');
  protected readonly deliveryState = signal('');
  protected readonly notes = signal('');
  protected readonly isLoading = signal(true);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal('');

  // One key per checkout attempt so a double-click or a retried request can't create two orders.
  private idempotencyKey: string | null = null;

  ngOnInit(): void {
    this.loadSummary();
  }

  protected selectFulfillment(method: FulfillmentMethod): void {
    if (this.fulfillmentMethod() === method) {
      return;
    }
    this.fulfillmentMethod.set(method);
    this.loadSummary();
  }

  protected placeOrder(): void {
    const summary = this.summary();
    if (!summary || summary.cart.items.length === 0 || summary.cart.hasIssues) {
      this.errorMessage.set('Review your cart items before placing the order.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.checkoutApi.placeOrder(this.buildRequest()).subscribe({
      next: (result) => {
        this.isSubmitting.set(false);
        if (result.authorizationUrl) {
          window.location.assign(result.authorizationUrl);
          return;
        }
        void this.router.navigate(['/checkout/callback'], {
          queryParams: { orderId: result.order.id },
        });
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        // A definitive answer from the server means this attempt is over, so the next click must be
        // a fresh attempt. A dropped connection (status 0) might have created the order, so keep the
        // key and let the server hand back the order it already made.
        if (error instanceof ApiException && error.status !== 0) {
          this.idempotencyKey = null;
        }
        this.errorMessage.set(
          error instanceof Error ? error.message : 'Could not place your order. Please try again.',
        );
      },
    });
  }

  private buildRequest(): PlaceOrderRequest {
    const isDelivery = this.fulfillmentMethod() === 'Delivery';
    this.idempotencyKey ??= globalThis.crypto.randomUUID();

    return {
      fulfillmentMethod: this.fulfillmentMethod(),
      contactName: this.contactName().trim(),
      contactPhone: this.contactPhone().trim(),
      deliveryAddress: isDelivery ? this.deliveryAddress().trim() : null,
      deliveryCity: isDelivery ? this.deliveryCity().trim() : null,
      deliveryState: isDelivery ? this.deliveryState().trim() : null,
      notes: this.notes().trim() || null,
      idempotencyKey: this.idempotencyKey,
    };
  }

  private loadSummary(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.checkoutApi.getSummary(this.fulfillmentMethod()).subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(
          error instanceof Error ? error.message : 'Could not load checkout details.',
        );
        this.isLoading.set(false);
      },
    });
  }
}