// libs/shared/src/lib/api/api-response.model.ts
export interface ApiError {
  code: string;
  message: string;
  type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  errors: ApiError[] | null;
}