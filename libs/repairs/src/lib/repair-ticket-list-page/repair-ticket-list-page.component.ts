import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import {
  ApiException,
  DataTableComponent,
  DataTableColumn,
  DataTableFilter,
  DataTableQuery,
} from '@doublestar/shared';

import { RepairsApiService } from '../repairs-api.service';
import { RepairTicket } from '../models/repair-ticket.model';

@Component({
  selector: 'app-repair-ticket-list-page',
  standalone: true,
  imports: [
    RouterLink,
    DataTableComponent,
  ],
  templateUrl:
    './repair-ticket-list-page.component.html',
  styleUrl:
    './repair-ticket-list-page.component.scss',
})
export class RepairTicketListPageComponent
  implements OnInit
{
  private readonly repairsApi =
    inject(RepairsApiService);

  protected readonly tickets =
    signal<RepairTicket[]>([]);

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
    signal<
      'asc' | 'desc' | undefined
    >('desc');

  protected readonly rowLink =
    (ticket: RepairTicket) =>
      ['/repairs', ticket.id];

  protected readonly columns:
    DataTableColumn<RepairTicket>[] =
    [
      {
        key: 'id',
        label: '#',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterConfig: {
          operators: [
            'equals',
            'notEquals',
          ],
        },
      },
      {
        key: 'deviceDescription',
        label: 'Device',
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
              label: 'Received',
              value: 'Received',
            },
            {
              label: 'Diagnosing',
              value: 'Diagnosing',
            },
            {
              label: 'Awaiting approval',
              value: 'AwaitingApproval',
            },
            {
              label: 'In repair',
              value: 'InRepair',
            },
            {
              label: 'Ready',
              value: 'Ready',
            },
            {
              label: 'Collected',
              value: 'Collected',
            },
            {
              label: 'Cancelled',
              value: 'Cancelled',
            },
          ],
        },
      },
      {
        key: 'faultDescription',
        label: 'Fault',
        sortable: false,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'technicianUserId',
        label: 'Technician',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterConfig: {
          operators: [
            'equals',
            'notEquals',
            'isEmpty',
            'isNotEmpty',
          ],
        },
        format: ticket =>
          ticket.technicianUserId ??
          'Unassigned',
      },
      {
        key: 'quotedPriceKobo',
        label: 'Quoted',
        sortable: true,
        filterable: true,
        filterType: 'text',
        filterConfig: {
          operators: [
            'equals',
            'notEquals',
          ],
        },
        dataType: 'currency',
        format: ticket =>
          ticket.quotedPriceKobo === null ||
          ticket.quotedPriceKobo ===
            undefined
            ? '—'
            : this.formatCurrency(
                ticket.quotedPriceKobo,
              ),
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

    this.repairsApi
      .getAll({
        page: this.page(),
        pageSize: this.pageSize(),
        sortBy: this.sortBy(),
        sortDirection:
          this.sortDirection(),
        filters: this.filters(),
      })
      .subscribe({
        next: result => {
          this.tickets.set(
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
              : 'Could not load repair tickets.',
          );
        },
      });
  }

  private formatCurrency(
    kobo: number,
  ): string {
    return `₦${(
      kobo / 100
    ).toLocaleString(
      'en-NG',
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    )}`;
  }
}