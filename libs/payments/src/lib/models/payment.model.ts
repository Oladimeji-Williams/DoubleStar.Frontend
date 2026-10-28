export type PaymentSourceType = 'Sale' | 'RepairJob' | 'Order'

export type PaymentMethod =
  | 'Cash'
  | 'Transfer'
  | 'Card'
  | 'Paystack';

export type PaymentStatus =
  | 'Pending'
  | 'Successful'
  | 'Failed'
  | 'Refunded'
  | 'PartiallyRefunded';

export interface PaymentTransaction {
  id: string;
  sourceType: PaymentSourceType;
  sourceId: number;
  amountKobo: number;
  totalRefundedKobo: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paystackReference: string | null;
}

export interface PaymentListItem extends PaymentTransaction {
  createdAt: string;
}

export interface RefundPaymentRequest {
  amountKobo: number;
  reason: string;
}

export interface InitializePaystackPaymentRequest {
  sourceType: PaymentSourceType;
  sourceId: number;
  amountKobo: number;
  email: string;
  callbackUrl: string;
}

export interface RecordManualPaymentRequest {
  sourceType: PaymentSourceType;
  sourceId: number;
  amountKobo: number;
  method: PaymentMethod;
}

export const PAYMENT_SOURCE_LABELS: Readonly<Record<PaymentSourceType, string>> = {
  Sale: 'Sale',
  RepairJob: 'Repair',
  Order: 'Online order',
};

export function isPaymentSourceType(value: string | null): value is PaymentSourceType {
  return value === 'Sale' || value === 'RepairJob' || value === 'Order';
}