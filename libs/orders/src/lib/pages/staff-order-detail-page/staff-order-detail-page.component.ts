import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmService, ToastService } from '@doublestar/shared';
import { ORDER_STATUS_LABELS, Order, OrderStatus, OrdersApiService } from '@doublestar/orders-data-access';
import { OrderDetailViewComponent } from '../../components/order-detail-view/order-detail-view.component';
import { messageFrom } from '../../util/message-from';

@Component({
  selector: 'app-staff-order-detail-page',
  standalone: true,
  imports: [RouterLink, OrderDetailViewComponent],
  templateUrl: './staff-order-detail-page.component.html',
  styleUrl: './staff-order-detail-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffOrderDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly ordersApi = inject(OrdersApiService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  protected readonly statusLabels = ORDER_STATUS_LABELS;
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

  /** Moves the order along the fulfilment pipeline; the server decides which moves are legal. */
  protected advance(status: OrderStatus): void {
    this.isBusy.set(true);
    this.ordersApi.updateStatus(this.orderId, status).subscribe({
      next: () => {
        this.isBusy.set(false);
        this.toast.success(`Order marked as ${ORDER_STATUS_LABELS[status].toLowerCase()}.`);
        this.load();
      },
      error: (error: unknown) => {
        this.isBusy.set(false);
        this.toast.error(messageFrom(error, 'Could not update this order.'));
      },
    });
  }

  protected async cancel(): Promise<void> {
    const confirmed = await this.confirmService.confirm(
      'Cancel this unpaid order and release its items?',
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
        this.toast.success('Order cancelled.');
        this.load();
      },
      error: (error: unknown) => {
        this.isBusy.set(false);
        this.toast.error(messageFrom(error, 'Could not cancel this order.'));
      },
    });
  }
}