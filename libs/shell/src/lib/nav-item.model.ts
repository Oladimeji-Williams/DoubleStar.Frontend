// libs/shell/src/lib/nav-item.model.ts — full replacement
import { IconName, Role } from '@doublestar/shared';

export interface NavItem {
  label: string;
  path: string;
  roles: readonly Role[];
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', roles: ['Admin', 'Manager'], icon: 'dashboard' },
  { label: 'Sales', path: '/sales', roles: ['Admin', 'Manager', 'Cashier'], icon: 'sales' },
  { label: 'Repairs', path: '/repairs', roles: ['Admin', 'Manager', 'Cashier', 'Technician'], icon: 'repairs' },
  { label: 'Customers', path: '/customers', roles: ['Admin', 'Manager', 'Cashier'], icon: 'customers' },
  { label: 'Catalog', path: '/catalog', roles: ['Admin', 'Manager'], icon: 'catalog' },
  { label: 'Inventory', path: '/inventory', roles: ['Admin', 'Manager'], icon: 'inventory' },
  { label: 'Payments', path: '/payments', roles: ['Admin', 'Manager', 'Cashier'], icon: 'payments' },
  { label: 'Notifications', path: '/notifications', roles: ['Admin', 'Manager'], icon: 'notifications' },
  { label: 'Staff', path: '/staff', roles: ['Admin'], icon: 'staff' },
  { label: 'Reviews', path: '/reviews', roles: ['Admin', 'Manager'], icon: 'star' },
];