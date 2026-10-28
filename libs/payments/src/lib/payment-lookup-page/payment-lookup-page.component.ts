import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  ApiException,
  ConfirmService,
  DataTableColumn,
  DataTableComponent,
  DataTableQuery,
  DataTableRowAction,
  KoboCurrencyPipe,
  ToastService,
} from '@doublestar/shared';

import { PaymentsApiService } from '../payments-api.service';

import {
  PAYMENT_SOURCE_LABELS,
  PaymentListItem,
  PaymentMethod,
  PaymentSourceType,
  isPaymentSourceType,
} from '../models/payment.model';


@Component({
  selector: 'app-payment-lookup-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataTableComponent,
    KoboCurrencyPipe,
  ],
  templateUrl: './payment-lookup-page.component.html',
  styleUrl: './payment-lookup-page.component.scss',
})
export class PaymentLookupPageComponent
  implements OnInit
{
  private readonly paymentsApi =
    inject(PaymentsApiService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly confirmService =
    inject(ConfirmService);

  private readonly toastService =
    inject(ToastService);

  protected readonly sourceLabels = PAYMENT_SOURCE_LABELS;

  protected readonly sourceType =
    signal<PaymentSourceType>('Sale');

  protected readonly sourceId =
    signal<number | null>(null);

  protected readonly payments =
    signal<PaymentListItem[]>([]);

  protected readonly totalCount =
    signal(0);

  protected readonly page =
    signal(1);

  protected readonly pageSize =
    signal(25);

  protected readonly sortBy =
    signal<string | undefined>('createdAt');

  protected readonly sortDirection =
    signal<'asc' | 'desc'>('desc');

  protected readonly filters =
    signal<DataTableQuery['filters']>([]);

  protected readonly isLoading =
    signal(false);

  protected readonly errorMessage =
    signal<string | null>(null);

  protected readonly amountNaira =
    signal<number | null>(null);

  protected readonly method =
    signal<PaymentMethod>('Cash');

  protected readonly payerEmail =
    signal('');

  protected readonly isRecording =
    signal(false);

  protected readonly selectedPayment =
    signal<PaymentListItem | null>(null);

  protected readonly refundAmountNaira =
    signal<number | null>(null);

  protected readonly refundReason =
    signal('');

  protected readonly isRefunding =
    signal(false);

  protected readonly columns:
    DataTableColumn<PaymentListItem>[] = [
      {
        key: 'sourceType',
        label: 'Source',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterConfig: {
          options: [
            {
              label: 'Sale',
              value: 'Sale',
            },
            {
              label: 'Repair',
              value: 'RepairJob',
            },
            {
              label: 'Online order',
              value: 'Order',
            },
          ],
        },
        format: row =>
          PAYMENT_SOURCE_LABELS[row.sourceType],
      },
      {
        key: 'sourceId',
        label: 'Source ID',
        sortable: true,
        filterable: true,
        dataType: 'number',
      },
      {
        key: 'method',
        label: 'Method',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterConfig: {
          options: [
            {
              label: 'Cash',
              value: 'Cash',
            },
            {
              label: 'Transfer',
              value: 'Transfer',
            },
            {
              label: 'Card',
              value: 'Card',
            },
            {
              label: 'Paystack',
              value: 'Paystack',
            },
          ],
        },
      },
      {
        key: 'amountKobo',
        label: 'Amount',
        sortable: true,
        filterable: true,
        dataType: 'currency',
        format: row =>
          `₦${(row.amountKobo / 100).toLocaleString(
            'en-NG',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}`,
      },
      {
        key: 'totalRefundedKobo',
        label: 'Refunded',
        sortable: true,
        dataType: 'currency',
        format: row =>
          `₦${(
            row.totalRefundedKobo / 100
          ).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterConfig: {
          options: [
            {
              label: 'Pending',
              value: 'Pending',
            },
            {
              label: 'Successful',
              value: 'Successful',
            },
            {
              label: 'Failed',
              value: 'Failed',
            },
            {
              label: 'Partially refunded',
              value: 'PartiallyRefunded',
            },
            {
              label: 'Refunded',
              value: 'Refunded',
            },
          ],
        },
      },
      {
        key: 'paystackReference',
        label: 'Paystack Reference',
        sortable: true,
        filterable: true,
      },
      {
        key: 'createdAt',
        label: 'Date',
        sortable: true,
        dataType: 'date',
        format: row =>
          new Date(row.createdAt).toLocaleString(
            'en-NG',
          ),
      },
    ];

  protected readonly rowActions:
    DataTableRowAction<PaymentListItem>[] = [
      {
        label: 'View',
        icon: 'screen',
        action: payment =>
          this.selectPayment(payment),
      },
      {
        label: 'Refund',
        icon: 'payments',
        visible: payment =>
          this.canRefund(payment),
        action: payment =>
          this.selectPaymentForRefund(payment),
      },
    ];

  ngOnInit(): void {
    const params =
      this.route.snapshot.queryParamMap;

    const sourceType =
      params.get('sourceType');

    const sourceId =
      params.get('sourceId');

    if (isPaymentSourceType(sourceType) && sourceId) {
      this.sourceType.set(
        sourceType,
      );

      this.sourceId.set(
        Number(sourceId),
      );

      this.lookup();
    }
  }

  protected loadPayments(
    query?: DataTableQuery,
  ): void {
    const effectiveQuery: DataTableQuery =
      query ?? {
        page: this.page(),
        pageSize: this.pageSize(),
        sortBy: this.sortBy(),
        sortDirection: this.sortDirection(),
        filters: this.filters(),
      };

    this.page.set(effectiveQuery.page);
    this.pageSize.set(
      effectiveQuery.pageSize,
    );
    this.sortBy.set(
      effectiveQuery.sortBy,
    );
    this.sortDirection.set(
      effectiveQuery.sortDirection ?? 'desc',
    );
    this.filters.set(
      effectiveQuery.filters,
    );

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.paymentsApi
      .getPaged(effectiveQuery)
      .subscribe({
        next: result => {
          this.payments.set(
            result.items,
          );

          this.totalCount.set(
            result.totalCount,
          );

          this.isLoading.set(false);
        },

        error: (error: unknown) => {
          this.isLoading.set(false);

          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Unable to load payments.',
          );
        },
      });
  }

  protected onQueryChange(
    query: DataTableQuery,
  ): void {
    this.loadPayments(query);
  }

  protected selectPayment(
    payment: PaymentListItem,
  ): void {
    this.selectedPayment.set(
      payment,
    );

    this.refundAmountNaira.set(
      null,
    );

    this.refundReason.set('');
  }

  protected selectPaymentForRefund(
    payment: PaymentListItem,
  ): void {
    this.selectPayment(payment);
  }

  
  protected lookup(): void {
    const id = this.sourceId();

    if (id === null) {
      return;
    }

    this.loadPayments({
      page: 1,
      pageSize: this.pageSize(),
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
      filters: [
        {
          field: 'sourceId',
          operator: 'equals',
          value: String(id),
        },
        {
          field: 'sourceType',
          operator: 'equals',
          value: this.sourceType(),
        },
      ],
    });
  }

  protected recordPayment(): void {
    const id = this.sourceId();
    const naira =
      this.amountNaira();

    if (
      id === null ||
      naira === null ||
      naira <= 0
    ) {
      return;
    }

    if (
      this.method() ===
      'Paystack'
    ) {
      this.payWithPaystack(
        id,
        naira,
      );

      return;
    }

    this.isRecording.set(true);
    this.errorMessage.set(null);

    this.paymentsApi
      .recordManual({
        sourceType:
          this.sourceType(),
        sourceId: id,
        amountKobo:
          Math.round(
            naira * 100,
          ),
        method:
          this.method(),
      })
      .subscribe({
        next: () => {
          this.isRecording.set(false);
          this.amountNaira.set(null);

          this.toastService.success(
            'Payment recorded.',
          );

          this.loadPayments();
        },

        error: (error: unknown) => {
          this.isRecording.set(false);

          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Unable to record payment.',
          );
        },
      });
  }

  protected async submitRefund(
    payment: PaymentListItem,
  ): Promise<void> {
    const naira =
      this.refundAmountNaira();

    const reason =
      this.refundReason().trim();

    if (
      naira === null ||
      naira <= 0 ||
      !reason
    ) {
      return;
    }

    const confirmed =
      await this.confirmService.confirm(
        `Refund ₦${naira.toLocaleString()} for this payment? This cannot be undone.`,
        'Issue refund',
      );

    if (!confirmed) {
      return;
    }

    this.isRefunding.set(true);
    this.errorMessage.set(null);

    this.paymentsApi
      .refund(payment.id, {
        amountKobo:
          Math.round(
            naira * 100,
          ),
        reason,
      })
      .subscribe({
        next: () => {
          this.isRefunding.set(false);

          this.selectedPayment.set(
            null,
          );

          this.refundAmountNaira.set(
            null,
          );

          this.refundReason.set('');

          this.toastService.success(
            'Refund issued.',
          );

          this.loadPayments();
        },

        error: (error: unknown) => {
          this.isRefunding.set(false);

          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Unable to issue refund.',
          );
        },
      });
  }

  protected canRefund(
    payment: PaymentListItem,
  ): boolean {
    return (
      payment.status ===
        'Successful' ||
      payment.status ===
        'PartiallyRefunded'
    );
  }

  private payWithPaystack(
    sourceId: number,
    naira: number,
  ): void {
    if (
      !this.payerEmail().trim()
    ) {
      this.errorMessage.set(
        'An email is required to pay with Paystack.',
      );

      return;
    }

    this.isRecording.set(true);
    this.errorMessage.set(null);

    const callbackUrl =
      `${window.location.origin}/payments?sourceType=${this.sourceType()}&sourceId=${sourceId}`;

    this.paymentsApi
      .initializePaystack({
        sourceType:
          this.sourceType(),
        sourceId,
        amountKobo:
          Math.round(
            naira * 100,
          ),
        email:
          this.payerEmail(),
        callbackUrl,
      })
      .subscribe({
        next:
          authorizationUrl => {
            window.location.href =
              authorizationUrl;
          },

        error: (error: unknown) => {
          this.isRecording.set(false);

          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Unable to initialize Paystack payment.',
          );
        },
      });
  }
}