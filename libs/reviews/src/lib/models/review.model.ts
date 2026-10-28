// libs/reviews/src/lib/models/review.model.ts — full replacement
export interface Review {
  id: string;
  reviewerName: string;
  isAnonymous: boolean;
  rating: number;
  comment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAtUtc: string;
  canDelete: boolean;
  isDeleted: boolean;
  deletedAtUtc: string | null;
  deletedByName: string | null;
  approvedAtUtc: string | null;
  approvedByName: string | null;
  rejectedAtUtc: string | null;
  rejectedByName: string | null;
}