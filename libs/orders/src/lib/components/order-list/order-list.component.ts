import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { DataTableComponent, DataTableFilter, DataTableQuery } from '@doublestar/shared';
import { OrderListItem, OrdersApiService } from '@doublestar/orders-data-access';
import { buildOrderColumns } from '../../lists/order-list-columns';
import { messageFrom } from '../../util/message-from';

export type OrderListScope = 'mine' | 'all';

/** The paged, sortable, filterable order table. `mine` = the customer's own, `all` = staff view. */
@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderListComponent implements OnInit {
  private readonly ordersApi = inject(OrdersApiService);

  readonly scope = input.required<OrderListScope>();
  /** Route prefix for a row's detail page, e.g. `/my/orders`. */
  readonly detailPath = input.required<string>();
  readonly emptyMessage = input("You don't have any orders yet.");

  protected readonly columns = computed(() => buildOrderColumns(this.scope() === 'all'));
  protected readonly rowLink = (order: OrderListItem): unknown[] => [this.detailPath(), order.id];

  protected readonly orders = signal<OrderListItem[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(25);
  protected readonly totalCount = signal(0);
  protected readonly filters = signal<DataTableFilter[]>([]);
  protected readonly sortBy = signal<string | undefined>('createdAt');
  protected readonly sortDirection = signal<'asc' | 'desc' | undefined>('desc');

  ngOnInit(): void {
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

  protected load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const query: DataTableQuery = {
      page: this.page(),
      pageSize: this.pageSize(),
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
      filters: this.filters(),
    };
    const request$ = this.scope() === 'all' ? this.ordersApi.getAll(query) : this.ordersApi.getMine(query);

    request$.subscribe({
      next: (result) => {
        this.orders.set([...result.items]);
        this.totalCount.set(result.totalCount);
        this.page.set(result.page);
        this.pageSize.set(result.pageSize);
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(messageFrom(error, 'Could not load orders.'));
      },
    });
  }
}