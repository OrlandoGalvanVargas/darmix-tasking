import { useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

export type LeafKind = "done" | "doing" | "todo";
export type BranchTone = "default" | "inverse";

interface GrowthBranchProps {
  pending: number;
  inProgress: number;
  completed: number;
  size?: "sm" | "lg";

  tone?: BranchTone;

  highlight?: LeafKind | null;

  reactive?: boolean;
  label?: string;
  className?: string;
}

const SIZES = {
  sm: { height: 44, amp: 3.5, leaf: 16, max: 14, stroke: 1.6 },
  lg: { height: 92, amp: 7, leaf: 26, max: 32, stroke: 2 },
} as const;

const LEAF_COLOR: Record<BranchTone, Record<LeafKind, string>> = {
  default: {
    done: "text-primary",
    doing: "text-info",
    todo: "text-foreground-muted",
  },
  inverse: {
    done: "text-primary-foreground",
    doing: "text-primary-foreground",
    todo: "text-primary-foreground/55",
  },
};

export function LeafGlyph({
  kind,
  size = 16,
  tone = "default",
  className,
}: {
  kind: LeafKind;
  size?: number;
  tone?: BranchTone;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(LEAF_COLOR[tone][kind], className)}
    >
      {kind === "done" && (
        <>
          <path
            d="M8 15C3.2 12 2 6.2 8 1c6 5.2 4.8 11 0 14Z"
            fill="currentColor"
          />
          <path
            d="M8 13.4V5"
            stroke={tone === "inverse" ? "var(--primary)" : "var(--surface)"}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
        </>
      )}
      {kind === "doing" && (
        <>
          <path d="M8 15C3.2 12 2 6.2 8 1Z" fill="currentColor" />
          <path
            d="M8 15C3.2 12 2 6.2 8 1c6 5.2 4.8 11 0 14Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </>
      )}
      {kind === "todo" && (
        <>
          <path
            d="M8 15v-3.2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <circle
            cx="8"
            cy="8.6"
            r="3.2"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        </>
      )}
    </svg>
  );
}

function allocate(counts: number[], cap: number): number[] {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total <= cap) return counts;

  const raw = counts.map((n) => (n / total) * cap);
  const base = raw.map(Math.floor);
  let left = cap - base.reduce((a, b) => a + b, 0);

  raw
    .map((r, idx) => ({ idx, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac)
    .forEach(({ idx }) => {
      if (left > 0) {
        base[idx] += 1;
        left -= 1;
      }
    });

  counts.forEach((n, idx) => {
    if (n > 0 && base[idx] === 0) {
      base[base.indexOf(Math.max(...base))] -= 1;
      base[idx] = 1;
    }
  });

  return base;
}

export function GrowthBranch({
  pending,
  inProgress,
  completed,
  size = "sm",
  tone = "default",
  highlight = null,
  reactive = false,
  label,
  className,
}: GrowthBranchProps) {
  const cfg = SIZES[size];
  const mid = cfg.height / 2;
  const stemY = (x: number) =>
    mid + cfg.amp * Math.sin((x / 100) * Math.PI * 3);

  const path = useMemo(() => {
    const pts: string[] = [];
    for (let x = 0; x <= 100; x += 2) {
      const y = cfg.height / 2 + cfg.amp * Math.sin((x / 100) * Math.PI * 3);
      pts.push(`${x},${y.toFixed(2)}`);
    }
    return `M${pts.join(" L")}`;
  }, [cfg]);

  const [c, i, p] = allocate(
    [Math.max(0, completed), Math.max(0, inProgress), Math.max(0, pending)],
    cfg.max,
  );
  const kinds: LeafKind[] = [
    ...Array<LeafKind>(c).fill("done"),
    ...Array<LeafKind>(i).fill("doing"),
    ...Array<LeafKind>(p).fill("todo"),
  ];
  const n = kinds.length;
  const xAt = (k: number) => 6 + (88 * (k + 0.5)) / n;

  const grown =
    n === 0 ? 0 : c > 0 ? Math.min(1, (xAt(c - 1) + 4) / 100) : 0.03;
  const total = completed + inProgress + pending;
  const offset = cfg.leaf * 0.56 + 1;
  const inverse = tone === "inverse";

  return (
    <div
      role="img"
      aria-label={
        label ??
        `${completed} de ${total} ${total === 1 ? "tarea completada" : "tareas completadas"}`
      }
      className={cn("relative w-full", className)}
      style={{ height: cfg.height }}
    >
      <svg
        viewBox={`0 0 100 ${cfg.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth={cfg.stroke}
          strokeLinecap="round"
          className={
            inverse ? "text-primary-foreground/25" : "text-foreground-muted/30"
          }
        />
        {n > 0 && (
          <path
            d={path}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={cfg.stroke}
            strokeLinecap="round"
            className={cn(
              "stem-grow",
              inverse ? "text-primary-foreground" : "text-primary",
            )}
            style={{ strokeDashoffset: 1 - grown }}
          />
        )}
      </svg>

      {kinds.map((kind, k) => {
        const x = xAt(k);
        const up = k % 2 === 0;
        const y = stemY(x) + (up ? -offset : offset);
        const dimmed = highlight !== null && highlight !== kind;
        const active = highlight === kind;
        const delay = reactive ? (k % 6) * 30 : 350 + k * 45;

        return (
          <span
            key={k}
            aria-hidden="true"
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 transition-[opacity,scale] duration-300",
              dimmed && "opacity-20",
              active && "scale-125",
            )}
            style={{ left: `${x}%`, top: y, width: cfg.leaf, height: cfg.leaf }}
          >
            <span
              key={reactive ? kind : undefined}
              className="leaf-pop block h-full w-full"
              style={{ "--delay": `${delay}ms` } as CSSProperties}
            >
              <span
                className="leaf-sway block h-full w-full"
                style={
                  {
                    "--delay": `${(k % 5) * 160}ms`,
                    rotate: up ? "35deg" : "145deg",
                  } as CSSProperties
                }
              >
                <LeafGlyph kind={kind} size={cfg.leaf} tone={tone} />
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
