// libs/catalog/src/lib/models/product.model.ts
export type StockTrackingMode = 'Bulk' | 'Serialized';

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
  imageUrl: string | null;

}