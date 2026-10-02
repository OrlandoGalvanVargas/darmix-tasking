import { useAuthStore } from "@/store/useAuthStore";
import { tokenStorage } from "@/services/storage/token";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const token = tokenStorage.get();

  return {
    user,
    isHydrated,
    isAuthenticated: Boolean(user && token),
  };
}
