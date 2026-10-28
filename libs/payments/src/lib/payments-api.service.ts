
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiClientService,
  DataTableQuery,
  PagedResult,
  buildDataTableQueryParams,
} from '@doublestar/shared';

import {
  InitializePaystackPaymentRequest,
  PaymentListItem,
  PaymentSourceType,
  PaymentTransaction,
  RecordManualPaymentRequest,
  RefundPaymentRequest,
} from './models/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentsApiService {
  private readonly api = inject(ApiClientService);

  getPaged(
    query: DataTableQuery,
  ): Observable<PagedResult<PaymentListItem>> {
    return this.api.get<PagedResult<PaymentListItem>>(
      '/payments',
      buildDataTableQueryParams(query),
    );
  }

  getForSource(
    sourceType: PaymentSourceType,
    sourceId: number,
  ): Observable<PaymentTransaction[]> {
    return this.api.get<PaymentTransaction[]>(
      `/payments/source/${sourceType}/${sourceId}`,
    );
  }

  recordManual(
    request: RecordManualPaymentRequest,
  ): Observable<PaymentTransaction> {
    return this.api.post<PaymentTransaction>(
      '/payments/manual',
      request,
    );
  }

  refund(
    paymentId: string,
    request: RefundPaymentRequest,
  ): Observable<void> {
    return this.api.post<void>(
      `/payments/${paymentId}/refund`,
      request,
    );
  }

  initializePaystack(
    request: InitializePaystackPaymentRequest,
  ): Observable<string> {
    return this.api.post<string>(
      '/payments/paystack/initialize',
      request,
    );
  }
}