import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useApiMode } from "@/hooks/useApiMode";
import { resetLocalDb } from "@/services/local/db";
import { InfoPopover } from "@/components/ui/InfoPopover";
import { LeafGlyph } from "@/components/projects/GrowthBranch";

const POINTS = [
  "Puedes crear, editar y eliminar información libremente.",
  "Los cambios se guardan únicamente en este navegador.",
  "No requiere conexión con el servidor backend.",
];

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
      className="border-b border-border bg-surface-muted/60 px-4 py-2"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <LeafGlyph kind="doing" size={16} />
          <p className="text-foreground">
            <span className="hidden sm:inline">
              Modo demo local activo. Tus cambios solo viven en este navegador.
            </span>
            <span className="sm:hidden">Modo demo local activo</span>
          </p>
          <InfoPopover label="¿Qué es el modo demo?">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">
                ¿Qué es el modo demo local?
              </p>
              <p className="text-foreground-muted">
                Esta versión funciona sin necesidad de estar conectado al
                servidor principal. Te permite probar todas las funciones de la
                aplicación de manera segura usando datos de prueba.
              </p>
              <ul className="space-y-1.5 text-foreground-muted">
                {POINTS.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">
                      <LeafGlyph kind="done" size={13} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <p className="border-t border-border pt-2 text-xs text-foreground-muted">
                Haz clic en{" "}
                <span className="font-medium text-foreground">
                  Reiniciar datos demo
                </span>{" "}
                para volver al estado inicial.
              </p>
            </div>
          </InfoPopover>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground-muted transition hover:border-primary/50 hover:text-primary"
        >
          Reiniciar datos demo
        </button>
      </div>
    </div>
  );
}
