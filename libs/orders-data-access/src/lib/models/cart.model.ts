import { FulfillmentMethod } from './order-status.model';

export interface CartItem {
  readonly productId: number;
  readonly name: string;
  readonly sku: string;
  readonly imageUrl: string | null;
  readonly unitPriceKobo: number;
  readonly quantity: number;
  readonly lineTotalKobo: number;
  readonly availableQuantity: number | null;
  readonly isAvailable: boolean;
  readonly issue: string | null;
}

export interface Cart {
  readonly items: readonly CartItem[];
  readonly itemCount: number;
  readonly subtotalKobo: number;
  readonly hasIssues: boolean;
}

export interface CheckoutSummary {
  readonly cart: Cart;
  readonly fulfillmentMethod: FulfillmentMethod;
  readonly deliveryFeeKobo: number;
  readonly totalKobo: number;
  readonly pickupAddress: string;
  readonly paymentWindowMinutes: number;
}