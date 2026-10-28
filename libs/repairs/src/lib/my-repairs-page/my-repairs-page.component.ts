
import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { Subscription } from 'rxjs';

import {
  ApiException,
  DataTableComponent,
  DataTableColumn,
  DataTableFilter,
  DataTableQuery,
} from '@doublestar/shared';

import { RepairsApiService } from '../repairs-api.service';
import { RepairTicket } from '../models/repair-ticket.model';
import { RepairTrackingService } from '../repair-tracking.service';

@Component({
  selector: 'app-my-repairs-page',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './my-repairs-page.component.html',
  styleUrl: './my-repairs-page.component.scss',
})
export class MyRepairsPageComponent implements OnInit, OnDestroy {
  private readonly repairsApi = inject(RepairsApiService);
  private readonly repairTracking = inject(RepairTrackingService);

  private readonly trackingSubscription: Subscription;

  protected readonly tickets = signal<RepairTicket[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(25);
  protected readonly totalCount = signal(0);
  protected readonly filters = signal<DataTableFilter[]>([]);
  protected readonly sortBy = signal<string | undefined>('id');
  protected readonly sortDirection =
    signal<'asc' | 'desc' | undefined>('desc');

  protected readonly rowLink = (ticket: RepairTicket) =>
    ['/repairs', ticket.id];

  protected readonly columns: DataTableColumn<RepairTicket>[] = [
    {
      key: 'id',
      label: '#',
      sortable: true,
      filterable: true,
      filterType: 'text',
      filterConfig: { operators: ['equals', 'notEquals'] },
    },
    {
      key: 'deviceDescription',
      label: 'Device',
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      key: 'faultDescription',
      label: 'Fault',
      sortable: false,
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
        operators: ['equals', 'notEquals'],
        options: [
          { label: 'Received', value: 'Received' },
          { label: 'Diagnosing', value: 'Diagnosing' },
          { label: 'Awaiting approval', value: 'AwaitingApproval' },
          { label: 'In repair', value: 'InRepair' },
          { label: 'Ready', value: 'Ready' },
          { label: 'Collected', value: 'Collected' },
          { label: 'Cancelled', value: 'Cancelled' },
        ],
      },
    },
  ];

  constructor() {
    this.trackingSubscription =
      this.repairTracking.updates$.subscribe((update) => {
        // Refresh only if the updated ticket is on this page.
        if (this.tickets().some((ticket) => ticket.id === update.ticketId)) {
          this.load();
        }
      });
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.trackingSubscription.unsubscribe();
    void this.repairTracking.disconnect();
  }

  protected retryLoad(): void {
    this.load();
  }

  protected onTableQuery(query: DataTableQuery): void {
    this.page.set(query.page);
    this.pageSize.set(query.pageSize);
    this.sortBy.set(query.sortBy);
    this.sortDirection.set(query.sortDirection);
    this.filters.set(query.filters);

    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.repairsApi
      .getMine({
        page: this.page(),
        pageSize: this.pageSize(),
        sortBy: this.sortBy(),
        sortDirection: this.sortDirection(),
        filters: this.filters(),
      })
      .subscribe({
        next: (result) => {
          this.tickets.set(result.items);
          this.totalCount.set(result.totalCount);
          this.page.set(result.page);
          this.pageSize.set(result.pageSize);
          this.isLoading.set(false);

          // Keep SignalR subscriptions aligned with the visible page.
          void this.repairTracking
            .setTickets(result.items.map((ticket) => ticket.id))
            .catch((error: unknown) => {
              console.error(
                'Could not connect to live repair updates.',
                error,
              );
            });
        },
        error: (error: unknown) => {
          this.isLoading.set(false);
          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Could not load your repair tickets.',
          );
        },
      });
  }
}
