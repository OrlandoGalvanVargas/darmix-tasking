import { Outlet } from "react-router";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { BrandMark } from "@/components/ui/BrandMark";
import { SparklesIcon } from "@/components/ui/icons";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      {}
      <aside className="relative hidden overflow-hidden bg-primary lg:flex lg:flex-col lg:justify-between lg:p-12">
        {}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_55%)]"
        />
        {}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
        />

        <div className="relative flex items-center gap-3 animate-fade-in">
          <BrandMark size={40} className="text-primary-foreground" />
          <span className="text-xl font-semibold text-primary-foreground">
            Darmix Tasking
          </span>
        </div>

        <div className="relative max-w-md space-y-6 animate-fade-in-up">
          <h2 className="text-4xl font-bold leading-tight text-primary-foreground">
            Organiza tu trabajo.
            <br />
            <span className="text-primary-foreground/75">
              Termina lo importante.
            </span>
          </h2>
          <p className="text-base leading-relaxed text-primary-foreground/70">
            Un espacio calmado para planear, priorizar y cerrar tareas sin
            ruido.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1.5 text-xs font-medium text-primary-foreground backdrop-blur-sm">
            <SparklesIcon size={14} />
            Proyectos, tareas, prioridades — todo en un solo lugar
          </div>
        </div>

        <p className="relative text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Darmix Tasking
        </p>
      </aside>

      {}
      <div className="relative flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <BrandMark size={28} className="text-primary" />
            <span className="text-base font-semibold text-foreground">
              Darmix Tasking
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center px-5 pb-10 sm:px-8">
          <div className="w-full max-w-sm animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
