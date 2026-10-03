import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/Button";

function Fallback({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : "Error desconocido";

  return (
    <div
      role="alert"
      className="flex min-h-screen items-center justify-center bg-background p-6"
    >
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-8 text-center">
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
          className="mx-auto text-danger"
          aria-hidden="true"
        >
          <path d="M6 30C24 24 38 34 54 28" pathLength={1} className="draw" />
          <path
            d="M68 22c14-6 28 4 46-2"
            pathLength={1}
            className="draw"
            style={{ ["--d" as string]: "0.25s" }}
          />
          <path
            d="M56 20l6 16M62 18l-4 20"
            pathLength={1}
            className="draw"
            style={{ ["--d" as string]: "0.5s" }}
          />
        </svg>

        <h1 className="font-soft mt-5 text-2xl font-medium text-foreground">
          Algo salió mal
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          La aplicación encontró un error inesperado. Puedes intentar recargar
          la página.
        </p>
        <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-surface-muted p-3 text-left text-xs text-foreground-muted">
          {message}
        </pre>
        <Button onClick={resetErrorBoundary} className="mt-5">
          Reintentar
        </Button>
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
