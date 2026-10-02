import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/useAuthStore";
import { tokenStorage } from "@/services/storage/token";
import { ApiError } from "@/services/http/ApiError";
import type { AuthData, LoginPayload, RegisterPayload } from "@/types/auth";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<AuthData, Error, LoginPayload>({
    mutationFn: (payload) => api.auth.login(payload),
    meta: { silentError: true },
    onSuccess: (data) => {
      tokenStorage.set(data.token.access_token);
      setUser(data.user);
      queryClient.clear();
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation<AuthData, Error, RegisterPayload>({
    mutationFn: (payload) => api.auth.register(payload),
    meta: { silentError: true },
    onSuccess: (data) => {
      tokenStorage.set(data.token.access_token);
      setUser(data.user);
      queryClient.clear();
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clear);

  return useMutation<void, Error, void>({
    mutationFn: () => api.auth.logout(),
    meta: { silentError: true },
    onSettled: () => {
      tokenStorage.clear();
      clearUser();
      queryClient.clear();
    },
  });
}

export function useCurrentUserQuery() {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clear);
  const hasToken = Boolean(tokenStorage.get());

  const query = useQuery({
    queryKey: authKeys.me,
    queryFn: () => api.auth.me(),
    enabled: hasToken,
    staleTime: 5 * 60_000,
    meta: { silentError: true },
    retry: false,
    throwOnError: false,
  });

  useEffect(() => {
    if (query.data) setUser(query.data);
  }, [query.data, setUser]);

  useEffect(() => {
    if (query.error instanceof ApiError && query.error.isUnauthenticated()) {
      tokenStorage.clear();
      clearUser();
    }
  }, [query.error, clearUser]);

  return query;
}

export function useLogout() {
  return useLogoutMutation();
}
