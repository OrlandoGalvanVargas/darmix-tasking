import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiMode } from "@/hooks/useApiMode";
import { resetLocalDb } from "@/services/local/db";

export function DemoModeBanner() {
  const mode = useApiMode();
  const queryClient = useQueryClient();

  if (mode !== "local") return null;

  const handleReset = () => {
    resetLocalDb();
    queryClient.clear();
    toast.success("Datos demo restaurados.");

    setTimeout(() => window.location.reload(), 300);
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-primary/30 bg-primary/10 px-4 py-2"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-foreground">
          <span className="mr-2 inline-block rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            DEMO
          </span>
          Modo demo local activo.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-primary/40 bg-surface px-2.5 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          Reiniciar datos demo
        </button>
      </div>
    </div>
  );
}
