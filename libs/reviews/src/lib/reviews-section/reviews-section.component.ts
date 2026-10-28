// libs/reviews/src/lib/reviews-section/reviews-section.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiException, ConfirmService, ToastService } from '@doublestar/shared';
import { ReviewsApiService } from '../reviews-api.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Review } from '../models/review.model';

@Component({
  selector: 'app-reviews-section',
  standalone: true,
  imports: [StarRatingComponent],
  templateUrl: './reviews-section.component.html',
  styleUrl: './reviews-section.component.scss',
})
export class ReviewsSectionComponent implements OnInit {
  private readonly reviewsApi = inject(ReviewsApiService);
  private readonly confirmService = inject(ConfirmService);
  private readonly toastService = inject(ToastService);

  protected readonly reviews = signal<Review[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly draftRating = signal(0);
  protected readonly draftComment = signal('');
  protected readonly isSubmitting = signal(false);
  protected readonly deletingIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.reviewsApi.getApproved().subscribe({
      next: (reviews) => { this.reviews.set(reviews); this.isLoading.set(false); },
      error: () => this.isLoading.set(false),
    });
  }

  protected readonly canSubmit = () => this.draftRating() > 0 && this.draftComment().trim().length > 0;

  protected submit(): void {
    if (!this.canSubmit()) return;
    this.isSubmitting.set(true);
    this.reviewsApi.submit(this.draftRating(), this.draftComment()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.draftRating.set(0);
        this.draftComment.set('');
        this.toastService.success('Thanks! Your review will appear once it\u2019s approved.');
      },
      error: (error: unknown) => {
        this.isSubmitting.set(false);
        this.toastService.error(error instanceof ApiException ? error.message : 'Could not submit your review. Please try again.');
      },
    });
  }

  protected isDeleting(id: string): boolean {
    return this.deletingIds().has(id);
  }

  protected async deleteReview(review: Review): Promise<void> {
    const confirmed = await this.confirmService.confirm('Delete this review? This cannot be undone.', 'Delete');
    if (!confirmed) return;

    this.deletingIds.update((set) => new Set(set).add(review.id));
    this.reviewsApi.delete(review.id).subscribe({
      next: () => {
        this.deletingIds.update((set) => { const next = new Set(set); next.delete(review.id); return next; });
        this.toastService.success('Review deleted.');
        this.load();
      },
      error: (error: unknown) => {
        this.deletingIds.update((set) => { const next = new Set(set); next.delete(review.id); return next; });
        this.toastService.error(error instanceof ApiException ? error.message : 'Could not delete the review — you may not have permission.');
      },
    });
  }
}