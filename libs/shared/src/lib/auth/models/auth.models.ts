// libs/shared/src/lib/auth/models/auth.models.ts
export const STAFF_ROLES = ['Admin', 'Manager', 'Cashier', 'Technician'] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];
export type Role = StaffRole | 'Customer';

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
  userId: string;
  email: string | null;
  phone: string | null;
  displayName: string;
  roles: Role[];
}

export interface CurrentUser {
  userId: string;
  email: string | null;
  phone: string | null;
  displayName: string;
  roles: Role[];
}

export interface UserProfile {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string;
  lastName: string;
  roles: Role[];
}