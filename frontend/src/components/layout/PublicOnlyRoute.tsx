import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/routes";

export function PublicOnlyRoute() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (isHydrated && isAuthenticated) {
    return <Navigate to={ROUTES.projects} replace />;
  }

  return <Outlet />;
}
