// libs/repairs/src/lib/new-repair-ticket-page/new-repair-ticket-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiException } from '@doublestar/shared';
import { RepairsApiService } from '../repairs-api.service';

@Component({
  selector: 'app-new-repair-ticket-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-repair-ticket-page.component.html',
  styleUrl: './new-repair-ticket-page.component.scss',
})
export class NewRepairTicketPageComponent {
  private readonly repairsApi = inject(RepairsApiService);
  private readonly router = inject(Router);

  protected readonly walkInName = signal('');
  protected readonly walkInPhone = signal('');
  protected readonly deviceDescription = signal('');
  protected readonly imeiOrSerial = signal('');
  protected readonly faultDescription = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected readonly canSubmit = () =>
    this.walkInName().trim().length > 0 &&
    this.deviceDescription().trim().length > 0 &&
    this.faultDescription().trim().length > 0;

  protected submit(): void {
    if (!this.canSubmit()) return;

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.repairsApi
      .open({
        customerId: null,
        walkInName: this.walkInName(),
        walkInPhone: this.walkInPhone() || null,
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