import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  CheckoutApiService,
  ORDER_STATUS_LABELS,
  Order,
  isPaidStatus,
} from '@doublestar/orders-data-access';

@Component({
  selector: 'app-checkout-callback-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-callback-page.component.html',
  styleUrl: './checkout-callback-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutCallbackPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly checkoutApi = inject(CheckoutApiService);

  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly order = signal<Order | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal('');
  protected readonly canRetry = signal(false);
  protected readonly isPaid = computed(() => {
    const order = this.order();
    return order !== null && isPaidStatus(order.status);
  });

  private orderId: number | null = null;

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.queryParamMap.get('orderId'));
    if (!Number.isInteger(orderId) || orderId < 1) {
      this.errorMessage.set('The payment return link is missing a valid order number.');
      this.isLoading.set(false);
      return;
    }
    this.orderId = orderId;
    this.canRetry.set(true);
    this.verifyPayment();
  }

  protected verifyPayment(): void {
    if (this.orderId === null) {
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.checkoutApi.verifyPayment(this.orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(
          error instanceof Error ? error.message : 'Could not confirm payment. Please try again.',
        );
        this.isLoading.set(false);
      },
    });
  }
}