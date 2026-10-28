
import {
  Component,
  OnInit,
  PLATFORM_ID,
  input,
  output,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageSize = input.required<number>();

  readonly pageSizeOptions = input<number[]>([10, 25, 50, 100]);

  /**
   * Optional browser-local preference key.
   *
   * Give each table a unique key to remember its page size
   * independently. Leave empty to disable persistence.
   */
  readonly preferenceKey = input<string>('');

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const key = this.preferenceKey().trim();

    if (!key) {
      return;
    }

    try {
      const savedValue = localStorage.getItem(key);

      if (savedValue === null) {
        return;
      }

      const savedPageSize = Number(savedValue);
      const validOptions = this.getValidPageSizeOptions();

      if (!validOptions.includes(savedPageSize)) {
        return;
      }

      if (savedPageSize !== this.pageSize()) {
        this.pageSizeChange.emit(savedPageSize);
      }
    } catch {
      // Pagination still works if browser storage is unavailable.
    }
  }

  handlePageSizeChange(value: number | string): void {
    const selectedPageSize = Number(value);

    if (!this.getValidPageSizeOptions().includes(selectedPageSize)) {
      return;
    }

    const key = this.preferenceKey().trim();

    if (key && isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, String(selectedPageSize));
      } catch {
        // The selected page size still works without persistence.
      }
    }

    if (selectedPageSize !== this.pageSize()) {
      this.pageSizeChange.emit(selectedPageSize);
    }
  }

  private getValidPageSizeOptions(): number[] {
    return [
      ...new Set(
        this.pageSizeOptions().filter(
          (size) => Number.isInteger(size) && size > 0,
        ),
      ),
    ];
  }
}