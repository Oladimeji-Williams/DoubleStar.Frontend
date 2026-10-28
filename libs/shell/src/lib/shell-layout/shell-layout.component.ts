
import {
  Component,
  PLATFORM_ID,
  computed,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Location,
} from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import {
  AuthService,
  AvatarComponent,
  BrandLogoComponent,
  CurrentUserStore,
  IconComponent,
  BrandWordmarkComponent,
} from '@doublestar/shared';

import { NAV_ITEMS } from '../nav-item.model';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    IconComponent,
    BrandLogoComponent,
    AvatarComponent,
    BrandWordmarkComponent,
  ],
  templateUrl: './shell-layout.component.html',
  styleUrl: './shell-layout.component.scss',
})
export class ShellLayoutComponent {
  protected readonly currentUserStore =
    inject(CurrentUserStore);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly location =
    inject(Location);

  private readonly platformId =
    inject(PLATFORM_ID);

  protected readonly visibleNavItems = computed(() =>
    NAV_ITEMS.filter((item) =>
      this.currentUserStore.hasAnyRole(item.roles),
    ),
  );

  protected goBack(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      window.history.length > 1
    ) {
      this.location.back();
      return;
    }

    // Safe fallback when a page is opened directly.
    void this.router.navigateByUrl('/dashboard');
  }

  protected logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/login');
  }
}