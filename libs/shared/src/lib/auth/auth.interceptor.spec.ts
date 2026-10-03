// libs/shared/src/lib/auth/auth.interceptor.spec.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { TokenStorageService } from './token-storage.service';
import { API_BASE_URL } from '../api/api.tokens';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let tokenStorage: TokenStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: '' },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(TokenStorageService);
    tokenStorage.clear();
  });

  afterEach(() => httpMock.verify());

  it('attaches the Authorization header when an access token exists', () => {
    tokenStorage.save({
      accessToken: 'abc123', refreshToken: 'r', accessTokenExpiresAtUtc: '', refreshTokenExpiresAtUtc: '',
      userId: '1', email: null, phone: null, displayName: '', roles: [],
    });

    httpClient.get('/api/v1/customers').subscribe();

    const req = httpMock.expectOne('/api/v1/customers');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('does not attach a header to the login request even if a token exists', () => {
    tokenStorage.save({
      accessToken: 'abc123', refreshToken: 'r', accessTokenExpiresAtUtc: '', refreshTokenExpiresAtUtc: '',
      userId: '1', email: null, phone: null, displayName: '', roles: [],
    });

    httpClient.post('/api/v1/authentication/login', {}).subscribe();

    const req = httpMock.expectOne('/api/v1/authentication/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('on a 401, refreshes the token once and retries the original request', () => {
    tokenStorage.save({
      accessToken: 'expired', refreshToken: 'refresh-token', accessTokenExpiresAtUtc: '', refreshTokenExpiresAtUtc: '',
      userId: '1', email: null, phone: null, displayName: '', roles: [],
    });

    let result: unknown;
    httpClient.get('/api/v1/customers').subscribe((r) => (result = r));

    const firstAttempt = httpMock.expectOne('/api/v1/customers');
    firstAttempt.flush({ message: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    const refreshRequest = httpMock.expectOne('/api/v1/authentication/refresh');
    refreshRequest.flush({
      success: true, errors: null,
      data: {
        accessToken: 'new-token', refreshToken: 'new-refresh', accessTokenExpiresAtUtc: '', refreshTokenExpiresAtUtc: '',
        userId: '1', email: null, phone: null, displayName: '', roles: [],
      },
    });

    const retriedRequest = httpMock.expectOne('/api/v1/customers');
    expect(retriedRequest.request.headers.get('Authorization')).toBe('Bearer new-token');
    retriedRequest.flush({ success: true, data: [], errors: null });

    expect(result).toEqual([]);
  });
});