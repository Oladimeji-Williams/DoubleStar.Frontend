import { FulfillmentMethod, OrderStatus } from '../models/order-status.model';

// Wire shapes returned by DoubleStar.Modules.Orders. Never import these outside data-access/mappers.

export interface CartItemDto {
  productId: number;
  name: string;
  sku: string;
  imageUrl: string | null;
  unitPriceKobo: number;
  quantity: number;
  lineTotalKobo: number;
  availableQuantity: number | null;
  isAvailable: boolean;
  issue: string | null;
}

export interface CartDto {
  items: CartItemDto[];
  itemCount: number;
  subtotalKobo: number;
  hasIssues: boolean;
}

export interface CheckoutSummaryDto {
  cart: CartDto;
  fulfillmentMethod: FulfillmentMethod;
  deliveryFeeKobo: number;
  totalKobo: number;
  pickupAddress: string;
  paymentWindowMinutes: number;
}

export interface OrderLineDto {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  unitPriceKobo: number;
  quantity: number;
  lineTotalKobo: number;
  serialNumbers: string[];
}

export interface OrderTimelineEntryDto {
  from: OrderStatus;
  to: OrderStatus;
  note: string | null;
  atUtc: string;
}

export interface OrderDto {
  id: number;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
  subtotalKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
  contactName: string;
  contactPhone: string;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  notes: string | null;
  createdAtUtc: string;
  paidAtUtc: string | null;
  expiresAtUtc: string;
  canPay: boolean;
  canCancel: boolean;
  needsAttention: boolean;
  attentionReason: string | null;
  nextStatuses: OrderStatus[];
  lines: OrderLineDto[];
  timeline: OrderTimelineEntryDto[];
}

export interface OrderListDto {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
  totalKobo: number;
  itemCount: number;
  contactName: string;
  createdAtUtc: string;
  needsAttention: boolean;
}

export interface PlaceOrderRequestDto {
  fulfillmentMethod: FulfillmentMethod;
  contactName: string;
  contactPhone: string;
  deliveryAddress: string | null;
  deliveryCity: string | null;
  deliveryState: string | null;
  notes: string | null;
  idempotencyKey: string;
}

export interface PlaceOrderResultDto {
  order: OrderDto;
  authorizationUrl: string;
  paymentReference: string;
}

export interface PaymentInitiationResultDto {
  authorizationUrl: string;
  paymentReference: string;
}