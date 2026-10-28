
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiClientService,
  DataTableQuery,
  PagedResult,
  buildDataTableQueryParams,
} from '@doublestar/shared';

import { Product } from './models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private readonly api = inject(ApiClientService);

  getAll(
    query: DataTableQuery,
    includeArchived = false,
  ): Observable<PagedResult<Product>> {
    return this.api.get<PagedResult<Product>>(
      '/products',
      {
        ...buildDataTableQueryParams(query),
        includeArchived,
      },
    );
  }

  search(term: string): Observable<Product[]> {
    return this.api.get<Product[]>(
      '/products/search',
      { term },
    );
  }

  getById(id: number): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }

  create(request: unknown): Observable<Product> {
    return this.api.post<Product>('/products', request);
  }

  update(
    id: number,
    request: unknown,
  ): Observable<void> {
    return this.api.put<void>(`/products/${id}`, request);
  }

  setPrice(
    id: number,
    unitPriceKobo: number,
  ): Observable<void> {
    return this.api.put<void>(
      `/products/${id}/price`,
      { unitPriceKobo },
    );
  }

  archive(id: number): Observable<void> {
    return this.api.post<void>(
      `/products/${id}/archive`,
      undefined,
    );
  }

  unarchive(id: number): Observable<void> {
    return this.api.post<void>(
      `/products/${id}/unarchive`,
      undefined,
    );
  }

  uploadImage(
    id: number,
    file: File,
  ): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file);

    return this.api.post<Product>(
      `/products/${id}/image`,
      formData,
    );
  }

  removeImage(id: number): Observable<Product> {
    return this.api.delete<Product>(
      `/products/${id}/image`,
    );
  }
}