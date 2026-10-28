import { PagedResult } from '@doublestar/shared';
import {
  OrderDto,
  OrderLineDto,
  OrderListDto,
  OrderTimelineEntryDto,
  PaymentInitiationResultDto,
  PlaceOrderRequestDto,
  PlaceOrderResultDto,
} from '../dto/orders.dto';
import {
  Order,
  OrderLine,
  OrderListItem,
  OrderTimelineEntry,
  PaymentInitiation,
  PlaceOrderRequest,
  PlaceOrderResult,
} from '../models/order.model';
import { parseUtc, parseUtcOrNull } from './utc-date';

export function toOrderLine(dto: OrderLineDto): OrderLine {
  return {
    id: dto.id,
    productId: dto.productId,
    productName: dto.productName,
    sku: dto.sku,
    unitPriceKobo: dto.unitPriceKobo,
    quantity: dto.quantity,
    lineTotalKobo: dto.lineTotalKobo,
    serialNumbers: [...dto.serialNumbers],
  };
}

export function toTimelineEntry(dto: OrderTimelineEntryDto): OrderTimelineEntry {
  return { from: dto.from, to: dto.to, note: dto.note, at: parseUtc(dto.atUtc) };
}

export function toOrder(dto: OrderDto): Order {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    customerId: dto.customerId,
    status: dto.status,
    fulfillmentMethod: dto.fulfillmentMethod,
    subtotalKobo: dto.subtotalKobo,
    deliveryFeeKobo: dto.deliveryFeeKobo,
    totalKobo: dto.totalKobo,
    contactName: dto.contactName,
    contactPhone: dto.contactPhone,
    deliveryAddress: dto.deliveryAddress,
    deliveryCity: dto.deliveryCity,
    deliveryState: dto.deliveryState,
    notes: dto.notes,
    createdAt: parseUtc(dto.createdAtUtc),
    paidAt: parseUtcOrNull(dto.paidAtUtc),
    expiresAt: parseUtc(dto.expiresAtUtc),
    canPay: dto.canPay,
    canCancel: dto.canCancel,
    needsAttention: dto.needsAttention,
    attentionReason: dto.attentionReason,
    nextStatuses: [...dto.nextStatuses],
    lines: dto.lines.map(toOrderLine),
    timeline: dto.timeline.map(toTimelineEntry),
  };
}

export function toOrderListItem(dto: OrderListDto): OrderListItem {
  return {
    id: dto.id,
    orderNumber: dto.orderNumber,
    status: dto.status,
    fulfillmentMethod: dto.fulfillmentMethod,
    totalKobo: dto.totalKobo,
    itemCount: dto.itemCount,
    contactName: dto.contactName,
    createdAt: parseUtc(dto.createdAtUtc),
    needsAttention: dto.needsAttention,
  };
}

/** The API returns an empty string when there is nothing to pay; the model uses `null` for that. */
function blankToNull(value: string): string | null {
  return value.trim().length === 0 ? null : value;
}

export function toPaymentInitiation(dto: PaymentInitiationResultDto): PaymentInitiation {
  return {
    authorizationUrl: blankToNull(dto.authorizationUrl),
    reference: blankToNull(dto.paymentReference),
  };
}

export function toPlaceOrderResult(dto: PlaceOrderResultDto): PlaceOrderResult {
  return {
    order: toOrder(dto.order),
    authorizationUrl: blankToNull(dto.authorizationUrl),
    reference: blankToNull(dto.paymentReference),
  };
}

export function toPlaceOrderRequestDto(request: PlaceOrderRequest): PlaceOrderRequestDto {
  return {
    fulfillmentMethod: request.fulfillmentMethod,
    contactName: request.contactName,
    contactPhone: request.contactPhone,
    deliveryAddress: request.deliveryAddress,
    deliveryCity: request.deliveryCity,
    deliveryState: request.deliveryState,
    notes: request.notes,
    idempotencyKey: request.idempotencyKey,
  };
}

export function toPagedResult<TDto, TModel>(
  page: PagedResult<TDto>,
  map: (dto: TDto) => TModel,
): PagedResult<TModel> {
  return {
    items: page.items.map(map),
    page: page.page,
    pageSize: page.pageSize,
    totalCount: page.totalCount,
    totalPages: page.totalPages,
  };
}