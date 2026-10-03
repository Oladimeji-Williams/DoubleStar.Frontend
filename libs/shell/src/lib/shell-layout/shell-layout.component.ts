// libs/shell/src/lib/shell-layout/shell-layout.component.ts — full replacement
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, AvatarComponent, BrandLogoComponent, CurrentUserStore, IconComponent, BrandWordmarkComponent } from '@doublestar/shared';
import { NAV_ITEMS } from '../nav-item.model';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent, BrandLogoComponent, AvatarComponent, BrandWordmarkComponent],
  templateUrl: './shell-layout.component.html',
  styleUrl: './shell-layout.component.scss',
})
export class ShellLayoutComponent {
  protected readonly currentUserStore = inject(CurrentUserStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly visibleNavItems = computed(() =>
    NAV_ITEMS.filter((item) => this.currentUserStore.hasAnyRole(item.roles)),
  );

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}