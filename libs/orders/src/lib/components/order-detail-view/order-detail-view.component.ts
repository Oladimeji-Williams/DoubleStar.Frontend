import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { ORDER_STATUS_LABELS, Order } from '@doublestar/orders-data-access';
import { OrderStatusBadgeComponent } from '../order-status-badge/order-status-badge.component';

/**
 * Read-only presentation of one order. Pages project their own buttons into `[orderActions]`
 * so customers (pay / cancel) and staff (advance status) share the same layout.
 */
@Component({
  selector: 'app-order-detail-view',
  standalone: true,
  imports: [DatePipe, KoboCurrencyPipe, OrderStatusBadgeComponent],
  templateUrl: './order-detail-view.component.html',
  styleUrl: './order-detail-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailViewComponent {
  readonly order = input.required<Order>();

  /** Internal "needs attention" reasons are for staff only. */
  readonly showAttention = input(false);

  protected readonly statusLabels = ORDER_STATUS_LABELS;
  protected readonly isDelivery = computed(() => this.order().fulfillmentMethod === 'Delivery');
  protected readonly isAwaitingPayment = computed(() => this.order().status === 'PendingPayment');
}