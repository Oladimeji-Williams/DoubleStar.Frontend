import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import {
  ApiException,
  DataTableColumn,
  DataTableComponent,
  DataTableFilter,
  DataTableQuery,
} from '@doublestar/shared';

import { NotificationsApiService } from '../notifications-api.service';
import { NotificationLogEntry } from '../models/notification-log.model';

@Component({
  selector: 'app-notification-log-page',
  standalone: true,
  imports: [
    DataTableComponent,
  ],
  templateUrl:
    './notification-log-page.component.html',
  styleUrl:
    './notification-log-page.component.scss',
})
export class NotificationLogPageComponent
  implements OnInit
{
  private readonly notificationsApi =
    inject(NotificationsApiService);

  protected readonly entries =
    signal<NotificationLogEntry[]>([]);

  protected readonly isLoading =
    signal(false);

  protected readonly errorMessage =
    signal<string | null>(null);

  protected readonly page =
    signal(1);

  protected readonly pageSize =
    signal(25);

  protected readonly totalCount =
    signal(0);

  protected readonly filters =
    signal<DataTableFilter[]>([]);

  protected readonly sortBy =
    signal<string | undefined>(
      'createdAt',
    );

  protected readonly sortDirection =
    signal<'asc' | 'desc' | undefined>(
      'desc',
    );

  protected readonly columns:
    DataTableColumn<NotificationLogEntry>[] =
    [
      {
        key: 'channel',
        label: 'Channel',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterConfig: {
          operators: [
            'equals',
            'notEquals',
          ],
          options: [
            {
              label: 'Email',
              value: 'Email',
            },
            {
              label: 'SMS',
              value: 'Sms',
            },
          ],
        },
      },
      {
        key: 'recipient',
        label: 'Recipient',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'templateName',
        label: 'Template',
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterConfig: {
          operators: [
            'equals',
            'notEquals',
          ],
          options: [
            {
              label: 'Sent',
              value: 'Sent',
            },
            {
              label: 'Failed',
              value: 'Failed',
            },
          ],
        },
      },
      {
        key: 'errorMessage',
        label: 'Error',
        sortable: false,
        filterable: true,
        filterType: 'text',
        format: entry =>
          entry.errorMessage ?? '—',
      },
      {
        key: 'createdAt',
        label: 'Sent',
        sortable: true,
        dataType: 'date',
        format: entry =>
          new Date(
            entry.createdAt,
          ).toLocaleString('en-NG'),
      },
    ];

  ngOnInit(): void {
    this.load();
  }

  protected retryLoad(): void {
    this.load();
  }

  protected onTableQuery(
    query: DataTableQuery,
  ): void {
    this.page.set(query.page);

    this.pageSize.set(
      query.pageSize,
    );

    this.sortBy.set(
      query.sortBy,
    );

    this.sortDirection.set(
      query.sortDirection,
    );

    this.filters.set(
      query.filters,
    );

    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.notificationsApi
      .getLog({
        page: this.page(),
        pageSize: this.pageSize(),
        sortBy: this.sortBy(),
        sortDirection:
          this.sortDirection(),
        filters: this.filters(),
      })
      .subscribe({
        next: result => {
          this.entries.set(
            result.items,
          );

          this.totalCount.set(
            result.totalCount,
          );

          this.page.set(
            result.page,
          );

          this.pageSize.set(
            result.pageSize,
          );

          this.isLoading.set(false);
        },

        error: (error: unknown) => {
          this.isLoading.set(false);

          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Could not load notification logs.',
          );
        },
      });
  }
}