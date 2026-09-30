// libs/sales/src/lib/models/sale.model.ts
export type SaleStatus = 'Draft' | 'Completed' | 'Void';

export interface SaleLine {
  id: number;
  productId: number;
  unitPriceKobo: number;
  quantity: number;
  serialNumber: string | null;
  lineTotalKobo: number;
  isStockDeducted: boolean;
  productName: string;
}

export interface Sale {
  id: number;
  customerId: string | null;
  status: SaleStatus;
  totalKobo: number;
  lines: SaleLine[];
}