// libs/catalog/src/lib/models/product.model.ts
export type StockTrackingMode = 0 | 1; // 0 = Bulk, 1 = Serialized

export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string | null;
  categoryId: number | null;
  brandId: number | null;
  unitPriceKobo: number;
  trackingMode: StockTrackingMode;
  isArchived: boolean;
}