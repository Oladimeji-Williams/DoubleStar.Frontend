// libs/reporting/src/lib/reporting-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import {
  DailyRevenue,
  InventoryValuation,
  PaymentMethodSummary,
  RepairTurnaround,
  SalesSummary,
  TopSellingProduct,
} from './models/reporting.model';

@Injectable({ providedIn: 'root' })
export class ReportingApiService {
  private readonly api = inject(ApiClientService);

  getSalesSummary(fromIso: string, toIso: string): Observable<SalesSummary> {
    return this.api.get<SalesSummary>(
      '/Reporting/sales-summary',
      { from: fromIso, to: toIso },
    );
  }

  getRevenueByPeriod(
    fromIso: string,
    toIso: string,
  ): Observable<DailyRevenue[]> {
    return this.api.get<DailyRevenue[]>(
      '/Reporting/revenue-by-period',
      { from: fromIso, to: toIso },
    );
  }

  getInventoryValuation(
    lowStockThreshold: number,
  ): Observable<InventoryValuation> {
    return this.api.get<InventoryValuation>(
      '/Reporting/inventory-valuation',
      { lowStockThreshold },
    );
  }

  getRepairTurnaround(
    fromIso: string,
    toIso: string,
  ): Observable<RepairTurnaround> {
    return this.api.get<RepairTurnaround>(
      '/Reporting/repair-turnaround',
      { from: fromIso, to: toIso },
    );
  }

  getTopSellingProducts(
    fromIso: string,
    toIso: string,
    limit = 10,
  ): Observable<TopSellingProduct[]> {
    return this.api.get<TopSellingProduct[]>(
      '/Reporting/top-selling-products',
      {
        from: fromIso,
        to: toIso,
        limit,
      },
    );
  }

  getPaymentMethodSummary(
    fromIso: string,
    toIso: string,
  ): Observable<PaymentMethodSummary[]> {
    return this.api.get<PaymentMethodSummary[]>(
      '/Reporting/payment-methods',
      {
        from: fromIso,
        to: toIso,
      },
    );
  }
}