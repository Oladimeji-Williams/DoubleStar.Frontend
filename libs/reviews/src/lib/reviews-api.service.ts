
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiClientService,
  DataTableQuery,
  PagedResult,
  buildDataTableQueryParams,
} from '@doublestar/shared';

import { Review } from './models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewsApiService {
  private readonly api = inject(ApiClientService);

  getApproved(): Observable<Review[]> {
    return this.api.get<Review[]>('/reviews');
  }

  getPending(
    query: DataTableQuery,
  ): Observable<PagedResult<Review>> {
    return this.api.get<PagedResult<Review>>(
      '/reviews/pending',
      buildDataTableQueryParams(query),
    );
  }

  getAll(
    query: DataTableQuery,
  ): Observable<PagedResult<Review>> {
    return this.api.get<PagedResult<Review>>(
      '/reviews/all',
      buildDataTableQueryParams(query),
    );
  }

  submit(
    rating: number,
    comment: string,
  ): Observable<Review> {
    return this.api.post<Review>(
      '/reviews',
      { rating, comment },
    );
  }

  approve(id: string): Observable<void> {
    return this.api.post<void>(
      `/reviews/${id}/approve`,
      undefined,
    );
  }

  reject(id: string): Observable<void> {
    return this.api.post<void>(
      `/reviews/${id}/reject`,
      undefined,
    );
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`/reviews/${id}`);
  }
}