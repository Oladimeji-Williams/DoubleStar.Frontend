// libs/shared/src/lib/auth/auth.guard.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard, requireRoles } from './auth.guard';
import { CurrentUserStore } from './current-user.store';

describe('authGuard', () => {
  let currentUserStore: CurrentUserStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    currentUserStore = TestBed.inject(CurrentUserStore);
    router = TestBed.inject(Router);
  });

  it('allows navigation when authenticated', () => {
    currentUserStore.setFromProfile({ userId: '1', email: null, phone: null, displayName: 'X', roles: ['Admin'] });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to /login when not authenticated', () => {
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });
});

describe('requireRoles', () => {
  let currentUserStore: CurrentUserStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    currentUserStore = TestBed.inject(CurrentUserStore);
    router = TestBed.inject(Router);
  });

  it('redirects to /login when not authenticated', () => {
    const result = TestBed.runInInjectionContext(() => requireRoles('Admin')({} as any, {} as any));
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('redirects to /forbidden when authenticated but missing the role', () => {
    currentUserStore.setFromProfile({ userId: '1', email: null, phone: null, displayName: 'X', roles: ['Cashier'] });
    const result = TestBed.runInInjectionContext(() => requireRoles('Admin', 'Manager')({} as any, {} as any));
    expect(router.serializeUrl(result as UrlTree)).toBe('/forbidden');
  });

  it('allows navigation when the user has one of the required roles', () => {
    currentUserStore.setFromProfile({ userId: '1', email: null, phone: null, displayName: 'X', roles: ['Cashier'] });
    const result = TestBed.runInInjectionContext(() => requireRoles('Admin', 'Cashier')({} as any, {} as any));
    expect(result).toBe(true);
  });
});