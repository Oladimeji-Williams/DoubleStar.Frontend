// libs/shared/src/lib/ui/icon/icon.component.ts — MODIFIED: + cart, orders, menu, close, truck, store, check, user
import { Component, input } from '@angular/core';

export type IconName =
  | 'dashboard' | 'sales' | 'repairs' | 'customers' | 'catalog' | 'inventory'
  | 'payments' | 'notifications' | 'staff' | 'my-orders' | 'my-repairs'
  | 'profile' | 'logout'
  | 'screen' | 'battery' | 'charging-port' | 'water-damage'
  | 'phone-new' | 'phone-used' | 'accessories'
  | 'map-pin' | 'phone-call' | 'mail' | 'clock'
  | 'star' | 'star-outline' | 'chevron-down' | 'lock' | 'key' | 'filter'
  | 'search' | 'arrow-left'
  | 'cart' | 'orders' | 'menu' | 'close' | 'truck' | 'store' | 'check' | 'user';

@Component({
  selector: 'app-icon',
  standalone: true,
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input<number>(20);
}
