// libs/payments/src/lib/models/payment.model.ts
export type PaymentSourceType = 'Sale' | 'RepairJob';
export type PaymentMethod = 'Cash' | 'Transfer' | 'Card' | 'Paystack';

export interface PaymentTransaction {
  id: string;
  sourceType: PaymentSourceType;
  sourceId: number;
  amountKobo: number;
  totalRefundedKobo: number;
  method: string;
  status: string;
  paystackReference: string | null;
}