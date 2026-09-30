// libs/shared/src/lib/auth/current-user.store.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CurrentUserStore } from './current-user.store';
import { AuthResult } from './models/auth.models';

describe('CurrentUserStore', () => {
  let store: CurrentUserStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CurrentUserStore);
  });

  it('starts unauthenticated', () => {
    expect(store.isAuthenticated()).toBe(false);
    expect(store.currentUser()).toBeNull();
  });

  it('becomes authenticated after setFromAuthResult', () => {
    const result: AuthResult = {
      accessToken: 't', refreshToken: 'r', accessTokenExpiresAtUtc: '', refreshTokenExpiresAtUtc: '',
      userId: '1', email: 'a@b.com', phone: null, displayName: 'Ada', roles: ['Cashier'],
    };
    store.setFromAuthResult(result);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.currentUser()?.displayName).toBe('Ada');
    expect(store.roles()).toEqual(['Cashier']);
  });

  it('isCustomer / isStaff reflect roles correctly', () => {
    store.setFromProfile({ userId: '1', email: null, phone: null, displayName: 'Cust', roles: ['Customer'] });
    expect(store.isCustomer()).toBe(true);
    expect(store.isStaff()).toBe(false);

    store.setFromProfile({ userId: '2', email: null, phone: null, displayName: 'Staff', roles: ['Manager'] });
    expect(store.isCustomer()).toBe(false);
    expect(store.isStaff()).toBe(true);
  });

  it('hasAnyRole matches intersecting roles only', () => {
    store.setFromProfile({ userId: '1', email: null, phone: null, displayName: 'X', roles: ['Cashier'] });
    expect(store.hasAnyRole(['Admin', 'Cashier'])).toBe(true);
    expect(store.hasAnyRole(['Admin', 'Manager'])).toBe(false);
  });

  it('clear() resets to unauthenticated', () => {
    store.setFromProfile({ userId: '1', email: null, phone: null, displayName: 'X', roles: ['Admin'] });
    store.clear();
    expect(store.isAuthenticated()).toBe(false);
  });
});