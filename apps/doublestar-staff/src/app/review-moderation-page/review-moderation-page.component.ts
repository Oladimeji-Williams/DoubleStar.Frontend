// apps/doublestar-staff/src/app/review-moderation-page/review-moderation-page.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ToastService } from '@doublestar/shared';
import { ReviewsApiService, StarRatingComponent, Review } from '@doublestar/reviews';

@Component({
  selector: 'app-review-moderation-page',
  standalone: true,
  imports: [StarRatingComponent],
  templateUrl: './review-moderation-page.component.html',
  styleUrl: './review-moderation-page.component.scss',
})
export class ReviewModerationPageComponent implements OnInit {
  private readonly reviewsApi = inject(ReviewsApiService);
  private readonly toastService = inject(ToastService);

  protected readonly pending = signal<Review[]>([]);
  protected readonly isLoading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.reviewsApi.getPending().subscribe({
      next: (reviews) => { this.pending.set(reviews); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  protected approve(review: Review): void {
    this.reviewsApi.approve(review.id).subscribe(() => {
      this.toastService.success('Review approved.');
      this.load();
    });
  }

  protected reject(review: Review): void {
    this.reviewsApi.reject(review.id).subscribe(() => {
      this.toastService.success('Review rejected.');
      this.load();
    });
  }
}