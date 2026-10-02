import { Button } from "./Button";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  onChange: (page: number) => void;
  disabled?: boolean;
}

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
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
        >
          Anterior
        </Button>

        {pages.map((p, idx) =>
          p === "…" ? (
            <span
              key={`gap-${idx}`}
              className="px-2 text-sm text-foreground-muted"
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
              className={
                "min-w-9 rounded-lg border px-3 py-1.5 text-sm font-medium transition " +
                (p === currentPage
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-foreground hover:bg-surface-muted")
              }
            >
              {p}
            </button>
          ),
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(currentPage + 1)}
          disabled={disabled || currentPage >= lastPage}
        >
          Siguiente
        </Button>
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
