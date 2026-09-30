// libs/repairs/src/lib/new-repair-ticket-page/new-repair-ticket-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiException } from '@doublestar/shared';
import { CustomerSelection, CustomerSelectorComponent } from '@doublestar/customers';
import { RepairsApiService } from '../repairs-api.service';

@Component({
  selector: 'app-new-repair-ticket-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerSelectorComponent],
  templateUrl: './new-repair-ticket-page.component.html',
  styleUrl: './new-repair-ticket-page.component.scss',
})
export class NewRepairTicketPageComponent {
  private readonly repairsApi = inject(RepairsApiService);
  private readonly router = inject(Router);

  protected readonly customer = signal<CustomerSelection | null>(null);
  protected readonly deviceDescription = signal('');
  protected readonly imeiOrSerial = signal('');
  protected readonly faultDescription = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected readonly canSubmit = () =>
    this.customer() !== null &&
    this.deviceDescription().trim().length > 0 &&
    this.faultDescription().trim().length > 0;

  protected submit(): void {
    const selection = this.customer();
    if (!selection || !this.canSubmit()) return;

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.repairsApi
      .open({
        ...selection,
        deviceDescription: this.deviceDescription(),
        imeiOrSerial: this.imeiOrSerial() || null,
        faultDescription: this.faultDescription(),
      })
      .subscribe({
        next: (ticket) => this.router.navigate(['/repairs', ticket.id]),
        error: (error: unknown) => {
          this.isBusy.set(false);
          this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
        },
      });
  }
}