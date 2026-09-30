// libs/shell/src/lib/nav-item.model.ts — full replacement (the two Customer-only entries removed)
import { Role } from '@doublestar/shared';

export interface NavItem {
  label: string;
  path: string;
  roles: readonly Role[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Manager'] },
  { label: 'Sales', path: '/sales', roles: ['Admin', 'Manager', 'Cashier'] },
  { label: 'Repairs', path: '/repairs', roles: ['Admin', 'Manager', 'Cashier', 'Technician'] },
  { label: 'Customers', path: '/customers', roles: ['Admin', 'Manager', 'Cashier'] },
  { label: 'Catalog', path: '/catalog', roles: ['Admin', 'Manager'] },
  { label: 'Inventory', path: '/inventory', roles: ['Admin', 'Manager'] },
  { label: 'Payments', path: '/payments', roles: ['Admin', 'Manager', 'Cashier'] },
  { label: 'Notifications', path: '/notifications', roles: ['Admin', 'Manager'] },
  { label: 'Staff', path: '/staff', roles: ['Admin'] },
];