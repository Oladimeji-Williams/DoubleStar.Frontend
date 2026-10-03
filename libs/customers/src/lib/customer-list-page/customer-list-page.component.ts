// libs/customers/src/lib/customer-list-page/customer-list-page.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, retry, switchMap } from 'rxjs';
import { CustomersApiService } from '../customers-api.service';
import { Customer } from '../models/customer.model';

@Component({
  selector: 'app-customer-list-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-list-page.component.html',
  styleUrl: './customer-list-page.component.scss',
})
export class CustomerListPageComponent implements OnInit {
  private readonly customersApi = inject(CustomersApiService);
  private readonly searchTerm$ = new Subject<string>();

  protected readonly searchTerm = signal('');
  protected readonly customers = signal<Customer[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) =>
          this.customersApi.search(term).pipe(
            retry({ count: 1, delay: 400 }),
            catchError(() => {
              this.errorMessage.set('Could not load customers.');
              return of([] as Customer[]);
            }),
          ),
        ),
      )
      .subscribe((customers) => {
        this.customers.set(customers);
        this.isLoading.set(false);
      });

    this.searchTerm$.next('');
  }

  protected onSearchInput(term: string): void {
    this.searchTerm.set(term);
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.searchTerm$.next(term);
  }

  protected retryLoad(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.searchTerm$.next(this.searchTerm());
  }
}