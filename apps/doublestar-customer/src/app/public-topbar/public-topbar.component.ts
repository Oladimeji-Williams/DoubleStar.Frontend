
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import {
  AuthService,
  BrandLogoComponent,
  BrandWordmarkComponent,
  CurrentUserStore,
} from '@doublestar/shared';

@Component({
  selector: 'app-public-topbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    BrandLogoComponent,
    BrandWordmarkComponent,
  ],
  templateUrl: './public-topbar.component.html',
  styleUrl: './public-topbar.component.scss',
})
export class PublicTopbarComponent {
  protected readonly currentUserStore = inject(CurrentUserStore);

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
