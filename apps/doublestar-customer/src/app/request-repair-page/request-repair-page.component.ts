// apps/doublestar-customer/src/app/request-repair-page/request-repair-page.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiException, ToastService } from '@doublestar/shared';
import { RepairsApiService } from '@doublestar/repairs';

@Component({
  selector: 'app-request-repair-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './request-repair-page.component.html',
  styleUrl: './request-repair-page.component.scss',
})
export class RequestRepairPageComponent {
  private readonly repairsApi = inject(RepairsApiService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly deviceDescription = signal('');
  protected readonly imeiOrSerial = signal('');
  protected readonly faultDescription = signal('');
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isBusy = signal(false);

  protected readonly canSubmit = () => this.deviceDescription().trim().length > 0 && this.faultDescription().trim().length > 0;

  protected submit(): void {
    if (!this.canSubmit()) return;

    this.isBusy.set(true);
    this.errorMessage.set(null);

    this.repairsApi
      .requestRepair({ deviceDescription: this.deviceDescription(), imeiOrSerial: this.imeiOrSerial() || null, faultDescription: this.faultDescription() })
      .subscribe({
        next: (ticket) => {
          this.isBusy.set(false);
          this.toastService.success(`Repair request #${ticket.id} submitted.`);
          this.router.navigateByUrl('/my/repairs');
        },
        error: (error: unknown) => {
          this.isBusy.set(false);
          this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
        },
      });
  }
}