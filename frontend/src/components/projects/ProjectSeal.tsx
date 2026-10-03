import { cn } from "@/lib/cn";

interface ProjectSealProps {
  name: string;

  id?: number;
  size?: "md" | "lg";

  live?: boolean;
  className?: string;
}

const TONES = [
  "border-primary/40 bg-primary/10 text-primary",
  "border-accent/40 bg-accent-soft text-accent",
  "border-info/40 bg-info-soft text-info",
  "border-warning/40 bg-warning-soft text-warning",
] as const;

const NEUTRAL = "border-border bg-surface-muted text-foreground-muted";

const SIZES = {
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "··";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function ProjectSeal({
  name,
  id,
  size = "md",
  live = false,
  className,
}: ProjectSealProps) {
  const initials = getInitials(name);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border font-serif font-semibold",
        id === undefined ? NEUTRAL : TONES[id % TONES.length],
        SIZES[size],
        className,
      )}
    >
      <span className="absolute inset-[3px] rounded-full border border-dashed border-current opacity-40" />
      <span
        key={live ? initials : undefined}
        className={cn(live && "animate-pop-in")}
      >
        {initials}
      </span>
    </span>
  );
}
