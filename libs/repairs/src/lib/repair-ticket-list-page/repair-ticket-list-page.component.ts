// libs/repairs/src/lib/repair-ticket-list-page/repair-ticket-list-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RepairsApiService } from '../repairs-api.service';
import { RepairTicket } from '../models/repair-ticket.model';

@Component({
  selector: 'app-repair-ticket-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './repair-ticket-list-page.component.html',
  styleUrl: './repair-ticket-list-page.component.scss',
})
export class RepairTicketListPageComponent implements OnInit {
  private readonly repairsApi = inject(RepairsApiService);

  protected readonly tickets = signal<RepairTicket[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.repairsApi.getAll().subscribe((tickets) => {
      this.tickets.set(tickets);
      this.isLoading.set(false);
    });
  }
}