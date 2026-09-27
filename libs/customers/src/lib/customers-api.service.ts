// libs/customers/src/lib/customers-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { Customer } from './models/customer.model';

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

@Injectable({ providedIn: 'root' })
export class CustomersApiService {
  private readonly api = inject(ApiClientService);

  search(term: string): Observable<Customer[]> {
    return this.api.get<Customer[]>('/customers/search', { term });
  }

  getById(id: string): Observable<Customer> {
    return this.api.get<Customer>(`/customers/${id}`);
  }

  createWalkIn(request: CreateWalkInCustomerRequest): Observable<Customer> {
    return this.api.post<Customer>('/customers', request);
  }

  update(id: string, request: UpdateCustomerRequest): Observable<void> {
    return this.api.put<void>(`/customers/${id}`, request);
  }
}