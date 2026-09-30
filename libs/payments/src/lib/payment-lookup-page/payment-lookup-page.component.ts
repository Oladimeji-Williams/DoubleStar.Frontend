// libs/payments/src/lib/payment-lookup-page/payment-lookup-page.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
export class PaymentLookupPageComponent implements OnInit {
  private readonly paymentsApi = inject(PaymentsApiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly sourceType = signal<PaymentSourceType>('Sale');
  protected readonly sourceId = signal<number | null>(null);
  protected readonly payments = signal<PaymentTransaction[] | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly amountNaira = signal<number | null>(null);
  protected readonly method = signal<PaymentMethod>('Cash');
  protected readonly payerEmail = signal('');
  protected readonly isRecording = signal(false);

  protected readonly expandedPaymentId = signal<string | null>(null);
  protected readonly refundAmountNaira = signal<number | null>(null);
  protected readonly refundReason = signal('');
  protected readonly isRefunding = signal(false);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const sourceType = params.get('sourceType');
    const sourceId = params.get('sourceId');

    if ((sourceType === 'Sale' || sourceType === 'RepairJob') && sourceId) {
      this.sourceType.set(sourceType);
      this.sourceId.set(Number(sourceId));
      this.lookup();
    }
  }

  protected lookup(): void {
    const id = this.sourceId();
    if (id === null) return;
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.paymentsApi.getForSource(this.sourceType(), id).subscribe({
      next: (payments) => { this.isLoading.set(false); this.payments.set(payments); },
      error: (error: unknown) => { this.isLoading.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
    });
  }

  protected recordPayment(): void {
    const id = this.sourceId();
    const naira = this.amountNaira();
    if (id === null || naira === null || naira <= 0) return;

    if (this.method() === 'Paystack') {
      this.payWithPaystack(id, naira);
      return;
    }

    this.isRecording.set(true);
    this.errorMessage.set(null);

    this.paymentsApi
      .recordManual({ sourceType: this.sourceType(), sourceId: id, amountKobo: Math.round(naira * 100), method: this.method() })
      .subscribe({
        next: () => { this.isRecording.set(false); this.amountNaira.set(null); this.lookup(); },
        error: (error: unknown) => { this.isRecording.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
      });
  }

  private payWithPaystack(sourceId: number, naira: number): void {
    if (!this.payerEmail().trim()) {
      this.errorMessage.set('An email is required to pay with Paystack.');
      return;
    }

    this.isRecording.set(true);
    this.errorMessage.set(null);
    const callbackUrl = `${window.location.origin}/payments?sourceType=${this.sourceType()}&sourceId=${sourceId}`;

    this.paymentsApi
      .initializePaystack({ sourceType: this.sourceType(), sourceId, amountKobo: Math.round(naira * 100), email: this.payerEmail(), callbackUrl })
      .subscribe({
        next: (authorizationUrl) => { window.location.href = authorizationUrl; },
        error: (error: unknown) => { this.isRecording.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
      });
  }

  protected toggleExpand(payment: PaymentTransaction): void {
    this.expandedPaymentId.set(this.expandedPaymentId() === payment.id ? null : payment.id);
    this.refundAmountNaira.set(null);
    this.refundReason.set('');
  }

  protected canRefund(payment: PaymentTransaction): boolean {
    return payment.status === 'Successful' || payment.status === 'PartiallyRefunded';
  }

  protected submitRefund(payment: PaymentTransaction): void {
    const naira = this.refundAmountNaira();
    const reason = this.refundReason().trim();
    if (naira === null || naira <= 0 || !reason) return;

    this.isRefunding.set(true);
    this.errorMessage.set(null);

    this.paymentsApi.refund(payment.id, { amountKobo: Math.round(naira * 100), reason }).subscribe({
      next: () => { this.isRefunding.set(false); this.expandedPaymentId.set(null); this.lookup(); },
      error: (error: unknown) => { this.isRefunding.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
    });
  }
}