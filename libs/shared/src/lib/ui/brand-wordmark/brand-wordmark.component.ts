// libs/shared/src/lib/ui/brand-wordmark/brand-wordmark.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-wordmark',
  standalone: true,
  templateUrl: './brand-wordmark.component.html',
  styleUrl: './brand-wordmark.component.scss',
})
export class BrandWordmarkComponent {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
}