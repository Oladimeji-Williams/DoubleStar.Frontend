import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { AuthResult } from './models/auth.models';

const STORAGE_KEY = 'doublestar.auth';

interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
}

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  save(result: AuthResult): void {
    if (!this.isBrowser) {
      return;
    }

    const tokens: StoredTokens = {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      accessTokenExpiresAtUtc: result.accessTokenExpiresAtUtc,
    };

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tokens),
    );
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    return this.read()?.accessToken ?? null;
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    return this.read()?.refreshToken ?? null;
  }

  isAccessTokenExpired(): boolean {
    if (!this.isBrowser) {
      return true;
    }

    const tokens = this.read();

    if (!tokens) {
      return true;
    }

    return (
      new Date(tokens.accessTokenExpiresAtUtc).getTime() <=
      Date.now()
    );
  }

  clear(): void {
    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  }

  private read(): StoredTokens | null {
    if (!this.isBrowser) {
      return null;
    }

    const raw = localStorage.getItem(STORAGE_KEY);

    return raw
      ? (JSON.parse(raw) as StoredTokens)
      : null;
  }
}