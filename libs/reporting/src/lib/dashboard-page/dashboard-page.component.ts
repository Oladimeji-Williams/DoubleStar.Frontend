// libs/reporting/src/lib/dashboard-page/dashboard-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { ReportingApiService } from '../reporting-api.service';
import { DailyRevenue, InventoryValuation, RepairTurnaround, SalesSummary } from '../models/reporting.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, KoboCurrencyPipe],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly reportingApi = inject(ReportingApiService);

  protected readonly salesSummary = signal<SalesSummary | null>(null);
  protected readonly revenueByDay = signal<DailyRevenue[]>([]);
  protected readonly inventoryValuation = signal<InventoryValuation | null>(null);
  protected readonly repairTurnaround = signal<RepairTurnaround | null>(null);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const fromIso = from.toISOString();
    const toIso = to.toISOString();

    this.reportingApi.getSalesSummary(fromIso, toIso).subscribe((summary) => this.salesSummary.set(summary));
    this.reportingApi.getRevenueByPeriod(fromIso, toIso).subscribe((days) => this.revenueByDay.set(days));
    this.reportingApi.getInventoryValuation(5).subscribe((valuation) => this.inventoryValuation.set(valuation));
    this.reportingApi.getRepairTurnaround(fromIso, toIso).subscribe((turnaround) => {
      this.repairTurnaround.set(turnaround);
      this.isLoading.set(false);
    });
  }

  protected maxRevenue(): number {
    return Math.max(1, ...this.revenueByDay().map((d) => d.revenueKobo));
  }

  protected barHeightPercent(revenueKobo: number): number {
    return (revenueKobo / this.maxRevenue()) * 100;
  }
}