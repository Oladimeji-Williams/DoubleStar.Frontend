// libs/reviews/src/lib/star-rating/star-rating.component.ts
import { Component, input, output } from '@angular/core';
import { IconComponent } from '@doublestar/shared';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './star-rating.component.html',
  styleUrl: './star-rating.component.scss',
})
export class StarRatingComponent {
  readonly rating = input(0);
  readonly interactive = input(false);
  readonly size = input(16);
  readonly ratingChange = output<number>();

  protected readonly stars = [1, 2, 3, 4, 5];

  protected select(value: number): void {
    if (this.interactive()) this.ratingChange.emit(value);
  }
}