// libs/reporting/src/lib/reporting-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { DailyRevenue, InventoryValuation, RepairTurnaround, SalesSummary } from './models/reporting.model';

@Injectable({ providedIn: 'root' })
export class ReportingApiService {
  private readonly api = inject(ApiClientService);

  getSalesSummary(fromIso: string, toIso: string): Observable<SalesSummary> {
    return this.api.get<SalesSummary>('/dashboard/sales-summary', { from: fromIso, to: toIso });
  }

  getRevenueByPeriod(fromIso: string, toIso: string): Observable<DailyRevenue[]> {
    return this.api.get<DailyRevenue[]>('/dashboard/revenue-by-period', { from: fromIso, to: toIso });
  }

  getInventoryValuation(lowStockThreshold: number): Observable<InventoryValuation> {
    return this.api.get<InventoryValuation>('/dashboard/inventory-valuation', { lowStockThreshold });
  }

  getRepairTurnaround(fromIso: string, toIso: string): Observable<RepairTurnaround> {
    return this.api.get<RepairTurnaround>('/dashboard/repair-turnaround', { from: fromIso, to: toIso });
  }
}