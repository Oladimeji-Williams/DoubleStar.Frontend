// libs/repairs/src/lib/my-repairs-page/my-repairs-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepairsApiService } from '../repairs-api.service';
import { RepairTicket } from '../models/repair-ticket.model';

@Component({
  selector: 'app-my-repairs-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-repairs-page.component.html',
  styleUrl: './my-repairs-page.component.scss',
})
export class MyRepairsPageComponent implements OnInit {
  private readonly repairsApi = inject(RepairsApiService);

  protected readonly tickets = signal<RepairTicket[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.repairsApi.getMine().subscribe((tickets) => {
      this.tickets.set(tickets);
      this.isLoading.set(false);
    });
  }
}