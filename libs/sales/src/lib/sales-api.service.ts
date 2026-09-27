// libs/sales/src/lib/sales-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { Sale, SaleLine } from './models/sale.model';

export interface CreateSaleRequest {
  customerId: string | null;
  walkInName: string | null;
  walkInPhone: string | null;
}

export interface AddSaleLineRequest {
  productId: number;
  quantity: number | null;
  serialNumber: string | null;
}

@Injectable({ providedIn: 'root' })
export class SalesApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<Sale[]> {
    return this.api.get<Sale[]>('/sales');
  }

  getById(id: number): Observable<Sale> {
    return this.api.get<Sale>(`/sales/${id}`);
  }

  create(request: CreateSaleRequest): Observable<Sale> {
    return this.api.post<Sale>('/sales', request);
  }

  addLine(saleId: number, request: AddSaleLineRequest): Observable<SaleLine> {
    return this.api.post<SaleLine>(`/sales/${saleId}/lines`, request);
  }

  complete(saleId: number): Observable<Sale> {
    return this.api.post<Sale>(`/sales/${saleId}/complete`, undefined);
  }

  voidSale(saleId: number): Observable<void> {
    return this.api.post<void>(`/sales/${saleId}/void`, undefined);
  }
}