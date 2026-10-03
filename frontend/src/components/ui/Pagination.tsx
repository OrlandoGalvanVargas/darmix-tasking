import { cn } from "@/lib/cn";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  onChange: (page: number) => void;
  disabled?: boolean;
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const STEP_BUTTON =
  "inline-flex h-9 items-center gap-1 rounded-full px-3 text-sm font-medium text-foreground-muted transition hover:bg-surface-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent";

export function Pagination({
  currentPage,
  lastPage,
  total,
  from,
  to,
  onChange,
  disabled = false,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = buildPageList(currentPage, lastPage);

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-foreground-muted">
        Mostrando <strong className="text-foreground">{from ?? 0}</strong>–
        <strong className="text-foreground">{to ?? 0}</strong> de{" "}
        <strong className="text-foreground">{total}</strong>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={STEP_BUTTON}
          onClick={() => onChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          aria-label="Página anterior"
        >
          <Chevron dir="left" />
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`gap-${idx}`}
              className="px-1.5 text-sm text-foreground-muted"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => onChange(p)}
              aria-current={p === currentPage ? "page" : undefined}
              aria-label={`Página ${p}`}
              className={cn(
                "grid h-9 min-w-9 place-items-center rounded-full px-2 font-serif text-base tabular-nums transition-all duration-300 ease-spring",
                p === currentPage
                  ? "scale-110 bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-surface-muted",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          className={STEP_BUTTON}
          onClick={() => onChange(currentPage + 1)}
          disabled={disabled || currentPage >= lastPage}
          aria-label="Página siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <Chevron dir="right" />
        </button>
      </div>
    </nav>
  );
}

function buildPageList(current: number, last: number): Array<number | "…"> {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const pages: Array<number | "…"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);

  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < last - 1) pages.push("…");
  pages.push(last);

  return pages;
}
