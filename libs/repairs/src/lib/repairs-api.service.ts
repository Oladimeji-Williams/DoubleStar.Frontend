import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiClientService,
  DataTableQuery,
  PagedResult,
  buildDataTableQueryParams,
} from '@doublestar/shared';

import {
  RepairPart,
  RepairTicket,
} from './models/repair-ticket.model';

@Injectable({
  providedIn: 'root',
})
export class RepairsApiService {
  private readonly api = inject(ApiClientService);

  getAll(
    query: DataTableQuery,
  ): Observable<PagedResult<RepairTicket>> {
    return this.api.get<PagedResult<RepairTicket>>(
      '/repairtickets',
      buildDataTableQueryParams(query),
    );
  }


  getMine(
    query: DataTableQuery,
  ): Observable<PagedResult<RepairTicket>> {
    return this.api.get<PagedResult<RepairTicket>>(
      '/repairtickets/mine',
      buildDataTableQueryParams(query),
    );
  }


  getById(
    id: number,
  ): Observable<RepairTicket> {
    return this.api.get<RepairTicket>(
      `/repairtickets/${id}`,
    );
  }

  openRepairTicket(
    request: {
      customerId?: string | null;
      walkInName?: string | null;
      walkInPhone?: string | null;
      deviceDescription: string;
      imeiOrSerial?: string | null;
      faultDescription: string;
    },
  ): Observable<RepairTicket> {
    return this.api.post<RepairTicket>(
      '/repairtickets',
      request,
    );
  }

  startDiagnosis(
    id: number,
  ): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/start-diagnosis`,
      undefined,
    );
  }

  recordDiagnosis(
    id: number,
    request: {
      diagnosisNotes: string;
      quotedPriceKobo: number;
    },
  ): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/diagnosis`,
      request,
    );
  }

  approveQuote(
    id: number,
  ): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/approve-quote`,
      undefined,
    );
  }

  assignTechnician(
    id: number,
    technicianUserId: string,
  ): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/assign-technician`,
      {
        technicianUserId,
      },
    );
  }

  addPart(
    id: number,
    request: {
      productId: number;
      quantity: number;
    },
  ): Observable<RepairPart> {
    return this.api.post<RepairPart>(
      `/repairtickets/${id}/parts`,
      request,
    );
  }

  markReady(
    id: number,
  ): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/ready`,
      undefined,
    );
  }

  collectDevice(
    id: number,
  ): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/collect`,
      undefined,
    );
  }

  cancel(
    id: number,
  ): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/cancel`,
      undefined,
    );
  }

  open(
    request: {
      customerId?: string | null;
      walkInName?: string | null;
      walkInPhone?: string | null;
      deviceDescription: string;
      imeiOrSerial?: string | null;
      faultDescription: string;
    },
  ): Observable<RepairTicket> {
    return this.api.post<RepairTicket>(
      '/repairtickets',
      request,
    );
  }

  collect(id: number): Observable<void> {
    return this.api.post<void>(
      `/repairtickets/${id}/collect`,
      undefined,
    );
  }

  requestMyRepair(request: {
    deviceDescription: string;
    imeiOrSerial?: string | null;
    faultDescription: string;
  }): Observable<RepairTicket> {
    return this.api.post<RepairTicket>(
      '/repairtickets/me',
      request,
    );
  }
}