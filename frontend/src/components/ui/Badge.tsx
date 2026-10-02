import type { ReactNode } from "react";
import type { Tone } from "@/constants/task";
import { cn } from "@/lib/cn";

interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

const TONE_MAP: Record<Tone, string> = {
  neutral: "bg-surface-muted text-foreground-muted",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONE_MAP[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
