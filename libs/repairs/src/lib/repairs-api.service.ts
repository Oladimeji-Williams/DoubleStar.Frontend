// libs/repairs/src/lib/repairs-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { RepairPart, RepairTicket } from './models/repair-ticket.model';

export interface OpenRepairTicketRequest {
  customerId: string | null;
  walkInName: string | null;
  walkInPhone: string | null;
  deviceDescription: string;
  imeiOrSerial: string | null;
  faultDescription: string;
}

export interface RecordDiagnosisRequest {
  diagnosisNotes: string;
  quotedPriceKobo: number;
}

export interface AddPartUsedRequest {
  productId: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class RepairsApiService {
  private readonly api = inject(ApiClientService);

  getAll(): Observable<RepairTicket[]> {
    return this.api.get<RepairTicket[]>('/repairtickets');
  }

  getById(id: number): Observable<RepairTicket> {
    return this.api.get<RepairTicket>(`/repairtickets/${id}`);
  }

  open(request: OpenRepairTicketRequest): Observable<RepairTicket> {
    return this.api.post<RepairTicket>('/repairtickets', request);
  }

  recordDiagnosis(id: number, request: RecordDiagnosisRequest): Observable<void> {
    return this.api.post<void>(`/repairtickets/${id}/diagnosis`, request);
  }

  approveQuote(id: number): Observable<void> {
    return this.api.post<void>(`/repairtickets/${id}/approve-quote`, undefined);
  }

  addPart(id: number, request: AddPartUsedRequest): Observable<RepairPart> {
    return this.api.post<RepairPart>(`/repairtickets/${id}/parts`, request);
  }

  markReady(id: number): Observable<void> {
    return this.api.post<void>(`/repairtickets/${id}/ready`, undefined);
  }

  collect(id: number): Observable<void> {
    return this.api.post<void>(`/repairtickets/${id}/collect`, undefined);
  }

  cancel(id: number): Observable<void> {
    return this.api.post<void>(`/repairtickets/${id}/cancel`, undefined);
  }
    getMine(): Observable<RepairTicket[]> {
    return this.api.get<RepairTicket[]>('/repairtickets/me');
    }

    startDiagnosis(id: number): Observable<void> {
    return this.api.post<void>(`/repairtickets/${id}/start-diagnosis`, undefined);
    }
}