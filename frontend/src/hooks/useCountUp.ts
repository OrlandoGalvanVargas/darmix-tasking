import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, duration = 900, delay = 0): number {
  const [value, setValue] = useState(0);
  const current = useRef(0);

  useEffect(() => {
    const from = current.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    let startAt = 0;

    const tick = (now: number) => {
      if (!startAt) startAt = now + delay;
      const progress =
        reduce || duration <= 0
          ? 1
          : Math.min(1, Math.max(0, (now - startAt) / duration));
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);
      current.current = next;
      setValue(next);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);

  return value;
}
