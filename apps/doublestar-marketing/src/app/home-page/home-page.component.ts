// apps/doublestar-marketing/src/app/home-page/home-page.component.ts — full replacement
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent, PageSeoService } from '@doublestar/shared';
import { ReviewsApiService, Review, StarRatingComponent } from '@doublestar/reviews';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, IconComponent, StarRatingComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly seo = inject(PageSeoService);
  private readonly reviewsApi = inject(ReviewsApiService);
  protected readonly customerAppUrl = environment.customerAppUrl;

  protected readonly reviews = signal<Review[]>([]);
  protected readonly isLoadingReviews = signal(true);

  ngOnInit(): void {
    this.seo.set({
      title: 'Double Star — Phone & Gadget Sales and Repairs in Lagos',
      description: 'Double Star sells phones, accessories and electronic gadgets, and repairs cracked screens, batteries and more. Visit us or request a repair online.',
      path: '/',
    });

    // Real, approved customer reviews only. This page is prerendered at build time, so what
    // shows here is a snapshot as of the last deploy — the always-current list lives at
    // {customerAppUrl}/reviews.
    this.reviewsApi.getApproved().subscribe({
      next: (reviews) => { this.reviews.set(reviews.slice(0, 3)); this.isLoadingReviews.set(false); },
      error: () => this.isLoadingReviews.set(false),
    });
  }
}