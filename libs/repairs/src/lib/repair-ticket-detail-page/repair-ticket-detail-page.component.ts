// libs/repairs/src/lib/repair-ticket-detail-page/repair-ticket-detail-page.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterLink } from '@angular/router';
import { ApiException, ConfirmService, KoboCurrencyPipe, ToastService } from '@doublestar/shared';
import { ProductSearchInputComponent } from '@doublestar/catalog';
import { RepairsApiService } from '../repairs-api.service';
import { RepairTicket } from '../models/repair-ticket.model';

@Component({
  selector: 'app-repair-ticket-detail-page',
  standalone: true,
  imports: [FormsModule, RouterLink, KoboCurrencyPipe, ProductSearchInputComponent],
  templateUrl: './repair-ticket-detail-page.component.html',
  styleUrl: './repair-ticket-detail-page.component.scss',
})
export class RepairTicketDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly repairsApi = inject(RepairsApiService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);

  protected readonly ticket = signal<RepairTicket | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isBusy = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly diagnosisNotes = signal('');
  protected readonly quotedPriceNaira = signal<number | null>(null);
  protected readonly partProductId = signal<number | null>(null);
  protected readonly partQuantity = signal(1);

  private ticketId!: number;

  ngOnInit(): void {
    this.ticketId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  private load(): void {
    this.isLoading.set(true);
    this.repairsApi.getById(this.ticketId).subscribe((ticket) => {
      this.ticket.set(ticket);
      this.isLoading.set(false);
    });
  }

  protected startDiagnosis(): void {
    this.runAction(this.repairsApi.startDiagnosis(this.ticketId), 'Diagnosis started.');
  }

  protected submitDiagnosis(): void {
    const notes = this.diagnosisNotes().trim();
    const naira = this.quotedPriceNaira();
    if (!notes || naira === null || naira <= 0) return;

    this.runAction(
      this.repairsApi.recordDiagnosis(this.ticketId, { diagnosisNotes: notes, quotedPriceKobo: Math.round(naira * 100) }),
      'Diagnosis recorded.',
    );
  }

  protected approveQuote(): void {
    this.runAction(this.repairsApi.approveQuote(this.ticketId), 'Quote approved.');
  }

  protected submitPart(): void {
    const productId = this.partProductId();
    if (productId === null || this.partQuantity() <= 0) return;
    this.runAction(this.repairsApi.addPart(this.ticketId, { productId, quantity: this.partQuantity() }), 'Part logged.');
    this.partProductId.set(null);
    this.partQuantity.set(1);
  }

  protected markReady(): void {
    this.runAction(this.repairsApi.markReady(this.ticketId), 'Marked ready for collection.');
  }

  protected collect(): void {
    this.runAction(this.repairsApi.collect(this.ticketId), 'Device collected.');
  }

  protected async cancel(): Promise<void> {
    const confirmed = await this.confirmService.confirm('Cancel this repair ticket? This cannot be undone.', 'Cancel ticket');
    if (!confirmed) return;
    this.runAction(this.repairsApi.cancel(this.ticketId), 'Ticket cancelled.');
  }

  private runAction(action: { subscribe: (observer: { next: () => void; error: (e: unknown) => void }) => void }, successMessage: string): void {
    this.isBusy.set(true);
    this.errorMessage.set(null);

    action.subscribe({
      next: () => {
        this.isBusy.set(false);
        this.toastService.success(successMessage);
        this.load();
      },
      error: (error: unknown) => {
        this.isBusy.set(false);
        this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
      },
    });
  }
}