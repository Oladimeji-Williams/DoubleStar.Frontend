import { Component, OnInit, inject, signal } from '@angular/core';

import {
  ApiException,
  DataTableColumn,
  DataTableComponent,
  DataTableQuery,
  DataTableRowAction,
  ToastService,
} from '@doublestar/shared';

import { Review } from '../models/review.model';
import { ReviewsApiService } from '../reviews-api.service';

@Component({
  selector: 'app-review-management-page',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './review-management-page.component.html',
  styleUrl: './review-management-page.component.scss',
})
export class ReviewManagementPageComponent implements OnInit {
  private readonly reviewsApi = inject(ReviewsApiService);
  private readonly toastService = inject(ToastService);

  protected readonly pending = signal<Review[]>([]);
  protected readonly pendingPage = signal(1);
  protected readonly pendingPageSize = signal(25);
  protected readonly pendingTotalCount = signal(0);
  protected readonly pendingFilters =
    signal<DataTableQuery['filters']>([]);
  protected readonly pendingSortBy =
    signal<string | undefined>('createdAtUtc');
  protected readonly pendingSortDirection =
    signal<'asc' | 'desc'>('desc');
  protected readonly pendingLoading = signal(true);

  protected readonly allReviews = signal<Review[]>([]);
  protected readonly allPage = signal(1);
  protected readonly allPageSize = signal(25);
  protected readonly allTotalCount = signal(0);
  protected readonly allFilters =
    signal<DataTableQuery['filters']>([]);
  protected readonly allSortBy =
    signal<string | undefined>('createdAtUtc');
  protected readonly allSortDirection =
    signal<'asc' | 'desc'>('desc');
  protected readonly allLoading = signal(true);

  protected readonly busyIds = signal<Set<string>>(new Set());

