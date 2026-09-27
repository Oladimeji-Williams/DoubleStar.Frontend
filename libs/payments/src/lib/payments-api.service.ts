// libs/payments/src/lib/payments-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { PaymentMethod, PaymentSourceType, PaymentTransaction } from './models/payment.model';

export interface RecordManualPaymentRequest {
  sourceType: PaymentSourceType;
  sourceId: number;
  amountKobo: number;
  method: PaymentMethod;
}

@Injectable({ providedIn: 'root' })
export class PaymentsApiService {
  private readonly api = inject(ApiClientService);

  // Backend enum serializes as PascalCase strings for path params here — see note below.
  getForSource(sourceType: PaymentSourceType, sourceId: number): Observable<PaymentTransaction[]> {
    return this.api.get<PaymentTransaction[]>(`/payments/source/${sourceType}/${sourceId}`);
  }

  recordManual(request: RecordManualPaymentRequest): Observable<PaymentTransaction> {
    return this.api.post<PaymentTransaction>('/payments/manual', request);
  }
}