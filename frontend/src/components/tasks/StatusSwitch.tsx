import type { KeyboardEvent } from "react";
import { LeafGlyph, type LeafKind } from "@/components/projects/GrowthBranch";
import { TASK_STATUS, type TaskStatus } from "@/constants/task";
import { cn } from "@/lib/cn";

const STATUSES = Object.keys(TASK_STATUS) as TaskStatus[];

const KIND: Record<TaskStatus, LeafKind> = {
  pending: "todo",
  in_progress: "doing",
  completed: "done",
};

interface StatusSwitchProps {
  value: TaskStatus;
  onChange: (next: TaskStatus) => void;

  labels?: "active" | "all";
  size?: number;
  ariaLabel?: string;
  className?: string;
}

export function StatusSwitch({
  value,
  onChange,
  labels = "active",
  size = 16,
  ariaLabel = "Estado",
  className,
}: StatusSwitchProps) {
  const index = STATUSES.indexOf(value);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (dir === 0) return;
    e.preventDefault();
    const nextIndex = (index + dir + STATUSES.length) % STATUSES.length;
    onChange(STATUSES[nextIndex]);
    e.currentTarget
      .querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [nextIndex]?.focus();
  };

  const compact = labels === "active";

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        compact ? "inline-flex items-center gap-0.5" : "grid grid-cols-3 gap-2",
        className,
      )}
    >
      {STATUSES.map((status) => {
        const active = status === value;
        const label = TASK_STATUS[status].label;

        return (
          <button
            key={status}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(status)}
            className={cn(
              "inline-flex items-center justify-center rounded-lg text-xs font-medium transition-colors duration-200",
              compact
                ? cn(
                    "h-8 px-2",
                    active
                      ? "bg-surface-muted text-foreground"
                      : "text-foreground-muted hover:bg-surface-muted/70 hover:text-foreground",
                  )
                : cn(
                    "h-10 border px-2 text-sm",
                    active
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-foreground-muted hover:border-foreground-muted/40 hover:text-foreground",
                  ),
            )}
          >
            <span
              className={cn(
                "block shrink-0 transition-[scale,opacity] duration-300",
                active ? "scale-110" : "opacity-50",
              )}
            >
              <span className={cn("block", active && "leaf-pop")}>
                <LeafGlyph kind={KIND[status]} size={size} />
              </span>
            </span>
            <span
              className={cn(
                compact
                  ? cn(
                      "overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-300",
                      active
                        ? "ml-1.5 max-w-28 opacity-100"
                        : "ml-0 max-w-0 opacity-0",
                    )
                  : "ml-2 truncate",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
