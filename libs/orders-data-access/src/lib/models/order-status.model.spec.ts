// order-status.model.spec.ts
import { ORDER_STATUSES, ORDER_STATUS_LABELS, isPaidStatus } from './order-status.model';

describe('order status', () => {
  it('has a label for every status', () => {
    for (const status of ORDER_STATUSES) {
      expect(ORDER_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it('treats everything after payment as paid, and unpaid states as not paid', () => {
    expect(isPaidStatus('Paid')).toBe(true);
    expect(isPaidStatus('Completed')).toBe(true);
    expect(isPaidStatus('PendingPayment')).toBe(false);
    expect(isPaidStatus('Cancelled')).toBe(false);
    expect(isPaidStatus('Expired')).toBe(false);
  });
});