// libs/catalog/src/lib/products-api.service.ts — full replacement (adds create/setPrice/archive to what was already there)
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { Product, StockTrackingMode } from './models/product.model';
import { PagedResult } from '@doublestar/shared';

export interface CreateProductRequest {
  name: string;
  sku: string;
  description: string | null;
  categoryId: number | null;
  brandId: number | null;
  unitPriceKobo: number;
  trackingMode: StockTrackingMode;
}

export interface UpdateProductRequest {
  name: string;
  description: string | null;
  categoryId: number | null;
  brandId: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<Product[]> {
    return this.api.get<Product[]>('/products');
  }

  search(term: string): Observable<Product[]> {
    return this.api.get<Product[]>('/products/search', { term });
  }

  getById(id: number): Observable<Product> {
    return this.api.get<Product>(`/products/${id}`);
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.api.post<Product>('/products', request);
  }

  setPrice(id: number, unitPriceKobo: number): Observable<void> {
    return this.api.put<void>(`/products/${id}/price`, { unitPriceKobo });
  }

  archive(id: number): Observable<void> {
    return this.api.post<void>(`/products/${id}/archive`, undefined);
  }

  update(id: number, request: UpdateProductRequest): Observable<void> {
    return this.api.put<void>(`/products/${id}`, request);
  }
  
  getArchived(): Observable<Product[]> {
    return this.api.get<Product[]>('/products/archived');
  }

  unarchive(id: number): Observable<void> {
    return this.api.post<void>(`/products/${id}/unarchive`, undefined);
  }
  uploadImage(id: number, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<Product>(`/products/${id}/image`, formData);
  }

  removeImage(id: number): Observable<Product> {
    return this.api.delete<Product>(`/products/${id}/image`);
  }

  getPaged(page: number, pageSize: number): Observable<PagedResult<Product>> {
    return this.api.get<PagedResult<Product>>('/products/paged', { page, pageSize });
  }
}