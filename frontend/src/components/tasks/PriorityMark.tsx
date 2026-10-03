import type { KeyboardEvent } from "react";
import { TASK_PRIORITY, type TaskPriority } from "@/constants/task";
import { cn } from "@/lib/cn";

const PRIORITIES = Object.keys(TASK_PRIORITY) as TaskPriority[];

const LEVEL: Record<TaskPriority, number> = { low: 1, medium: 2, high: 3 };

const TONE: Record<TaskPriority, string> = {
  low: "text-success",
  medium: "text-warning",
  high: "text-danger",
};

const BAR_HEIGHTS = [6, 10, 14] as const;

export function PriorityMark({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  const level = LEVEL[priority] ?? 1;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-3.5 items-end gap-0.5",
        TONE[priority] ?? TONE.low,
        className,
      )}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <span
          key={h}
          className={cn(
            "w-[3px] rounded-full bg-current transition-opacity",
            i < level ? "opacity-100" : "opacity-20",
          )}
          style={{ height: h }}
        />
      ))}
    </span>
  );
}

interface PrioritySwitchProps {
  value: TaskPriority;
  onChange: (next: TaskPriority) => void;
  ariaLabel?: string;
}

export function PrioritySwitch({
  value,
  onChange,
  ariaLabel = "Prioridad",
}: PrioritySwitchProps) {
  const index = PRIORITIES.indexOf(value);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (dir === 0) return;
    e.preventDefault();
    const nextIndex = (index + dir + PRIORITIES.length) % PRIORITIES.length;
    onChange(PRIORITIES[nextIndex]);
    e.currentTarget
      .querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [nextIndex]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className="grid grid-cols-3 gap-2"
    >
      {PRIORITIES.map((priority) => {
        const active = priority === value;
        return (
          <button
            key={priority}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(priority)}
            className={cn(
              "inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-2 text-sm font-medium transition-colors duration-200",
              active
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border text-foreground-muted hover:border-foreground-muted/40 hover:text-foreground",
            )}
          >
            <PriorityMark
              priority={priority}
              className={cn(!active && "opacity-60")}
            />
            {TASK_PRIORITY[priority].label}
          </button>
        );
      })}
    </div>
  );
}
