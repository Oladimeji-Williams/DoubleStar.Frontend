import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

import { DailyRevenue } from '../models/reporting.model';

type ChartMode = 'revenue' | 'sales';

@Component({
  selector: 'app-dashboard-revenue-chart',
  standalone: true,
  templateUrl: './dashboard-revenue-chart.component.html',
  styleUrl: './dashboard-revenue-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardRevenueChartComponent {
  readonly data = input<DailyRevenue[]>([]);
  readonly currency = input<(value: number) => string>(
    (value) => `₦${(value / 100).toLocaleString()}`,
  );

  protected readonly mode = signal<ChartMode>('revenue');

  protected readonly maxValue = computed(() => {
    const values = this.data().map((item) =>
      this.mode() === 'revenue'
        ? item.revenueKobo
        : item.salesCount,
    );

    return Math.max(1, ...values);
  });

  protected setMode(mode: ChartMode): void {
    this.mode.set(mode);
  }

  protected value(item: DailyRevenue): number {
    return this.mode() === 'revenue'
      ? item.revenueKobo
      : item.salesCount;
  }

  protected height(item: DailyRevenue): number {
    return (this.value(item) / this.maxValue()) * 100;
  }

  protected displayValue(item: DailyRevenue): string {
    if (this.mode() === 'revenue') {
      return this.currency()(item.revenueKobo);
    }

    return `${item.salesCount} sale${item.salesCount === 1 ? '' : 's'}`;
  }

  protected label(date: string): string {
    return new Date(date).toLocaleDateString(
      'en-NG',
      {
        day: 'numeric',
        month: 'short',
      },
    );
  }
}