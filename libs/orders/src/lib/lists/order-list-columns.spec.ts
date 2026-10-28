import { ORDER_STATUSES, OrderListItem } from '@doublestar/orders-data-access';
import { buildOrderColumns } from './order-list-columns';

const item: OrderListItem = {
  id: 7,
  orderNumber: 'DS-000007',
  status: 'ReadyForPickup',
  fulfillmentMethod: 'Pickup',
  totalKobo: 1250000,
  itemCount: 2,
  contactName: 'Ada',
  createdAt: new Date('2026-10-21T10:00:00Z'),
  needsAttention: true,
};

describe('buildOrderColumns', () => {
  it('shows customers only the columns that are theirs', () => {
    const keys = buildOrderColumns(false).map((column) => column.key);

    expect(keys).not.toContain('contactName');
    expect(keys).not.toContain('needsAttention');
  });

  it('adds customer and attention columns for staff', () => {
    const keys = buildOrderColumns(true).map((column) => column.key);

    expect(keys).toContain('contactName');
    expect(keys).toContain('needsAttention');
  });

  it('offers every order status as a filter option', () => {
    const status = buildOrderColumns(true).find((column) => column.key === 'status');

    expect(status?.filterConfig?.options?.map((option) => option.value)).toEqual([...ORDER_STATUSES]);
  });

  it('formats status and the order number for display', () => {
    const columns = buildOrderColumns(true);
    const format = (key: string) => columns.find((column) => column.key === key)?.format?.(item);

    expect(format('id')).toBe('DS-000007');
    expect(format('status')).toBe('Ready for pickup');
    expect(format('needsAttention')).toBe('Needs attention');
  });
});