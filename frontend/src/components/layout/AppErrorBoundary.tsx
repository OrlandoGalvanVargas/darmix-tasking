import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : "Error desconocido";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-6 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          Algo salió mal
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          La aplicación encontró un error inesperado. Puedes intentar recargar
          la página.
        </p>
        <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-surface-muted p-3 text-left text-xs text-foreground-muted">
          {message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-hover"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={Fallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}
