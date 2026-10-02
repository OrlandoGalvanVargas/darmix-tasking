export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "RESOURCE_NOT_FOUND"
  | "ENDPOINT_NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "TOO_MANY_REQUESTS"
  | "BUSINESS_RULE"
  | "NOT_FOUND"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    pagination: PaginationMeta;
  };
}

export interface ApiFailure {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code: ErrorCode;
}
