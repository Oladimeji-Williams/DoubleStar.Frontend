import { DataTableColumn } from '@doublestar/shared';
import { ORDER_STATUSES, ORDER_STATUS_LABELS, OrderListItem } from '@doublestar/orders-data-access';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' });
const dateTime = new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short' });

/** Columns for the order table. `forStaff` adds the customer and "needs attention" columns. */
export function buildOrderColumns(forStaff: boolean): DataTableColumn<OrderListItem>[] {
  const columns: DataTableColumn<OrderListItem>[] = [
    { key: 'id', label: 'Order', sortable: true, format: (order) => order.orderNumber },
    { key: 'createdAt', label: 'Placed', sortable: true, format: (order) => dateTime.format(order.createdAt) },
  ];

  if (forStaff) {
    columns.push({ key: 'contactName', label: 'Customer', sortable: true });
  }

  columns.push(
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterConfig: {
        operators: ['equals', 'notEquals'],
        options: ORDER_STATUSES.map((status) => ({ label: ORDER_STATUS_LABELS[status], value: status })),
      },
      format: (order) => ORDER_STATUS_LABELS[order.status],
    },
    {
      key: 'fulfillmentMethod',
      label: 'Fulfilment',
      format: (order) => (order.fulfillmentMethod === 'Pickup' ? 'Pickup' : 'Delivery'),
    },
    { key: 'itemCount', label: 'Items' },
    {
      key: 'totalKobo',
      label: 'Total',
      sortable: true,
      dataType: 'currency',
      format: (order) => naira.format(order.totalKobo / 100),
    },
  );

  if (forStaff) {
    columns.push({
      key: 'needsAttention',
      label: 'Attention',
      filterable: true,
      filterType: 'select',
      filterConfig: {
        operators: ['equals'],
        options: [
          { label: 'Needs attention', value: 'true' },
          { label: 'No issues', value: 'false' },
        ],
      },
      format: (order) => (order.needsAttention ? 'Needs attention' : '—'),
    });
  }

  return columns;
}