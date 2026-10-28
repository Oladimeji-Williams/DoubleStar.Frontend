// libs/reporting/src/lib/models/reporting.model.ts
export interface SalesSummary {
  totalRevenueKobo: number;
  salesCount: number;
  averageSaleKobo: number;
}

export interface DailyRevenue {
  date: string;
  revenueKobo: number;
  salesCount: number;
}

export interface InventoryValuation {
  totalValueKobo: number;
  productCount: number;
  lowStockCount: number;
}

export interface RepairTurnaround {
  completedCount: number;
  averageTurnaroundHours: number;
}

export interface TopSellingProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  revenueKobo: number;
}

export interface PaymentMethodSummary {
  paymentMethod: string;
  transactionCount: number;
  amountKobo: number;
}