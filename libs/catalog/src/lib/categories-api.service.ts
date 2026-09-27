// libs/catalog/src/lib/categories-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { Category } from './models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<Category[]> {
    return this.api.get<Category[]>('/categories');
  }

  create(name: string): Observable<number> {
    return this.api.post<number>('/categories', { name });
  }
}