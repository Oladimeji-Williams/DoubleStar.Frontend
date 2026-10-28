import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import {
  Observable,
  catchError,
  map,
  throwError,
} from 'rxjs';

import { API_BASE_URL } from './api.tokens';
import { ApiResponse } from './api-response.model';
import { ApiException } from './api-exception';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  get<T>(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): Observable<T> {
    return this.request<T>('GET', path, undefined, params);
  }

  post<T>(
    path: string,
    body?: unknown,
  ): Observable<T> {
    return this.request<T>('POST', path, body);
  }

  put<T>(
    path: string,
    body?: unknown,
  ): Observable<T> {
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
    const url = `${this.baseUrl}${path}`;

    let httpParams = new HttpParams();

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        httpParams = httpParams.set(key, String(value));
      }
    }

    return this.http
      .request<ApiResponse<T>>(method, url, {
        body,
        params: httpParams,
        observe: 'response',
      })
      .pipe(
        map((httpResponse: HttpResponse<ApiResponse<T>>) => {
          /*
           * 204 No Content is a successful response.
           *
           * This is used by endpoints such as:
           * - approve review
           * - reject review
           * - delete review
           */
          if (httpResponse.status === 204) {
            return undefined as T;
          }

          const response = httpResponse.body;

          if (!response) {
            throw new ApiException(
              [
                {
                  code: 'EmptyResponse',
                  message:
                    'The server returned an empty response.',
                  type: 'Failure',
                },
              ],
              httpResponse.status,
            );
          }

          if (!response.success) {
            throw new ApiException(
              response.errors ?? [
                {
                  code: 'Unknown',
                  message:
                    'The server returned an unsuccessful response.',
                  type: 'Failure',
                },
              ],
              httpResponse.status,
            );
          }

          return response.data as T;
        }),

        catchError((error: unknown) => {
          /*
           * Preserve ApiException instances created above.
           */
          if (error instanceof ApiException) {
            return throwError(() => error);
          }

          /*
           * Handle actual HTTP errors such as 400, 401, 403,
           * 404, 409, 500, etc.
           */
          if (error instanceof HttpErrorResponse) {
            const body =
              error.error as ApiResponse<unknown> | null;

            const apiErrors = body?.errors ?? [
              {
                code: 'Unknown',
                message:
                  error.message ||
                  'An unexpected error occurred.',
                type: 'Failure',
              },
            ];

            return throwError(
              () =>
                new ApiException(
                  apiErrors,
                  error.status,
                ),
            );
          }

          /*
           * Handle any other unexpected error.
           */
          return throwError(
            () =>
              new ApiException(
                [
                  {
                    code: 'Unknown',
                    message:
                      error instanceof Error
                        ? error.message
                        : 'An unexpected error occurred.',
                    type: 'Failure',
                  },
                ],
                0,
              ),
          );
        }),
      );
  }
}