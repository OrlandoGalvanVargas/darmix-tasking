import axios from "axios";
import { API_ROUTES } from "@/constants/api";
import { env } from "@/config/env";
import { tokenStorage } from "@/services/storage/token";
import type { ApiSuccess } from "@/types/api";
import type { TokenData } from "@/types/auth";

let refreshPromise: Promise<string | null> | null = null;

export function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

async function doRefresh(): Promise<string | null> {
  const currentToken = tokenStorage.get();
  if (!currentToken) return null;

  try {
    const { data } = await axios.post<ApiSuccess<TokenData>>(
      `${env.VITE_API_URL}${API_ROUTES.auth.refresh}`,
      {},
      { headers: { Authorization: `Bearer ${currentToken}` } },
    );
    const newToken = data.data.access_token;
    tokenStorage.set(newToken);
    return newToken;
  } catch {
    tokenStorage.clear();
    return null;
  }
}
