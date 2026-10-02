import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutMutation } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandMark } from "@/components/ui/BrandMark";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ROUTES } from "@/constants/routes";

export function AppLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const logout = useLogoutMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    await logout.mutateAsync();
    setConfirmOpen(false);
    navigate(ROUTES.login, { replace: true });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "·";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link
            to={ROUTES.projects}
            className="flex items-center gap-2.5 transition hover:opacity-80"
          >
            <BrandMark size={30} className="text-primary" />
            <span className="text-base font-semibold text-foreground">
              Task Manager
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user && (
              <div
                className="hidden items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3 sm:flex"
                title={user.email}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {initials}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar sesión? Tendrás que iniciar sesión de nuevo para acceder a tus proyectos."
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        variant="danger"
        isLoading={logout.isPending}
        onConfirm={handleLogout}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
