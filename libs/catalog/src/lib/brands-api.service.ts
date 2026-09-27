// libs/catalog/src/lib/brands-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { Brand } from './models/brand.model';

@Injectable({ providedIn: 'root' })
export class BrandsApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<Brand[]> {
    return this.api.get<Brand[]>('/brands');
  }

  create(name: string): Observable<number> {
    return this.api.post<number>('/brands', { name });
  }
}