export const ORDER_STATUSES = [
  'PendingPayment',
  'Paid',
  'Processing',
  'ReadyForPickup',
  'OutForDelivery',
  'Completed',
  'Cancelled',
  'Expired',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const FULFILLMENT_METHODS = ['Pickup', 'Delivery'] as const;

export type FulfillmentMethod = (typeof FULFILLMENT_METHODS)[number];

export const ORDER_STATUS_LABELS: Readonly<Record<OrderStatus, string>> = {
  PendingPayment: 'Awaiting payment',
  Paid: 'Paid',
  Processing: 'Processing',
  ReadyForPickup: 'Ready for pickup',
  OutForDelivery: 'Out for delivery',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Expired: 'Expired',
};

const PAID_STATUSES: readonly OrderStatus[] = [
  'Paid',
  'Processing',
  'ReadyForPickup',
  'OutForDelivery',
  'Completed',
];

/** True once the customer's money has been received (even if fulfilment is still in progress). */
export function isPaidStatus(status: OrderStatus): boolean {
  return PAID_STATUSES.includes(status);
}