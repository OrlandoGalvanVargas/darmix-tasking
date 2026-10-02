import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "No se pudieron cargar los datos",
  message = "Ocurrió un error al comunicarse con el servidor.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-danger/30 bg-danger-soft/40 px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-danger">{title}</h3>
      <p className="max-w-sm text-sm text-foreground-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
