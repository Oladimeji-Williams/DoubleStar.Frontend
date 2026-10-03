// apps/doublestar-marketing/src/app/marketing-layout/marketing-layout.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BrandLogoComponent, BrandWordmarkComponent } from '@doublestar/shared';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-marketing-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, BrandLogoComponent, BrandWordmarkComponent],
  templateUrl: './marketing-layout.component.html',
  styleUrl: './marketing-layout.component.scss',
})
export class MarketingLayoutComponent {
  protected readonly customerAppUrl = environment.customerAppUrl;
  protected readonly currentYear = new Date().getFullYear();
}