import { Outlet } from "react-router";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandMark } from "@/components/ui/BrandMark";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 60%, white 1.5px, transparent 1.5px)",
            backgroundSize: "48px 48px, 64px 64px",
          }}
        />

        <div className="relative flex items-center gap-3">
          <BrandMark size={36} className="text-primary-foreground" />
          <span className="text-lg font-semibold text-primary-foreground">
            Task Manager
          </span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-tight text-primary-foreground">
            Organiza tus proyectos.
            <br />
            Termina lo importante.
          </h2>
          <p className="mt-4 text-base text-primary-foreground/80">
            Un lugar simple para planear, priorizar y cerrar tareas sin ruido.
          </p>
        </div>

        <p className="relative text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} · Prueba técnica Grupo Balak
        </p>
      </aside>

      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <BrandMark size={28} className="text-primary" />
            <span className="text-base font-semibold text-foreground">
              Task Manager
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="w-full max-w-sm">
            <div className="mb-8 hidden lg:block">
              <h1 className="text-2xl font-bold text-foreground">
                Bienvenido de vuelta
              </h1>
              <p className="mt-1 text-sm text-foreground-muted">
                Inicia sesión para continuar
              </p>
            </div>

            <div className="rounded-card border border-border bg-surface p-6 shadow-sm sm:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
