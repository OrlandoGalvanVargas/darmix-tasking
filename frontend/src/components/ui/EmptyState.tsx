import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const DEFAULT_ILLUSTRATION = (
  <svg
    width="168"
    height="132"
    viewBox="0 0 168 132"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path
      d="M24 118h120"
      pathLength={1}
      stroke="currentColor"
      className="draw text-border"
      style={{ "--d": "0s" } as React.CSSProperties}
    />
    <path
      d="M58 80h52l-7 38H65Z"
      pathLength={1}
      stroke="currentColor"
      className="draw text-accent"
      style={{ "--d": "0.15s" } as React.CSSProperties}
    />
    <path
      d="M54 80h60"
      pathLength={1}
      stroke="currentColor"
      className="draw text-accent"
      style={{ "--d": "0.3s" } as React.CSSProperties}
    />
    <path
      d="M84 80C84 66 84 56 84 44"
      pathLength={1}
      stroke="currentColor"
      className="draw text-primary"
      style={{ "--d": "0.55s" } as React.CSSProperties}
    />
    <path
      d="M84 62C70 62 61 54 59 43c12 0 23 6 25 19Z"
      pathLength={1}
      stroke="currentColor"
      className="draw text-primary"
      style={{ "--d": "0.85s" } as React.CSSProperties}
    />
    <path
      d="M84 50c12 0 22-8 24-20-12 0-22 8-24 20Z"
      pathLength={1}
      stroke="currentColor"
      className="draw text-primary"
      style={{ "--d": "1.1s" } as React.CSSProperties}
    />
  </svg>
);

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-5 rounded-card border border-dashed border-border bg-surface/40 px-6 py-14 text-center">
      <div className="flex items-center justify-center text-primary">
        {icon ?? DEFAULT_ILLUSTRATION}
      </div>
      <div className="space-y-2">
        <h3 className="font-soft text-2xl font-medium text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-foreground-muted">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
