// libs/customers/src/lib/customer-selector/customer-selector.component.ts
import { Component, DestroyRef, OnInit, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { CustomersApiService } from '../customers-api.service';
import { Customer } from '../models/customer.model';
import { CustomerSelection } from '../models/customer-selection.model';

type SelectorMode = 'walkin' | 'registered';

@Component({
  selector: 'app-customer-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-selector.component.html',
  styleUrl: './customer-selector.component.scss',
})
export class CustomerSelectorComponent implements OnInit {
  private readonly customersApi = inject(CustomersApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchTerm$ = new Subject<string>();

  /** Emits the current choice, or null while it's incomplete (e.g. blank walk-in name). */
  readonly selectionChange = output<CustomerSelection | null>();

  protected readonly mode = signal<SelectorMode>('walkin');
  protected readonly walkInName = signal('');
  protected readonly walkInPhone = signal('');
  protected readonly searchTerm = signal('');
  protected readonly results = signal<Customer[]>([]);
  protected readonly selected = signal<Customer | null>(null);

  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) =>
          term.trim()
            ? this.customersApi.search(term).pipe(catchError(() => of([] as Customer[])))
            : of([] as Customer[]),
        ),
      )
      .subscribe((customers) => this.results.set(customers));
  }

  protected setMode(mode: SelectorMode): void {
    this.mode.set(mode);
    this.emit();
  }

  protected onWalkInNameChange(value: string): void {
    this.walkInName.set(value);
    this.emit();
  }

  protected onWalkInPhoneChange(value: string): void {
    this.walkInPhone.set(value);
    this.emit();
  }

  protected onSearchInput(term: string): void {
    this.searchTerm.set(term);
    this.searchTerm$.next(term);
  }

  protected select(customer: Customer): void {
    this.selected.set(customer);
    this.results.set([]);
    this.searchTerm.set('');
    this.searchTerm$.next('');
    this.emit();
  }

  protected clearSelection(): void {
    this.selected.set(null);
    this.emit();
  }

  private emit(): void {
    if (this.mode() === 'registered') {
      const customer = this.selected();
      this.selectionChange.emit(
        customer ? { customerId: customer.id, walkInName: null, walkInPhone: null } : null,
      );
      return;
    }

    const name = this.walkInName().trim();
    this.selectionChange.emit(
      name ? { customerId: null, walkInName: name, walkInPhone: this.walkInPhone().trim() || null } : null,
    );
  }
}