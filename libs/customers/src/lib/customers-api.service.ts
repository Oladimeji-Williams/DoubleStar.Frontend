
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiClientService,
  DataTableFilter,
  DataTableQuery,
  PagedResult,
  buildDataTableQueryParams,
} from '@doublestar/shared';

import { Customer } from './models/customer.model';

export interface CustomerSearchRequest {
  term?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: DataTableFilter[];
}

export interface CreateWalkInCustomerRequest {
  name: string;
  phone: string | null;
  email: string | null;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  private readonly api = inject(ApiClientService);
  search(
    request: CustomerSearchRequest,
  ): Observable<PagedResult<Customer>> {
    const query: DataTableQuery = {
      page: request.page,
      pageSize: request.pageSize,
      sortBy: request.sortBy,
      sortDirection: request.sortDirection,
      filters: request.filters ?? [],
    };

    const params = {
      ...buildDataTableQueryParams(query),
      ...(request.term?.trim()
        ? { search: request.term.trim() }
        : {}),
    };

    return this.api.get<PagedResult<Customer>>(
      '/customers/search',
      params,
    );
  }


  getById(id: string): Observable<Customer> {
    return this.api.get<Customer>(`/customers/${id}`);
  }

  createWalkIn(
    request: CreateWalkInCustomerRequest,
  ): Observable<Customer> {
    return this.api.post<Customer>('/customers', request);
  }

  update(
    id: string,
    request: UpdateCustomerRequest,
  ): Observable<void> {
    return this.api.put<void>(`/customers/${id}`, request);
  }
}