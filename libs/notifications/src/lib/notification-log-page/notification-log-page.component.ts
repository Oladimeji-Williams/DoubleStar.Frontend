// libs/notifications/src/lib/notification-log-page/notification-log-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsApiService } from '../notifications-api.service';
import { NotificationLogEntry } from '../models/notification-log.model';

@Component({
  selector: 'app-notification-log-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-log-page.component.html',
  styleUrl: './notification-log-page.component.scss',
})
export class NotificationLogPageComponent implements OnInit {
  private readonly notificationsApi = inject(NotificationsApiService);

  protected readonly entries = signal<NotificationLogEntry[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.notificationsApi.getLog().subscribe({
      next: (entries) => { this.entries.set(entries); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }
}