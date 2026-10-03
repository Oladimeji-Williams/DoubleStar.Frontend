import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { ApiClientService } from '../api/api-client.service';
import { TokenStorageService } from './token-storage.service';
import { CurrentUserStore } from './current-user.store';

import {
  AuthResult,
  ChangePasswordRequest,
  LoginResponse,
  TwoFactorSetup,
  UpdateProfileRequest,
  UserProfile,
} from './models/auth.models';

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}
export interface RegisterCustomerRequest {
  email: string;
  password: string;
  turnstileToken: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly currentUserStore = inject(CurrentUserStore);

  loginWithTwoFactor(
    emailOrPhone: string,
    password: string,
    code: string,
  ): Observable<void> {
    return this.api
      .post<AuthResult>('/authentication/login/2fa', {
        emailOrPhone,
        password,
        code,
      })
      .pipe(
        tap((r) => this.applyAuthResult(r)),
        map(() => undefined),
      );
  }

  beginTwoFactorSetup(): Observable<TwoFactorSetup> {
    return this.api.post<TwoFactorSetup>(
      '/authentication/me/two-factor/setup',
      undefined,
    );
  }

  confirmTwoFactorSetup(code: string): Observable<void> {
    return this.api.post<void>(
      '/authentication/me/two-factor/confirm',
      { code },
    );
  }

  disableTwoFactor(currentPassword: string): Observable<void> {
    return this.api.post<void>(
      '/authentication/me/two-factor/disable',
      { currentPassword },
    );
  }

  registerCustomer(
    request: RegisterCustomerRequest,
  ): Observable<string> {
    return this.api.post<string>(
      '/authentication/register-customer',
      request,
    );
  }

  refresh(): Observable<AuthResult> {
    const refreshToken = this.tokenStorage.getRefreshToken();

    return this.api
      .post<AuthResult>('/authentication/refresh', { refreshToken })
      .pipe(tap((r) => this.applyAuthResult(r)));
  }

  getMyProfile(): Observable<UserProfile> {
    return this.api.get<UserProfile>('/authentication/me');
  }

  updateMyProfile(request: UpdateProfileRequest): Observable<void> {
    return this.api.put<void>('/authentication/me', request);
  }

  changePassword(request: ChangePasswordRequest): Observable<void> {
    return this.api.post<void>(
      '/authentication/change-password',
      request,
    );
  }

  /** Re-fetches the current user's profile and repopulates the store. */
  refreshCurrentUser(): Observable<void> {
    return this.getMyProfile().pipe(
      tap((profile) => this.applyProfile(profile)),
      map(() => undefined),
    );
  }

  /** Runs once at app startup. */
  restoreSession(): Observable<void> {
    if (!this.tokenStorage.getAccessToken()) {
      return of(undefined);
    }

    return this.refreshCurrentUser().pipe(
      catchError(() => {
        this.tokenStorage.clear();
        return of(undefined);
      }),
    );
  }

  logout(): void {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (refreshToken) {
      this.api
        .post('/authentication/revoke', { refreshToken })
        .subscribe({
          error: () => void 0,
        });
    }

    this.tokenStorage.clear();
    this.currentUserStore.clear();
  }

  private applyAuthResult(result: AuthResult): void {
    this.tokenStorage.save(result);
    this.currentUserStore.setFromAuthResult(result);
  }

  private applyProfile(profile: UserProfile): void {
    this.currentUserStore.setFromProfile({
      userId: profile.id,
      email: profile.email,
      phone: profile.phone,
      displayName: `${profile.firstName} ${profile.lastName}`.trim(),
      roles: profile.roles,
      avatarUrl: profile.avatarUrl,
    });
  }

  uploadAvatar(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post<string>(
      '/authentication/me/avatar',
      formData,
    );
  }

  removeAvatar(): Observable<void> {
    return this.api.delete<void>(
      '/authentication/me/avatar',
    );
  }

  requestEmailSignInCode(email: string): Observable<void> {
    return this.api.post<void>(
      '/authentication/login/email-code/request',
      { email },
    );
  }

  signInWithEmailCode(
    email: string,
    code: string,
  ): Observable<void> {
    return this.api
      .post<AuthResult>(
        '/authentication/login/email-code/verify',
        { email, code },
      )
      .pipe(
        tap((r) => this.applyAuthResult(r)),
        map(() => undefined),
      );
  }

  login(
    request: LoginRequest,
  ): Observable<{
    requiresTwoFactor: boolean;
    challengeToken: string | null;
  }> {
    return this.api
      .post<LoginResponse>(
        '/authentication/login',
        request,
      )
      .pipe(
        map((response) => {
          if (response.authResult) {
            this.applyAuthResult(response.authResult);
          }

          return {
            requiresTwoFactor: response.requiresTwoFactor,
            challengeToken: response.challengeToken,
          };
        }),
      );
  }

  verifyTwoFactorChallenge(
    challengeToken: string,
    code: string,
  ): Observable<void> {
    return this.api
      .post<AuthResult>(
        '/authentication/login/two-factor/verify',
        {
          challengeToken,
          code,
        },
      )
      .pipe(
        tap((r) => this.applyAuthResult(r)),
        map(() => undefined),
      );
  }

  signInWithEmailLink(token: string): Observable<void> {
    return this.api
      .post<AuthResult>(
        '/authentication/login/email-code/complete-link',
        { token },
      )
      .pipe(
        tap((r) => this.applyAuthResult(r)),
        map(() => undefined),
      );
  }

  requestPasswordReset(
    email: string,
    turnstileToken: string | null,
  ): Observable<void> {
    return this.api.post<void>(
      '/authentication/password-reset/request',
      {
        email,
        turnstileToken,
      },
    );
  }
  
  confirmPasswordReset(
    email: string,
    token: string,
    newPassword: string,
  ): Observable<void> {
    return this.api.post<void>(
      '/authentication/password-reset/confirm',
      {
        email,
        token,
        newPassword,
      },
    );
  }
}