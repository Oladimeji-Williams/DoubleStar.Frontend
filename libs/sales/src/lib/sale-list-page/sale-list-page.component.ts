// libs/sales/src/lib/sale-list-page/sale-list-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { SalesApiService } from '../sales-api.service';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-sale-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, KoboCurrencyPipe],
  templateUrl: './sale-list-page.component.html',
  styleUrl: './sale-list-page.component.scss',
})
export class SaleListPageComponent implements OnInit {
  private readonly salesApi = inject(SalesApiService);

  protected readonly sales = signal<Sale[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly expandedSaleId = signal<number | null>(null);

  ngOnInit(): void {
    this.salesApi.getAll().subscribe({
      next: (sales) => {
        this.sales.set(sales);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Could not load sales.');
      },
    });
  }

  protected toggleExpand(saleId: number): void {
    this.expandedSaleId.set(this.expandedSaleId() === saleId ? null : saleId);
  }
}