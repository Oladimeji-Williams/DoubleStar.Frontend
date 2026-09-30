// libs/notifications/src/lib/notifications-api.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '@doublestar/shared';
import { NotificationLogEntry } from './models/notification-log.model';

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private readonly api = inject(ApiClientService);

  getLog(take = 100): Observable<NotificationLogEntry[]> {
    return this.api.get<NotificationLogEntry[]>('/notifications/log', { take });
  }
}