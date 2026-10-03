import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useLogoutMutation } from "@/hooks/useAuthMutations";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandMark } from "@/components/ui/BrandMark";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
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
      <ScrollProgress />

      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <Link
            to={ROUTES.projects}
            className="group flex items-center gap-2.5"
          >
            <BrandMark
              size={30}
              className="text-primary transition-transform duration-500 ease-spring group-hover:-rotate-12 group-hover:scale-110"
            />
            <span className="font-soft hidden font-serif text-xl font-medium tracking-tight text-foreground sm:inline">
              Darmix Tasking
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user && (
              <div
                className="hidden items-center gap-2.5 rounded-full border border-border bg-surface py-1 pl-1 pr-3 sm:flex"
                title={user.email}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground ring-2 ring-accent/40 ring-offset-2 ring-offset-surface">
                  {initials}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {user.name.split(" ")[0]}
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(true)}
            >
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:pt-14">
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
