// libs/inventory/src/lib/inventory-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { SerializedUnit, StockLevel } from './models/stock.model';

@Injectable({ providedIn: 'root' })
export class InventoryApiService {
  private readonly api = inject(ApiClientService);

  getLevel(productId: number): Observable<StockLevel> {
    return this.api.get<StockLevel>(`/stock/${productId}`);
  }

  getLowStock(threshold: number): Observable<StockLevel[]> {
    return this.api.get<StockLevel[]>('/stock/low', { threshold });
  }

  getBySerial(serialNumber: string): Observable<SerializedUnit> {
    return this.api.get<SerializedUnit>(`/stock/serials/${serialNumber}`);
  }

  restockBulk(productId: number, quantity: number, reference: string | null): Observable<void> {
    return this.api.post<void>('/stock/restock', { productId, quantity, reference });
  }

  addSerialized(productId: number, serialNumber: string): Observable<void> {
    return this.api.post<void>('/stock/serials', { productId, serialNumber });
  }

  adjust(productId: number, newQuantity: number, reason: string): Observable<void> {
    return this.api.post<void>('/stock/adjust', { productId, newQuantity, reason });
  }
}