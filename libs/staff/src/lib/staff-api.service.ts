// libs/staff/src/lib/staff-api.service.ts — full replacement
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { StaffMember } from './models/staff.model';

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Technician';
}

export interface UpdateStaffRequest {
  firstName: string;
  lastName: string;
  role: 'Admin' | 'Manager' | 'Cashier' | 'Technician';
}

@Injectable({ providedIn: 'root' })
export class StaffApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<StaffMember[]> {
    return this.api.get<StaffMember[]>('/staff');
  }

  create(request: CreateStaffRequest): Observable<string> {
    return this.api.post<string>('/staff', request);
  }

  update(id: string, request: UpdateStaffRequest): Observable<void> {
    return this.api.put<void>(`/staff/${id}`, request);
  }

  deactivate(id: string): Observable<void> {
    return this.api.post<void>(`/staff/${id}/deactivate`, undefined);
  }

  reactivate(id: string): Observable<void> {
    return this.api.post<void>(`/staff/${id}/reactivate`, undefined);
  }
}