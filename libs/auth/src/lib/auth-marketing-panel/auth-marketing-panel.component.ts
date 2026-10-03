// libs/auth/src/lib/auth-marketing-panel/auth-marketing-panel.component.ts
import { Component, input } from '@angular/core';
import { IconComponent, IconName } from '@doublestar/shared';

interface Highlight { icon: IconName; text: string; }

@Component({
  selector: 'app-auth-marketing-panel',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './auth-marketing-panel.component.html',
  styleUrl: './auth-marketing-panel.component.scss',
})
export class AuthMarketingPanelComponent {
  readonly heading = input.required<string>();
  readonly subtitle = input.required<string>();

  protected readonly highlights: Highlight[] = [
    { icon: 'phone-new', text: 'New & quality-tested used phones' },
    { icon: 'screen', text: 'Screen, battery & charging-port repair' },
    { icon: 'my-repairs', text: 'Track every repair in real time' },
    { icon: 'accessories', text: 'Chargers, cases & accessories' },
  ];
}