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
    <div
      role="alert"
      className="animate-fade-in flex flex-col items-center justify-center gap-4 rounded-card border border-danger/30 bg-danger-soft/40 px-6 py-10 text-center"
    >
      {}
      <svg
        width="120"
        height="48"
        viewBox="0 0 120 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-danger"
        aria-hidden="true"
      >
        <path d="M6 30C24 24 38 34 54 28" pathLength={1} className="draw" />
        <path
          d="M68 22c14-6 28 4 46-2"
          pathLength={1}
          className="draw"
          style={{ "--d": "0.25s" } as React.CSSProperties}
        />
        <path
          d="M56 20l6 16M62 18l-4 20"
          pathLength={1}
          className="draw"
          style={{ "--d": "0.5s" } as React.CSSProperties}
        />
      </svg>

      <div className="space-y-1.5">
        <h3 className="font-soft text-xl font-medium text-danger">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-foreground-muted">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
}
