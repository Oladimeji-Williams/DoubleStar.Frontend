import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  ApiClientService,
  ApiException,
  ToastService,
} from '@doublestar/shared';

interface RepairRequestResponse {
  id: number;
}

@Component({
  selector: 'app-request-repair-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './request-repair-page.component.html',
  styleUrl: './request-repair-page.component.scss',
})
export class RequestRepairPageComponent {
  private readonly api = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly deviceDescription = signal('');
  protected readonly imeiOrSerial = signal('');
  protected readonly faultDescription = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected readonly canSubmit = () =>
    this.deviceDescription().trim().length > 0 &&
    this.faultDescription().trim().length > 0;

  protected submit(): void {
    if (!this.canSubmit() || this.isBusy()) {
      return;
    }

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.api
      .post<RepairRequestResponse>('/repairtickets/me', {
        deviceDescription: this.deviceDescription().trim(),
        imeiOrSerial: this.imeiOrSerial().trim() || null,
        faultDescription: this.faultDescription().trim(),
      })
      .subscribe({
        next: (ticket: RepairRequestResponse) => {
          this.isBusy.set(false);

          this.toastService.success(
            `Repair request #${ticket.id} submitted.`,
          );

          void this.router.navigateByUrl('/my/repairs');
        },
        error: (error: unknown) => {
          this.isBusy.set(false);

          this.errorMessage.set(
            error instanceof ApiException
              ? error.message
              : 'Something went wrong.',
          );
        },
      });
  }
}