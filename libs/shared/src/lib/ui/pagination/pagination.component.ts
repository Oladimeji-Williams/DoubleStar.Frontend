// libs/shared/src/lib/ui/pagination/pagination.component.ts — full replacement (this is what was actually missing: imports: [FormsModule])
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly pageSizeOptions = input<number[]>([12, 24, 48]);
  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();
}