
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ApiClientService,
  DataTableQuery,
  PagedResult,
  buildDataTableQueryParams,
} from '@doublestar/shared';

import { NotificationLogEntry } from './models/notification-log.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationsApiService {
  private readonly api = inject(ApiClientService);

  getLog(
    query: DataTableQuery,
  ): Observable<PagedResult<NotificationLogEntry>> {
    return this.api.get<PagedResult<NotificationLogEntry>>(
      '/notifications/log',
      buildDataTableQueryParams(query),
    );
  }
}