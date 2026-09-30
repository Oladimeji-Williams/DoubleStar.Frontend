// apps/doublestar/src/app/home-redirect.component.ts — full replacement
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserStore } from '@doublestar/shared';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  template: '',
})
export class HomeRedirectComponent {
  constructor() {
    const currentUserStore = inject(CurrentUserStore);
    const router = inject(Router);
    const roles = currentUserStore.roles();

    const landingPath =
      roles.includes('Admin') || roles.includes('Manager') ? '/dashboard'
      : roles.includes('Cashier') ? '/sales'
      : roles.includes('Technician') ? '/repairs'
      : '/forbidden';

    router.navigateByUrl(landingPath);
  }
}