// apps/doublestar-marketing/src/app/layout/marketing-layout.component.ts — REPLACE
// Same SiteHeaderComponent as the storefront. Cross-app links are absolute (the apps are separate origins).
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent, SiteNavItem } from '@doublestar/shared';

// Point this at your environment config / injection token for the customer app origin.
const CUSTOMER_APP_URL = 'https://shop.doublestar.example';

@Component({
  selector: 'app-marketing-layout',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent],
  templateUrl: './marketing-layout.component.html',
  styleUrl: './marketing-layout.component.scss',
})
export class MarketingLayoutComponent {
  protected readonly navItems: SiteNavItem[] = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Services', path: '/services' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
    { label: 'Shop', path: `${CUSTOMER_APP_URL}/products`, external: true },
    { label: 'Reviews', path: `${CUSTOMER_APP_URL}/reviews`, external: true },
  ];

  protected readonly homeLink: SiteNavItem = { label: 'Home', path: '/' };
  protected readonly cartLink: SiteNavItem = { label: 'Cart', path: `${CUSTOMER_APP_URL}/cart`, external: true };
  protected readonly signInLink: SiteNavItem = { label: 'Sign in', path: `${CUSTOMER_APP_URL}/login`, external: true };
  protected readonly registerLink: SiteNavItem = { label: 'Create account', path: `${CUSTOMER_APP_URL}/register`, external: true };
}
