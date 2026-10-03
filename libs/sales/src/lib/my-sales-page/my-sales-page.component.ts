// libs/sales/src/lib/my-sales-page/my-sales-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KoboCurrencyPipe } from '@doublestar/shared';
import { SalesApiService } from '../sales-api.service';
import { Sale } from '../models/sale.model';

@Component({
  selector: 'app-my-sales-page',
  standalone: true,
  imports: [CommonModule, KoboCurrencyPipe],
  templateUrl: './my-sales-page.component.html',
  styleUrl: './my-sales-page.component.scss',
})
export class MySalesPageComponent implements OnInit {
  private readonly salesApi = inject(SalesApiService);

  protected readonly sales = signal<Sale[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.salesApi.getMine().subscribe((sales) => {
      this.sales.set(sales);
      this.isLoading.set(false);
    });
  }
}