  protected readonly pendingColumns: DataTableColumn<Review>[] = [
    {
      key: 'reviewerName',
      label: 'Reviewer',
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        {
          label: '1 star',
          value: '1',
        },
        {
          label: '2 stars',
          value: '2',
        },
        {
          label: '3 stars',
          value: '3',
        },
        {
          label: '4 stars',
          value: '4',
        },
        {
          label: '5 stars',
          value: '5',
        },
      ],
      format: (review) => `${review.rating}/5`,
    },
    {
      key: 'comment',
      label: 'Comment',
      filterable: true,
      filterType: 'text',
      format: (review) =>
        review.comment.length > 80
          ? `${review.comment.slice(0, 80)}…`
          : review.comment,
    },
    {
      key: 'isAnonymous',
      label: 'Anonymous?',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
      format: (review) =>
        review.isAnonymous ? 'Yes' : 'No',
    },
    {
      key: 'createdAtUtc',
      label: 'Submitted',
      sortable: true,
      format: (review) =>
        this.formatDate(review.createdAtUtc),
    },
  ];

  protected readonly allColumns: DataTableColumn<Review>[] = [
    {
      key: 'reviewerName',
      label: 'Reviewer',
      sortable: true,
      filterable: true,
      filterType: 'text',
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        {
          label: '1 star',
          value: '1',
        },
        {
          label: '2 stars',
          value: '2',
        },
        {
          label: '3 stars',
          value: '3',
        },
        {
          label: '4 stars',
          value: '4',
        },
        {
          label: '5 stars',
          value: '5',
        },
      ],
      format: (review) => `${review.rating}/5`,
    },
    {
      key: 'comment',
      label: 'Comment',
      filterable: true,
      filterType: 'text',
      format: (review) =>
        review.comment.length > 80
          ? `${review.comment.slice(0, 80)}…`
          : review.comment,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        {
          label: 'Pending',
          value: 'Pending',
        },
        {
          label: 'Approved',
          value: 'Approved',
        },
        {
          label: 'Rejected',
          value: 'Rejected',
        },
      ],
      cellClass: (review) =>
        `status-${review.status.toLowerCase()}`,
    },
    {
      key: 'isAnonymous',
      label: 'Anonymous?',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
      format: (review) =>
        review.isAnonymous ? 'Yes' : 'No',
    },
    {
      key: 'isDeleted',
      label: 'Deleted?',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        {
          label: 'Active',
          value: 'false',
        },
        {
          label: 'Deleted',
          value: 'true',
        },
      ],
      format: (review) =>
        review.isDeleted ? 'Deleted' : 'Active',
      cellClass: (review) =>
        review.isDeleted ? 'status-deleted' : '',
    },
    {
      key: 'createdAtUtc',
      label: 'Submitted',
      sortable: true,
      format: (review) =>
        this.formatDate(review.createdAtUtc),
    },
    {
      key: 'approvedByName',
      label: 'Approved by',
      format: (review) =>
        review.approvedByName
          ? `${review.approvedByName} · ${this.formatDate(review.approvedAtUtc)}`
          : '—',
    },
    {
      key: 'rejectedByName',
      label: 'Rejected by',
      format: (review) =>
        review.rejectedByName
          ? `${review.rejectedByName} · ${this.formatDate(review.rejectedAtUtc)}`
          : '—',
    },
    {
      key: 'deletedByName',
      label: 'Deleted by',
      format: (review) =>
        review.deletedByName
          ? `${review.deletedByName} · ${this.formatDate(review.deletedAtUtc)}`
          : '—',
    },
  ];

  protected readonly rowActions: DataTableRowAction<Review>[] = [
    {
      label: 'Approve',
      action: (review) => this.approve(review),
      visible: (review) =>
        review.status === 'Pending' &&
        !review.isDeleted,
      disabled: (review) =>
        this.isBusy(review.id),
      className: 'approve-action',
    },
    {
      label: 'Reject',
      action: (review) => this.reject(review),
      visible: (review) =>
        review.status === 'Pending' &&
        !review.isDeleted,
      disabled: (review) =>
        this.isBusy(review.id),
      className: 'reject-action',
    },
  ];

  ngOnInit(): void {
    this.loadPending();
    this.loadAll();
  }

  protected onPendingQuery(
    query: DataTableQuery,
  ): void {
    this.pendingPage.set(query.page);
    this.pendingPageSize.set(query.pageSize);
    this.pendingFilters.set(query.filters);
    this.pendingSortBy.set(query.sortBy);
    this.pendingSortDirection.set(
      query.sortDirection ?? 'desc',
    );

    this.loadPending();
  }

  protected onAllQuery(
    query: DataTableQuery,
  ): void {
    this.allPage.set(query.page);
    this.allPageSize.set(query.pageSize);
    this.allFilters.set(query.filters);
    this.allSortBy.set(query.sortBy);
    this.allSortDirection.set(
      query.sortDirection ?? 'desc',
    );

    this.loadAll();
  }

  private loadPending(): void {
    this.pendingLoading.set(true);

    this.reviewsApi
      .getPending({
        page: this.pendingPage(),
        pageSize: this.pendingPageSize(),
        sortBy: this.pendingSortBy(),
        sortDirection: this.pendingSortDirection(),
        filters: this.pendingFilters(),
      })
      .subscribe({
        next: (result) => {
          this.pending.set(result.items);
          this.pendingTotalCount.set(
            result.totalCount,
          );
          this.pendingLoading.set(false);
        },
        error: (error: unknown) => {
          this.pendingLoading.set(false);

          this.toastService.error(
            error instanceof ApiException
              ? error.message
              : 'Could not load pending reviews.',
          );
        },
      });
  }

  private loadAll(): void {
    this.allLoading.set(true);

    this.reviewsApi
      .getAll({
        page: this.allPage(),
        pageSize: this.allPageSize(),
        sortBy: this.allSortBy(),
        sortDirection: this.allSortDirection(),
        filters: this.allFilters(),
      })
      .subscribe({
        next: (result) => {
          this.allReviews.set(result.items);
          this.allTotalCount.set(
            result.totalCount,
          );
          this.allLoading.set(false);
        },
        error: (error: unknown) => {
          this.allLoading.set(false);

          this.toastService.error(
            error instanceof ApiException
              ? error.message
              : 'Could not load reviews.',
          );
        },
      });
  }

  protected approve(review: Review): void {
    this.setBusy(review.id, true);

    this.reviewsApi
      .approve(review.id)
      .subscribe({
        next: () => {
          this.setBusy(review.id, false);

          this.toastService.success(
            'Review approved.',
          );

          this.loadPending();
          this.loadAll();
        },
        error: (error: unknown) => {
          this.setBusy(review.id, false);

          this.toastService.error(
            error instanceof ApiException
              ? error.message
              : 'Could not approve the review.',
          );
        },
      });
  }

  protected reject(review: Review): void {
    this.setBusy(review.id, true);

    this.reviewsApi
      .reject(review.id)
      .subscribe({
        next: () => {
          this.setBusy(review.id, false);

          this.toastService.success(
            'Review rejected.',
          );

          this.loadPending();
          this.loadAll();
        },
        error: (error: unknown) => {
          this.setBusy(review.id, false);

          this.toastService.error(
            error instanceof ApiException
              ? error.message
              : 'Could not reject the review.',
          );
        },
      });
  }

  protected isBusy(id: string): boolean {
    return this.busyIds().has(id);
  }

  private setBusy(
    id: string,
    busy: boolean,
  ): void {
    this.busyIds.update((current) => {
      const next = new Set(current);

      if (busy) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  }

  private formatDate(
    value: string | null,
  ): string {
    if (!value) {
      return '—';
    }

    return new Date(value).toLocaleString();
  }
}