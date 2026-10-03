import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";
import { API_ROUTES } from "@/constants/api";
import { tokenStorage } from "@/services/storage/token";
import { ApiError } from "./ApiError";
import { refreshAccessToken } from "./refresh";
import type { ApiFailure } from "@/types/api";

const SKIP_REFRESH_PATHS: string[] = [
  API_ROUTES.auth.login,
  API_ROUTES.auth.register,
  API_ROUTES.auth.refresh,
];

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const http = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { Accept: "application/json" },
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiFailure>) => {
    const original = error.config as RetryableConfig | undefined;

    if (!original) throw ApiError.fromAxios(error);

    const status = error.response?.status;
    const url = original.url ?? "";
    const shouldSkipRefresh = SKIP_REFRESH_PATHS.some((p) => url.includes(p));

    if (status === 401 && !original._retry && !shouldSkipRefresh) {
      original._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return http.request(original);
      }
    }

    throw ApiError.fromAxios(error);
  },
);
