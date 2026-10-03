// libs/reviews/src/lib/models/review.model.ts
export interface Review {
  id: string;
  reviewerName: string;
  isAnonymous: boolean;
  rating: number;
  comment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAtUtc: string;
  canDelete: boolean;
}