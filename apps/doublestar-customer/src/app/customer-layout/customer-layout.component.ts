// apps/doublestar-customer/src/app/customer-layout/customer-layout.component.ts — full replacement
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService, AvatarComponent, BrandLogoComponent, CurrentUserStore, IconComponent, BrandWordmarkComponent } from '@doublestar/shared';


@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent, BrandLogoComponent, AvatarComponent, BrandWordmarkComponent],
  templateUrl: './customer-layout.component.html',
  styleUrl: './customer-layout.component.scss',
})
export class CustomerLayoutComponent {
  protected readonly currentUserStore = inject(CurrentUserStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}