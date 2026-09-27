// libs/shared/src/lib/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserStore } from './current-user.store';
import { Role } from './models/auth.models';

export const authGuard: CanActivateFn = () => {
  const currentUserStore = inject(CurrentUserStore);
  const router = inject(Router);

  return currentUserStore.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

export function requireRoles(...roles: Role[]): CanActivateFn {
  return () => {
    const currentUserStore = inject(CurrentUserStore);
    const router = inject(Router);

    if (!currentUserStore.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }
    return currentUserStore.hasAnyRole(roles) ? true : router.createUrlTree(['/forbidden']);
  };
}