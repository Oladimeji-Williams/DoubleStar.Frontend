// libs/shared/src/lib/auth/token-storage.service.ts
import { Injectable } from '@angular/core';
import { AuthResult } from './models/auth.models';

const STORAGE_KEY = 'doublestar.auth';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
}

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  save(result: AuthResult): void {
    const tokens: StoredTokens = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      accessTokenExpiresAtUtc: result.accessTokenExpiresAtUtc,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }

  getAccessToken(): string | null {
    return this.read()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    return this.read()?.refreshToken ?? null;
  }

  isAccessTokenExpired(): boolean {
    const tokens = this.read();
    if (!tokens) return true;
    return new Date(tokens.accessTokenExpiresAtUtc).getTime() <= Date.now();
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  private read(): StoredTokens | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredTokens) : null;
  }
}