import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { CheckoutSummaryDto, OrderDto, PlaceOrderResultDto } from '../dto/orders.dto';
import { toCheckoutSummary } from '../mappers/cart.mapper';
import { toOrder, toPlaceOrderRequestDto, toPlaceOrderResult } from '../mappers/order.mapper';
import { CheckoutSummary } from '../models/cart.model';
import { Order, PlaceOrderRequest, PlaceOrderResult } from '../models/order.model';
import { FulfillmentMethod } from '../models/order-status.model';

@Injectable({ providedIn: 'root' })
export class CheckoutApiService {
  private readonly api = inject(ApiClientService);

  getSummary(fulfillmentMethod: FulfillmentMethod): Observable<CheckoutSummary> {
    return this.api
      .get<CheckoutSummaryDto>('/checkout/summary', { fulfillmentMethod })
      .pipe(map(toCheckoutSummary));
  }

  placeOrder(request: PlaceOrderRequest): Observable<PlaceOrderResult> {
    return this.api
      .post<PlaceOrderResultDto>('/checkout', toPlaceOrderRequestDto(request))
      .pipe(map(toPlaceOrderResult));
  }

  verifyPayment(orderId: number): Observable<Order> {
    return this.api.post<OrderDto>(`/checkout/${orderId}/verify`).pipe(map(toOrder));
  }
}