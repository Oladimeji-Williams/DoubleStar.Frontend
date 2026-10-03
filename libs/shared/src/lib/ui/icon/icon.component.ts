// libs/shared/src/lib/ui/icon/icon.component.ts — full replacement
import { Component, input } from '@angular/core';

export type IconName =
  | 'dashboard' | 'sales' | 'repairs' | 'customers' | 'catalog' | 'inventory'
  | 'payments' | 'notifications' | 'staff' | 'my-orders' | 'my-repairs'
  | 'profile' | 'logout'
  | 'screen' | 'battery' | 'charging-port' | 'water-damage'
  | 'phone-new' | 'phone-used' | 'accessories'
  | 'map-pin' | 'phone-call' | 'mail' | 'clock'
  | 'star' | 'star-outline' | 'chevron-down' | 'lock' | 'key';

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