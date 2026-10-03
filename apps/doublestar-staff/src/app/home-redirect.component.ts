import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserStore } from '@doublestar/shared';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  template: '',
})
export class HomeRedirectComponent implements OnInit {
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const roles = this.currentUserStore.roles();

    const landingPath =
      roles.includes('Admin') || roles.includes('Manager')
        ? '/dashboard'
        : roles.includes('Cashier')
          ? '/sales'
          : roles.includes('Technician')
            ? '/repairs'
            : '/forbidden';

    this.router.navigateByUrl(landingPath, { replaceUrl: true });
  }
}