// libs/shared/src/lib/auth/auth.guard.ts — MODIFIED: remembers the attempted URL for post-login redirect
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserStore } from './current-user.store';
import { Role } from './models/auth.models';
import { rememberReturnUrl } from './return-url';

export const authGuard: CanActivateFn = (_route, state) => {
  const currentUserStore = inject(CurrentUserStore);
  const router = inject(Router);

  if (currentUserStore.isAuthenticated()) {
    return true;
  }

  rememberReturnUrl(state?.url);
  return router.createUrlTree(['/login']);
};

export function requireRoles(...roles: Role[]): CanActivateFn {
  return (_route, state) => {
    const currentUserStore = inject(CurrentUserStore);
    const router = inject(Router);

    if (!currentUserStore.isAuthenticated()) {
      rememberReturnUrl(state?.url);
      return router.createUrlTree(['/login']);
    }
    return currentUserStore.hasAnyRole(roles) ? true : router.createUrlTree(['/forbidden']);
  };
}
