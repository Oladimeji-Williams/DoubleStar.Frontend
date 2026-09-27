// libs/payments/src/lib/payment-lookup-page/payment-lookup-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiException, KoboCurrencyPipe } from '@doublestar/shared';
import { PaymentsApiService } from '../payments-api.service';
import { PaymentMethod, PaymentSourceType, PaymentTransaction } from '../models/payment.model';

@Component({
  selector: 'app-payment-lookup-page',
  standalone: true,
  imports: [CommonModule, FormsModule, KoboCurrencyPipe],
  templateUrl: './payment-lookup-page.component.html',
  styleUrl: './payment-lookup-page.component.scss',
})
export class PaymentLookupPageComponent {
  private readonly paymentsApi = inject(PaymentsApiService);

  protected readonly sourceType = signal<PaymentSourceType>('Sale');
  protected readonly sourceId = signal<number | null>(null);
  protected readonly payments = signal<PaymentTransaction[] | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly amountNaira = signal<number | null>(null);
  protected readonly method = signal<PaymentMethod>('Cash');
  protected readonly isRecording = signal(false);

  protected lookup(): void {
    const id = this.sourceId();
    if (id === null) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.paymentsApi.getForSource(this.sourceType(), id).subscribe({
      next: (payments) => {
        this.isLoading.set(false);
        this.payments.set(payments);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
      },
    });
  }

  protected recordPayment(): void {
    const id = this.sourceId();
    const naira = this.amountNaira();
    if (id === null || naira === null || naira <= 0) return;

    this.isRecording.set(true);
    this.errorMessage.set(null);

    this.paymentsApi
      .recordManual({
        sourceType: this.sourceType(),
        sourceId: id,
        amountKobo: Math.round(naira * 100),
        method: this.method(),
      })
      .subscribe({
        next: () => {
          this.isRecording.set(false);
          this.amountNaira.set(null);
          this.lookup();
        },
        error: (error: unknown) => {
          this.isRecording.set(false);
          this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
        },
      });
  }
}