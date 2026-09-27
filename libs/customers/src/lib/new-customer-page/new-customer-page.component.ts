// libs/customers/src/lib/new-customer-page/new-customer-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiException } from '@doublestar/shared';
import { CustomersApiService } from '../customers-api.service';

@Component({
  selector: 'app-new-customer-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-customer-page.component.html',
  styleUrl: './new-customer-page.component.scss',
})
export class NewCustomerPageComponent {
  private readonly customersApi = inject(CustomersApiService);
  private readonly router = inject(Router);

  protected readonly name = signal('');
  protected readonly phone = signal('');
  protected readonly email = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected submit(): void {
    if (!this.name().trim()) return;

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.customersApi
      .createWalkIn({ name: this.name(), phone: this.phone() || null, email: this.email() || null })
      .subscribe({
        next: (customer) => this.router.navigate(['/customers', customer.id]),
        error: (error: unknown) => {
          this.isBusy.set(false);
          this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
        },
      });
  }
}