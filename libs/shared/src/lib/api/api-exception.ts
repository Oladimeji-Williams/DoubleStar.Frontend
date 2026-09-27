// libs/shared/src/lib/api/api-exception.ts
import { ApiError } from './api-response.model';

export class ApiException extends Error {
  constructor(
    public readonly errors: ApiError[],
    public readonly status: number,
  ) {
    super(errors.map((e) => e.message).join(' '));
    this.name = 'ApiException';
  }

  hasCode(code: string): boolean {
    return this.errors.some((e) => e.code === code);
  }
}