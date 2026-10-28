import { FulfillmentMethod, OrderStatus } from './order-status.model';

export interface OrderLine {
  readonly id: number;
  readonly productId: number;
  readonly productName: string;
  readonly sku: string;
  readonly unitPriceKobo: number;
  readonly quantity: number;
  readonly lineTotalKobo: number;
  readonly serialNumbers: readonly string[];
}

export interface OrderTimelineEntry {
  readonly from: OrderStatus;
  readonly to: OrderStatus;
  readonly note: string | null;
  readonly at: Date;
}

export interface Order {
  readonly id: number;
  readonly orderNumber: string;
  readonly customerId: string;
  readonly status: OrderStatus;
  readonly fulfillmentMethod: FulfillmentMethod;
  readonly subtotalKobo: number;
  readonly deliveryFeeKobo: number;
  readonly totalKobo: number;
  readonly contactName: string;
  readonly contactPhone: string;
  readonly deliveryAddress: string | null;
  readonly deliveryCity: string | null;
  readonly deliveryState: string | null;
  readonly notes: string | null;
  readonly createdAt: Date;
  readonly paidAt: Date | null;
  readonly expiresAt: Date;
  readonly canPay: boolean;
  readonly canCancel: boolean;
  readonly needsAttention: boolean;
  readonly attentionReason: string | null;
  readonly nextStatuses: readonly OrderStatus[];
  readonly lines: readonly OrderLine[];
  readonly timeline: readonly OrderTimelineEntry[];
}

export interface OrderListItem {
  readonly id: number;
  readonly orderNumber: string;
  readonly status: OrderStatus;
  readonly fulfillmentMethod: FulfillmentMethod;
  readonly totalKobo: number;
  readonly itemCount: number;
  readonly contactName: string;
  readonly createdAt: Date;
  readonly needsAttention: boolean;
}

export interface PlaceOrderRequest {
  readonly fulfillmentMethod: FulfillmentMethod;
  readonly contactName: string;
  readonly contactPhone: string;
  readonly deliveryAddress: string | null;
  readonly deliveryCity: string | null;
  readonly deliveryState: string | null;
  readonly notes: string | null;
  readonly idempotencyKey: string;
}

/** Where to send the customer to pay. `null` means there is nothing left to pay. */
export interface PaymentInitiation {
  readonly authorizationUrl: string | null;
  readonly reference: string | null;
}

export interface PlaceOrderResult extends PaymentInitiation {
  readonly order: Order;
}