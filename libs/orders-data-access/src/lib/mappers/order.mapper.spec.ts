// order.mapper.spec.ts
import { OrderDto, PlaceOrderResultDto } from '../dto/orders.dto';
import { toOrder, toPagedResult, toPlaceOrderResult } from './order.mapper';
import { parseUtc } from './utc-date';

const orderDto: OrderDto = {
  id: 7,
  orderNumber: 'DS-000007',
  customerId: 'c-1',
  status: 'Paid',
  fulfillmentMethod: 'Pickup',
  subtotalKobo: 500000,
  deliveryFeeKobo: 0,
  totalKobo: 500000,
  contactName: 'Ada',
  contactPhone: '0800',
  deliveryAddress: null,
  deliveryCity: null,
  deliveryState: null,
  notes: null,
  createdAtUtc: '2026-10-21T10:00:00',
  paidAtUtc: '2026-10-21T10:05:00Z',
  expiresAtUtc: '2026-10-21T10:30:00Z',
  canPay: false,
  canCancel: false,
  needsAttention: false,
  attentionReason: null,
  nextStatuses: ['Processing'],
  lines: [
    {
      id: 1,
      productId: 3,
      productName: 'Phone',
      sku: 'PH-1',
      unitPriceKobo: 500000,
      quantity: 1,
      lineTotalKobo: 500000,
      serialNumbers: ['SN1'],
    },
  ],
  timeline: [{ from: 'PendingPayment', to: 'Paid', note: null, atUtc: '2026-10-21T10:05:00Z' }],
};

describe('parseUtc', () => {
  it('treats a timestamp without a zone as UTC', () => {
    expect(parseUtc('2026-10-21T10:00:00').toISOString()).toBe('2026-10-21T10:00:00.000Z');
  });

  it('keeps an explicit offset', () => {
    expect(parseUtc('2026-10-21T11:00:00+01:00').toISOString()).toBe('2026-10-21T10:00:00.000Z');
  });
});

describe('toOrder', () => {
  it('converts timestamps to Dates and keeps nulls', () => {
    const order = toOrder(orderDto);

    expect(order.createdAt.toISOString()).toBe('2026-10-21T10:00:00.000Z');
    expect(order.paidAt?.toISOString()).toBe('2026-10-21T10:05:00.000Z');
    expect(order.timeline[0].at).toBeInstanceOf(Date);
    expect(order.deliveryAddress).toBeNull();
    expect(order.lines[0].serialNumbers).toEqual(['SN1']);
  });

  it('maps a missing paidAt to null', () => {
    expect(toOrder({ ...orderDto, paidAtUtc: null }).paidAt).toBeNull();
  });
});

describe('toPlaceOrderResult', () => {
  it('turns the empty strings the API sends into null', () => {
    const dto: PlaceOrderResultDto = { order: orderDto, authorizationUrl: '', paymentReference: '' };

    const result = toPlaceOrderResult(dto);

    expect(result.authorizationUrl).toBeNull();
    expect(result.reference).toBeNull();
  });

  it('keeps a real payment url', () => {
    const dto: PlaceOrderResultDto = {
      order: orderDto,
      authorizationUrl: 'https://checkout.paystack.com/abc',
      paymentReference: 'ref-1',
    };

    expect(toPlaceOrderResult(dto).authorizationUrl).toBe('https://checkout.paystack.com/abc');
  });
});

describe('toPagedResult', () => {
  it('maps items and preserves paging metadata', () => {
    const result = toPagedResult(
      { items: [1, 2], page: 2, pageSize: 2, totalCount: 5, totalPages: 3 },
      (n) => n * 10,
    );

    expect(result).toEqual({ items: [10, 20], page: 2, pageSize: 2, totalCount: 5, totalPages: 3 });
  });
});