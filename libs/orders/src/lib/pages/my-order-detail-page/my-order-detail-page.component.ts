import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmService, ToastService } from '@doublestar/shared';
import { Order, OrdersApiService } from '@doublestar/orders-data-access';
import { OrderDetailViewComponent } from '../../components/order-detail-view/order-detail-view.component';
import { messageFrom } from '../../util/message-from';

@Component({
  selector: 'app-my-order-detail-page',
  standalone: true,
  imports: [RouterLink, OrderDetailViewComponent],
  templateUrl: './my-order-detail-page.component.html',
  styleUrl: './my-order-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyOrderDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersApi = inject(OrdersApiService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  protected readonly order = signal<Order | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isBusy = signal(false);
  protected readonly errorMessage = signal('');

  private orderId = 0;

  ngOnInit(): void {
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(orderId) || orderId < 1) {
      this.errorMessage.set('That order number is not valid.');
      this.isLoading.set(false);
      return;
    }
    this.orderId = orderId;
    this.load();
  }

  protected load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.ordersApi.getById(this.orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(messageFrom(error, 'Could not load this order.'));
        this.isLoading.set(false);
      },
    });
  }

  /** "Complete payment": asks the server for a fresh Paystack link and sends the customer there. */
  protected pay(): void {
    this.isBusy.set(true);
    this.ordersApi.retryPayment(this.orderId).subscribe({
      next: (payment) => {
        if (payment.authorizationUrl) {
          window.location.assign(payment.authorizationUrl);
          return;
        }
        this.isBusy.set(false);
        this.toast.info('Nothing is left to pay on this order.');
        this.load();
      },
      error: (error: unknown) => {
        this.isBusy.set(false);
        this.toast.error(messageFrom(error, 'Could not start payment. Please try again.'));
      },
    });
  }

  protected async cancel(): Promise<void> {
    const confirmed = await this.confirmService.confirm(
      'Cancel this order? Your items will be released and this cannot be undone.',
      'Cancel order',
      'Keep order',
    );
    if (!confirmed) {
      return;
    }

    this.isBusy.set(true);
    this.ordersApi.cancel(this.orderId).subscribe({
      next: () => {
        this.isBusy.set(false);
        this.toast.success('Your order was cancelled.');
        this.load();
      },
      error: (error: unknown) => {
        this.isBusy.set(false);
        this.toast.error(messageFrom(error, 'Could not cancel this order.'));
      },
    });
  }
}