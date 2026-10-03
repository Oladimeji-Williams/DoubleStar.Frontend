// libs/inventory/src/lib/models/stock.model.ts
export interface StockLevel {
  productId: number;
  availableQuantity: number;
  reservedQuantity: number;
}

export interface SerializedUnit {
  id: string;
  productId: number;
  serialNumber: string;
  status: string;
}