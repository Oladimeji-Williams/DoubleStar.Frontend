import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ORDER_STATUS_LABELS, OrderStatus } from '@doublestar/orders-data-access';

type BadgeTone = 'warning' | 'info' | 'success' | 'neutral';

const TONES: Readonly<Record<OrderStatus, BadgeTone>> = {
  PendingPayment: 'warning',
  Paid: 'info',
  Processing: 'info',
  ReadyForPickup: 'info',
  OutForDelivery: 'info',
  Completed: 'success',
  Cancelled: 'neutral',
  Expired: 'neutral',
};

@Component({
  selector: 'app-order-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="'badge ' + tone()">{{ label() }}</span>`,
  styles: `
    .badge { display: inline-block; padding: 0.15rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; line-height: 1.5; white-space: nowrap; }
    .warning { background: #fef3c7; color: #92400e; }
    .info { background: #e0f2fe; color: #075985; }
    .success { background: #dcfce7; color: #166534; }
    .neutral { background: #f1f5f9; color: #475569; }
  `,
})
export class OrderStatusBadgeComponent {
  readonly status = input.required<OrderStatus>();

  protected readonly label = computed(() => ORDER_STATUS_LABELS[this.status()]);
  protected readonly tone = computed(() => TONES[this.status()]);
}