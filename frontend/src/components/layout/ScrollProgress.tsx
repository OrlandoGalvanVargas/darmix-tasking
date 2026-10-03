import type { CSSProperties } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const STEM_X = 24;
const wave = (y: number) => STEM_X + 3.2 * Math.sin((y / 1000) * Math.PI * 6);

const STEM_PATH = (() => {
  const pts: string[] = [];
  for (let y = 0; y <= 1000; y += 20) pts.push(`${wave(y).toFixed(2)},${y}`);
  return `M${pts.join(" L")}`;
})();

const LEAVES = [
  { at: 8, side: -1 },
  { at: 22, side: 1 },
  { at: 36, side: -1 },
  { at: 50, side: 1 },
  { at: 64, side: -1 },
  { at: 78, side: 1 },
  { at: 92, side: -1 },
] as const;

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div aria-hidden="true" className="pointer-events-none">
      {}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent min-[1180px]:hidden">
        <div
          className="h-full bg-primary transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {}
      <div className="fixed bottom-6 left-3 top-20 z-20 hidden w-12 min-[1180px]:block">
        <svg
          viewBox="0 0 48 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <path
            d={STEM_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-foreground-muted/25"
          />
          <path
            d={STEM_PATH}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-primary"
            style={
              {
                strokeDasharray: 1,
                strokeDashoffset: 1 - progress / 100,
                transition: "stroke-dashoffset 120ms linear",
              } as CSSProperties
            }
          />
        </svg>

        {LEAVES.map(({ at, side }) => (
          <span
            key={at}
            className="absolute block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-spring"
            style={{
              top: `${at}%`,
              left: `calc(50% + ${side * 8}px)`,
              scale: progress >= at ? 1 : 0,
              rotate: `${side * 48}deg`,
            }}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
              <path
                d="M8 15C3.2 12 2 6.2 8 1c6 5.2 4.8 11 0 14Z"
                fill="currentColor"
                className="text-primary"
              />
            </svg>
          </span>
        ))}

        {}
        <span
          className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{
            top: `${progress}%`,
            left: `${(wave(progress * 10) / 48) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
