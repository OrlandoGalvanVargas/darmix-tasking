import type { KeyboardEvent, ReactNode } from "react";
import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  tone?: "primary" | "success" | "warning" | "info";
  className?: string;

  onActiveChange?: (active: boolean) => void;

  onSelect?: () => void;
  selected?: boolean;
}

const TONE_MAP = {
  primary: {
    glyph: "text-primary",
    edge: "hover:border-primary focus-visible:border-primary",
    edgeOn: "border-primary",
  },
  success: {
    glyph: "text-success",
    edge: "hover:border-success focus-visible:border-success",
    edgeOn: "border-success",
  },
  warning: {
    glyph: "text-warning",
    edge: "hover:border-warning focus-visible:border-warning",
    edgeOn: "border-warning",
  },
  info: {
    glyph: "text-info",
    edge: "hover:border-info focus-visible:border-info",
    edgeOn: "border-info",
  },
} as const;

export function StatCard({
  label,
  value,
  icon,
  tone = "primary",
  className,
  onActiveChange,
  onSelect,
  selected = false,
}: StatCardProps) {
  const counted = useCountUp(typeof value === "number" ? value : 0, 900, 250);
  const shown = typeof value === "number" ? counted : value;
  const interactive = Boolean(onActiveChange || onSelect);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onSelect) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      tabIndex={interactive ? 0 : undefined}
      role={onSelect ? "button" : undefined}
      aria-pressed={onSelect ? selected : undefined}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      onPointerEnter={onActiveChange ? () => onActiveChange(true) : undefined}
      onPointerLeave={onActiveChange ? () => onActiveChange(false) : undefined}
      onFocus={onActiveChange ? () => onActiveChange(true) : undefined}
      onBlur={onActiveChange ? () => onActiveChange(false) : undefined}
      className={cn(
        "group flex flex-col gap-3 border-l-2 pl-4 transition-colors duration-300",
        selected ? TONE_MAP[tone].edgeOn : "border-border",
        interactive && TONE_MAP[tone].edge,
        onSelect && "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center transition-transform duration-500 ease-spring group-hover:scale-110",
            TONE_MAP[tone].glyph,
          )}
        >
          {icon}
        </span>
        <p className="text-sm text-foreground-muted">{label}</p>
      </div>
      <p className="font-soft font-serif text-5xl font-light leading-none tabular-nums text-foreground">
        {shown}
      </p>
    </div>
  );
}
