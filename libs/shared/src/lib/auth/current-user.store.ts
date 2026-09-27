// libs/shared/src/lib/auth/current-user.store.ts
import { Injectable, computed, signal } from '@angular/core';
import { AuthResult, CurrentUser, Role } from './models/auth.models';

@Injectable({ providedIn: 'root' })
export class CurrentUserStore {
  private readonly _currentUser = signal<CurrentUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly roles = computed<Role[]>(() => this._currentUser()?.roles ?? []);
  readonly isCustomer = computed(() => this.roles().includes('Customer'));
  readonly isStaff = computed(() => this.roles().some((r) => r !== 'Customer'));

  setFromAuthResult(result: AuthResult): void {
    this._currentUser.set({
      userId: result.userId,
      email: result.email,
      phone: result.phone,
      displayName: result.displayName,
      roles: result.roles,
    });
  }

  setFromProfile(profile: CurrentUser): void {
    this._currentUser.set(profile);
  }

  clear(): void {
    this._currentUser.set(null);
  }

  hasAnyRole(allowed: readonly Role[]): boolean {
    const roles = this.roles();
    return allowed.some((r) => roles.includes(r));
  }
}