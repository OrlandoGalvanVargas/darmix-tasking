import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/services/http/ApiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          if (error.isUnauthenticated()) return false;
          if (error.status >= 400 && error.status < 500) return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.silentError) return;
      if (error instanceof ApiError && error.isUnauthenticated()) return;
      const message =
        error instanceof ApiError ? error.message : "Error al cargar datos.";
      toast.error(message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.meta?.silentError) return;
      if (error instanceof ApiError && error.isValidation()) return;
      if (error instanceof ApiError && error.isUnauthenticated()) return;
      const message =
        error instanceof ApiError
          ? error.message
          : "Error al realizar la operación.";
      toast.error(message);
    },
  }),
});
