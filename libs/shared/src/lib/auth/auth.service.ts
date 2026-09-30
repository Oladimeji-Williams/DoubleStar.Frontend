// libs/shared/src/lib/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { TokenStorageService } from './token-storage.service';
import { CurrentUserStore } from './current-user.store';
import { AuthResult, UserProfile } from './models/auth.models';

export interface LoginRequest {
  emailOrPhone: string;
  password: string;
}

export interface RegisterCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiClientService);
  private readonly tokenStorage = inject(TokenStorageService);
  private readonly currentUserStore = inject(CurrentUserStore);

  login(request: LoginRequest): Observable<AuthResult> {
    return this.api.post<AuthResult>('/authentication/login', request).pipe(tap((r) => this.applyAuthResult(r)));
  }

  registerCustomer(request: RegisterCustomerRequest): Observable<string> {
    return this.api.post<string>('/authentication/register-customer', request);
  }

  refresh(): Observable<AuthResult> {
    const refreshToken = this.tokenStorage.getRefreshToken();
    return this.api
      .post<AuthResult>('/authentication/refresh', { refreshToken })
      .pipe(tap((r) => this.applyAuthResult(r)));
  }

  /**
   * Runs once at app startup. If tokens exist from a previous visit, asks the API
   * who they belong to and repopulates the in-memory user store. If the access token
   * has expired, the auth interceptor transparently refreshes it and retries this call.
   * Never errors: any failure just leaves the user logged out.
   */
  restoreSession(): Observable<void> {
    if (!this.tokenStorage.getAccessToken()) {
      return of(undefined);
    }

    return this.api.get<UserProfile>('/authentication/me').pipe(
      tap((profile) =>
        this.currentUserStore.setFromProfile({
          userId: profile.id,
          email: profile.email,
          phone: profile.phone,
          displayName: `${profile.firstName} ${profile.lastName}`.trim(),
          roles: profile.roles,
        }),
      ),
      map(() => undefined),
      catchError(() => {
        this.tokenStorage.clear();
        return of(undefined);
      }),
    );
  }

  logout(): void {
    const refreshToken = this.tokenStorage.getRefreshToken();
    if (refreshToken) {
      this.api.post('/authentication/revoke', { refreshToken }).subscribe({ error: () => void 0 });
    }
    this.tokenStorage.clear();
    this.currentUserStore.clear();
  }

  private applyAuthResult(result: AuthResult): void {
    this.tokenStorage.save(result);
    this.currentUserStore.setFromAuthResult(result);
  }
}