import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  DatePipe,
} from '@angular/common';

import {
  RouterLink,
} from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ReportingApiService } from '../reporting-api.service';

import {
  DailyRevenue,
  InventoryValuation,
  RepairTurnaround,
  SalesSummary,
} from '../models/reporting.model';

import {
  DashboardKpiCardComponent,
} from '../dashboard-kpi-card/dashboard-kpi-card.component';

import {
  DashboardRevenueChartComponent,
} from '../dashboard-revenue-chart/dashboard-revenue-chart.component';

import {
  DashboardHealthCardComponent,
} from '../dashboard-health-card/dashboard-health-card.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    DashboardKpiCardComponent,
    DashboardRevenueChartComponent,
    DashboardHealthCardComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  private readonly reportingApi =
    inject(ReportingApiService);

  protected readonly periodDays = signal(30);

  protected readonly salesSummary =
    signal<SalesSummary | null>(null);

  protected readonly previousSalesSummary =
    signal<SalesSummary | null>(null);

  protected readonly revenueByDay =
    signal<DailyRevenue[]>([]);

  protected readonly inventoryValuation =
    signal<InventoryValuation | null>(null);

  protected readonly repairTurnaround =
    signal<RepairTurnaround | null>(null);

  protected readonly previousRepairTurnaround =
    signal<RepairTurnaround | null>(null);

  protected readonly isLoading =
    signal(true);

  protected readonly hasError =
    signal(false);

  protected readonly lastUpdated =
    signal<Date | null>(null);

  ngOnInit(): void {
    this.load();
  }

  protected setPeriod(days: number): void {
    this.periodDays.set(days);
    this.load();
  }

  protected refresh(): void {
    this.load();
  }

  protected revenueCurrency(value: number): string {
    return `₦${(value / 100).toLocaleString(
      'en-NG',
      {
        maximumFractionDigits: 0,
      },
    )}`;
  }

  protected inventoryTone():
    'good' | 'warning' | 'danger' {
    const lowStock =
      this.inventoryValuation()?.lowStockCount ?? 0;

    if (lowStock >= 10) {
      return 'danger';
    }

    if (lowStock > 0) {
      return 'warning';
    }

    return 'good';
  }

  protected repairTone():
    'good' | 'warning' | 'danger' {
    const hours =
      this.repairTurnaround()
        ?.averageTurnaroundHours ?? 0;

    if (hours >= 72) {
      return 'danger';
    }

    if (hours >= 48) {
      return 'warning';
    }

    return 'good';
  }

  protected salesChangePercent(): number {
    const current =
      this.salesSummary()?.totalRevenueKobo ?? 0;

    const previous =
      this.previousSalesSummary()
        ?.totalRevenueKobo ?? 0;

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return ((current - previous) / previous) * 100;
  }

  protected salesChangeText(): string {
    const change =
      this.salesChangePercent();

    if (change === 0) {
      return 'No change from previous period';
    }

    return `${change > 0 ? '+' : ''}${change.toFixed(1)}% vs previous period`;
  }

  protected repairChangeText(): string {
    const current =
      this.repairTurnaround()
        ?.averageTurnaroundHours ?? 0;

    const previous =
      this.previousRepairTurnaround()
        ?.averageTurnaroundHours ?? 0;

    if (previous === 0) {
      return 'No previous repair data';
    }

    const change =
      ((current - previous) / previous) * 100;

    return `${change > 0 ? '+' : ''}${change.toFixed(1)}% vs previous period`;
  }

  private load(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const currentTo = new Date();

    const currentFrom = new Date();
    currentFrom.setDate(
      currentFrom.getDate() - this.periodDays(),
    );

    const previousTo = new Date(currentFrom);

    const previousFrom = new Date(previousTo);
    previousFrom.setDate(
      previousFrom.getDate() - this.periodDays(),
    );

    const currentFromIso =
      currentFrom.toISOString();

    const currentToIso =
      currentTo.toISOString();

    const previousFromIso =
      previousFrom.toISOString();

    const previousToIso =
      previousTo.toISOString();

    forkJoin({
      sales: this.reportingApi
        .getSalesSummary(
          currentFromIso,
          currentToIso,
        )
        .pipe(
          catchError(() =>
            of<SalesSummary | null>(null),
          ),
        ),

      previousSales:
        this.reportingApi
          .getSalesSummary(
            previousFromIso,
            previousToIso,
          )
          .pipe(
            catchError(() =>
              of<SalesSummary | null>(null),
            ),
          ),

      revenue:
        this.reportingApi
          .getRevenueByPeriod(
            currentFromIso,
            currentToIso,
          )
          .pipe(
            catchError(() =>
              of<DailyRevenue[]>([]),
            ),
          ),

      inventory:
        this.reportingApi
          .getInventoryValuation(5)
          .pipe(
            catchError(() =>
              of<InventoryValuation | null>(
                null,
              ),
            ),
          ),

      repairs:
        this.reportingApi
          .getRepairTurnaround(
            currentFromIso,
            currentToIso,
          )
          .pipe(
            catchError(() =>
              of<RepairTurnaround | null>(
                null,
              ),
            ),
          ),

      previousRepairs:
        this.reportingApi
          .getRepairTurnaround(
            previousFromIso,
            previousToIso,
          )
          .pipe(
            catchError(() =>
              of<RepairTurnaround | null>(
                null,
              ),
            ),
          ),
    }).subscribe({
      next: (result) => {
        this.salesSummary.set(result.sales);
        this.previousSalesSummary.set(
          result.previousSales,
        );

        this.revenueByDay.set(
          result.revenue,
        );

        this.inventoryValuation.set(
          result.inventory,
        );

        this.repairTurnaround.set(
          result.repairs,
        );

        this.previousRepairTurnaround.set(
          result.previousRepairs,
        );

        this.lastUpdated.set(new Date());
        this.isLoading.set(false);
      },

      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  protected revenueText(): string {
    return this.revenueCurrency(
      this.salesSummary()?.totalRevenueKobo ?? 0,
    );
  }

  protected averageSaleText(): string {
    return this.revenueCurrency(
      this.salesSummary()?.averageSaleKobo ?? 0,
    );
  }

  protected inventoryValueText(): string {
    return this.revenueCurrency(
      this.inventoryValuation()?.totalValueKobo ?? 0,
    );
  }
  protected salesCountText(): string {
    return (this.salesSummary()?.salesCount ?? 0).toLocaleString(
      'en-NG',
    );
  }

  protected lowStockText(): string {
    return (this.inventoryValuation()?.lowStockCount ?? 0).toLocaleString(
      'en-NG',
    );
  }

  protected completedRepairsText(): string {
    return (this.repairTurnaround()?.completedCount ?? 0).toLocaleString(
      'en-NG',
    );
  }

  protected turnaroundText(): string {
    return `${(
      this.repairTurnaround()?.averageTurnaroundHours ?? 0
    ).toFixed(1)}h`;
  }
}