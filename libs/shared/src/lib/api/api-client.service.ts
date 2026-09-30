// libs/shared/src/lib/api/api-client.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { API_BASE_URL } from './api.tokens';
import { ApiResponse } from './api-response.model';
import { ApiException } from './api-exception';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.request<T>('GET', path, undefined, params);
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.request<T>('DELETE', path);
  }

  private request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
  ): Observable<T> {
    const url = `${this.baseUrl}/api/v1${path}`;
    let httpParams = new HttpParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        httpParams = httpParams.set(key, String(value));
      }
    }

    return this.http.request<ApiResponse<T>>(method, url, { body, params: httpParams }).pipe(
        map((response) => {
        if (!response || !response.success) {
            const errors = response?.errors ?? [
            { code: 'EmptyResponse', message: 'The server returned an unexpected empty response.', type: 'Failure' },
            ];
            throw new ApiException(errors, 200);
        }
        return response.data as T;
        }),
      catchError((error: HttpErrorResponse) => {
        const body = error.error as ApiResponse<unknown> | null;
        const apiErrors = body?.errors ?? [
          { code: 'Unknown', message: error.message || 'An unexpected error occurred.', type: 'Failure' },
        ];
        return throwError(() => new ApiException(apiErrors, error.status));
      }),
    );
  }
}