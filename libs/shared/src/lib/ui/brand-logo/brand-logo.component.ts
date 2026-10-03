// libs/shared/src/lib/ui/brand-logo/brand-logo.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  templateUrl: './brand-logo.component.html',
  styleUrl: './brand-logo.component.scss',
})
export class BrandLogoComponent {
  readonly size = input<number>(28);
}