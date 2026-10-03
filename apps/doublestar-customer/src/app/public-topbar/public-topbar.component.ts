// apps/doublestar-customer/src/app/public-topbar/public-topbar.component.ts
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BrandLogoComponent, BrandWordmarkComponent } from '@doublestar/shared';

@Component({
  selector: 'app-public-topbar',
  standalone: true,
  imports: [RouterLink, BrandLogoComponent, BrandWordmarkComponent],
  templateUrl: './public-topbar.component.html',
  styleUrl: './public-topbar.component.scss',
})
export class PublicTopbarComponent {
  readonly activePath = input<'products' | 'reviews'>('products');
}