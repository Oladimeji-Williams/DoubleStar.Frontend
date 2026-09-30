// libs/repairs/src/lib/repair-ticket-detail-page/repair-ticket-detail-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiException, KoboCurrencyPipe } from '@doublestar/shared';
import { RepairsApiService } from '../repairs-api.service';
import { RepairTicket } from '../models/repair-ticket.model';
import { ProductSearchInputComponent, Product } from '@doublestar/catalog';

@Component({
  selector: 'app-repair-ticket-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, KoboCurrencyPipe, ProductSearchInputComponent],
  templateUrl: './repair-ticket-detail-page.component.html',
  styleUrl: './repair-ticket-detail-page.component.scss',
})
export class RepairTicketDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly repairsApi = inject(RepairsApiService);

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

  protected submitDiagnosis(): void {
    const notes = this.diagnosisNotes().trim();
    const naira = this.quotedPriceNaira();
    if (!notes || naira === null || naira <= 0) return;

    this.runAction(this.repairsApi.recordDiagnosis(this.ticketId, {
      diagnosisNotes: notes,
      quotedPriceKobo: Math.round(naira * 100),
    }));
  }

  protected approveQuote(): void {
    this.runAction(this.repairsApi.approveQuote(this.ticketId));
  }

  protected submitPart(): void {
    const productId = this.partProductId();
    if (productId === null || this.partQuantity() <= 0) return;

    this.runAction(this.repairsApi.addPart(this.ticketId, { productId, quantity: this.partQuantity() }));
  }

  protected markReady(): void {
    this.runAction(this.repairsApi.markReady(this.ticketId));
  }

  protected collect(): void {
    this.runAction(this.repairsApi.collect(this.ticketId));
  }

  protected cancel(): void {
    this.runAction(this.repairsApi.cancel(this.ticketId));
  }

  private runAction(action: { subscribe: (observer: { next: () => void; error: (e: unknown) => void }) => void }): void {
    this.isBusy.set(true);
    this.errorMessage.set(null);

    action.subscribe({
      next: () => {
        this.isBusy.set(false);
        this.load();
      },
      error: (error: unknown) => {
        this.isBusy.set(false);
        this.errorMessage.set(error instanceof ApiException ? error.message : 'Something went wrong.');
      },
    });
  }

  protected startDiagnosis(): void {
    this.runAction(this.repairsApi.startDiagnosis(this.ticketId));
  }
}