import type { AxiosError } from "axios";
import type { ApiFailure, ErrorCode } from "@/types/api";

export class ApiError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly errors: Record<string, string[]>;

  constructor(params: {
    message: string;
    code: ErrorCode;
    status: number;
    errors?: Record<string, string[]>;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.code = params.code;
    this.status = params.status;
    this.errors = params.errors ?? {};
  }

  static fromAxios(error: AxiosError<ApiFailure>): ApiError {
    if (!error.response) {
      return new ApiError({
        message: "No se pudo conectar con el servidor. Verifica tu conexión.",
        code: "NETWORK_ERROR",
        status: 0,
      });
    }

    const { status, data } = error.response;

    return new ApiError({
      message: data?.message ?? "Ocurrió un error inesperado.",
      code: data?.code ?? "UNKNOWN_ERROR",
      status,
      errors: data?.errors ?? {},
    });
  }

  isValidation(): boolean {
    return this.code === "VALIDATION_ERROR" || this.status === 422;
  }
  isUnauthenticated(): boolean {
    return this.code === "UNAUTHENTICATED" || this.status === 401;
  }
  isForbidden(): boolean {
    return this.code === "FORBIDDEN" || this.status === 403;
  }
  isNotFound(): boolean {
    return this.status === 404;
  }
  isNetworkError(): boolean {
    return this.code === "NETWORK_ERROR";
  }
}
