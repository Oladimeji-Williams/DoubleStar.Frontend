// apps/doublestar-customer/src/app/reviews-page/reviews-page.component.ts
import { Component } from '@angular/core';
import { ReviewsSectionComponent } from '@doublestar/reviews';

@Component({
  selector: 'app-reviews-page',
  standalone: true,
  imports: [ReviewsSectionComponent],
  templateUrl: './reviews-page.component.html',
  styleUrl: './reviews-page.component.scss',
})
export class ReviewsPageComponent {}