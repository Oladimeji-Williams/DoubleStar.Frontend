// libs/shared/src/lib/auth/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiClientService } from '../api/api-client.service';
import { TokenStorageService } from './token-storage.service';
import { CurrentUserStore } from './current-user.store';
import { AuthResult } from './models/auth.models';

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