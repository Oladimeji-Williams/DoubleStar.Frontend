import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ApiClientService,
  DataTableQuery,
  PagedResult,
  buildDataTableQueryParams,
} from '@doublestar/shared';
import { OrderDto, OrderListDto, PaymentInitiationResultDto } from '../dto/orders.dto';
import {
  toOrder,
  toOrderListItem,
  toPagedResult,
  toPaymentInitiation,
} from '../mappers/order.mapper';
import { Order, OrderListItem, PaymentInitiation } from '../models/order.model';
import { OrderStatus } from '../models/order-status.model';

@Injectable({ providedIn: 'root' })
export class OrdersApiService {
  private readonly api = inject(ApiClientService);

  /** Customer: the signed-in customer's own orders. */
  getMine(query: DataTableQuery): Observable<PagedResult<OrderListItem>> {
    return this.api
      .get<PagedResult<OrderListDto>>('/orders/mine', buildDataTableQueryParams(query))
      .pipe(map((page) => toPagedResult(page, toOrderListItem)));
  }

  /** Staff: every order. */
  getAll(query: DataTableQuery): Observable<PagedResult<OrderListItem>> {
    return this.api
      .get<PagedResult<OrderListDto>>('/orders', buildDataTableQueryParams(query))
      .pipe(map((page) => toPagedResult(page, toOrderListItem)));
  }

  getById(id: number): Observable<Order> {
    return this.api.get<OrderDto>(`/orders/${id}`).pipe(map(toOrder));
  }

  cancel(id: number): Observable<void> {
    return this.api.post<void>(`/orders/${id}/cancel`);
  }

  retryPayment(id: number): Observable<PaymentInitiation> {
    return this.api
      .post<PaymentInitiationResultDto>(`/orders/${id}/retry-payment`)
      .pipe(map(toPaymentInitiation));
  }

  updateStatus(id: number, status: OrderStatus): Observable<void> {
    return this.api.put<void>(`/orders/${id}/status`, { status });
  }
}