// libs/customers/src/lib/customer-detail-page/customer-detail-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiException } from '@doublestar/shared';
import { CustomersApiService } from '../customers-api.service';
import { Customer } from '../models/customer.model';
import { ToastService } from '@doublestar/shared';

@Component({
  selector: 'app-customer-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-detail-page.component.html',
  styleUrl: './customer-detail-page.component.scss',
})
export class CustomerDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly customersApi = inject(CustomersApiService);
  private readonly toastService = inject(ToastService);

  protected readonly customer = signal<Customer | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly name = signal('');
  protected readonly phone = signal('');
  protected readonly email = signal('');
  protected readonly address = signal('');

  private customerId!: string;

  ngOnInit(): void {
    this.customerId = this.route.snapshot.paramMap.get('id')!;

    this.customersApi.getById(this.customerId).subscribe((customer) => {
      this.customer.set(customer);
      this.name.set(customer.name);
      this.phone.set(customer.phone ?? '');
      this.email.set(customer.email ?? '');
      this.isLoading.set(false);
    });
  }

  protected save(): void {
    if (!this.name().trim()) return;

    this.isSaving.set(true);
    this.errorMessage.set(null);

    this.customersApi
      .update(this.customerId, { name: this.name(), phone: this.phone() || null, email: this.email() || null, address: this.address() || null })
      .subscribe({
        next: () => { this.isSaving.set(false); this.toastService.success('Customer saved.'); },
        error: (error: unknown) => { this.isSaving.set(false); this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.'); },
      });
  }
}