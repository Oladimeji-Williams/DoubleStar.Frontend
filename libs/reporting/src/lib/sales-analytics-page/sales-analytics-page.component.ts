import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ReportingApiService } from '../reporting-api.service';

import {
  DailyRevenue,
  PaymentMethodSummary,
  SalesSummary,
  TopSellingProduct,
} from '../models/reporting.model';

@Component({
  selector: 'app-sales-analytics-page',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './sales-analytics-page.component.html',
  styleUrl: './sales-analytics-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesAnalyticsPageComponent implements OnInit {
  private readonly reportingApi =
    inject(ReportingApiService);

  protected readonly periodDays =
    signal(30);

  protected readonly salesSummary =
    signal<SalesSummary | null>(null);

  protected readonly previousSalesSummary =
    signal<SalesSummary | null>(null);

  protected readonly revenueByDay =
    signal<DailyRevenue[]>([]);

  protected readonly isLoading =
    signal(true);

  protected readonly hasError =
    signal(false);
  protected readonly topSellingProducts =
    signal<TopSellingProduct[]>([]);

  protected readonly paymentMethodSummary =
    signal<PaymentMethodSummary[]>([]);
  protected readonly chartMode =
    signal<'revenue' | 'sales'>('revenue');

  protected paymentMethodLabel(
    method: string,
  ): string {
    return method
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, char => char.toUpperCase());
  }
  protected readonly maxChartValue =
    computed(() => {
      const data = this.revenueByDay();

      if (data.length === 0) {
        return 1;
      }

      const values = data.map((item) =>
        this.chartMode() === 'revenue'
          ? item.revenueKobo
          : item.salesCount,
      );

      return Math.max(1, ...values);
    });

  ngOnInit(): void {
    this.load();
  }

  protected setPeriod(days: number): void {
    this.periodDays.set(days);
    this.load();
  }

  protected setChartMode(
    mode: 'revenue' | 'sales',
  ): void {
    this.chartMode.set(mode);
  }

  protected refresh(): void {
    this.load();
  }
  protected topProductRevenueShare(
    product: TopSellingProduct,
  ): number {
    const total = this.topSellingProducts()
      .reduce(
        (sum, item) => sum + item.revenueKobo,
        0,
      );

    if (total === 0) {
      return 0;
    }

    return (product.revenueKobo / total) * 100;
  }
  protected revenueText(
    value: number,
  ): string {
    return `₦${(
      value / 100
    ).toLocaleString('en-NG', {
      maximumFractionDigits: 0,
    })}`;
  }

  protected averageSaleText(): string {
    return this.revenueText(
      this.salesSummary()
        ?.averageSaleKobo ?? 0,
    );
  }

  protected totalRevenueText(): string {
    return this.revenueText(
      this.salesSummary()
        ?.totalRevenueKobo ?? 0,
    );
  }

  protected salesCountText(): string {
    return (
      this.salesSummary()
        ?.salesCount ?? 0
    ).toLocaleString('en-NG');
  }

  protected changePercent(): number {
    const current =
      this.salesSummary()
        ?.totalRevenueKobo ?? 0;

    const previous =
      this.previousSalesSummary()
        ?.totalRevenueKobo ?? 0;

    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return (
      ((current - previous) / previous) *
      100
    );
  }

  protected changeText(): string {
    const change =
      this.changePercent();

    return `${
      change >= 0 ? '+' : ''
    }${change.toFixed(1)}%`;
  }

  protected chartValue(
    item: DailyRevenue,
  ): number {
    return this.chartMode() === 'revenue'
      ? item.revenueKobo
      : item.salesCount;
  }
  protected chartHeight(
    item: DailyRevenue,
  ): number {
    return (
      (this.chartValue(item) /
        this.maxChartValue()) *
      100
    );
  }
  protected chartDisplayValue(
    item: DailyRevenue,
  ): string {
    if (
      this.chartMode() ===
      'revenue'
    ) {
      return this.revenueText(
        item.revenueKobo,
      );
    }

    return `${item.salesCount} sale${
      item.salesCount === 1
        ? ''
        : 's'
    }`;
  }

  protected dateLabel(
    date: string,
  ): string {
    return new Date(
      date,
    ).toLocaleDateString(
      'en-NG',
      {
        day: 'numeric',
        month: 'short',
      },
    );
  }

  protected bestDay():
    DailyRevenue | null {
    const data =
      this.revenueByDay();

    if (data.length === 0) {
      return null;
    }

    return data.reduce(
      (best, current) =>
        current.revenueKobo >
        best.revenueKobo
          ? current
          : best,
    );
  }

  protected worstDay():
    DailyRevenue | null {
    const data =
      this.revenueByDay();

    if (data.length === 0) {
      return null;
    }

    return data.reduce(
      (worst, current) =>
        current.revenueKobo <
        worst.revenueKobo
          ? current
          : worst,
    );
  }

  protected averageDailyRevenue(): string {
    const data =
      this.revenueByDay();

    if (data.length === 0) {
      return '₦0';
    }

    const total =
      data.reduce(
        (sum, item) =>
          sum + item.revenueKobo,
        0,
      );

    return this.revenueText(
      total / data.length,
    );
  }
  private load(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const currentTo =
      new Date();

    const currentFrom =
      new Date();

    currentFrom.setDate(
      currentFrom.getDate() -
        this.periodDays(),
    );

    const previousTo =
      new Date(currentFrom);

    const previousFrom =
      new Date(previousTo);

    previousFrom.setDate(
      previousFrom.getDate() -
        this.periodDays(),
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
      current:
        this.reportingApi
          .getSalesSummary(
            currentFromIso,
            currentToIso,
          )
          .pipe(
            catchError(() =>
              of<SalesSummary | null>(null),
            ),
          ),

      previous:
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

      daily:
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

      topProducts:
        this.reportingApi
          .getTopSellingProducts(
            currentFromIso,
            currentToIso,
            10,
          )
          .pipe(
            catchError(() =>
              of<TopSellingProduct[]>([]),
            ),
          ),

      paymentMethods:
        this.reportingApi
          .getPaymentMethodSummary(
            currentFromIso,
            currentToIso,
          )
          .pipe(
            catchError(() =>
              of<PaymentMethodSummary[]>([]),
            ),
          ),
    }).subscribe({
      next: (result) => {
        this.salesSummary.set(result.current);

        this.previousSalesSummary.set(
          result.previous,
        );

        this.revenueByDay.set(
          result.daily,
        );

        this.topSellingProducts.set(
          result.topProducts,
        );

        this.paymentMethodSummary.set(
          result.paymentMethods,
        );

        this.isLoading.set(false);
      },

      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}