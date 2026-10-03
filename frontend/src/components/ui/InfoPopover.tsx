import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

interface InfoPopoverProps {
  children: ReactNode;
  label?: string;
  side?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
}

export function InfoPopover({
  children,
  label = "Más información",
  side = "bottom",
  align = "end",
  className,
}: InfoPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const popover = popoverRef.current;
    const anchor = ref.current;
    if (!open || !popover || !anchor) return;

    const margin = 12;
    const a = anchor.getBoundingClientRect();
    const w = popover.offsetWidth;
    const left =
      align === "end"
        ? a.right - w
        : align === "start"
          ? a.left
          : a.left + a.width / 2 - w / 2;

    let dx = 0;
    if (left < margin) dx = margin - left;
    else if (left + w > window.innerWidth - margin) {
      dx = window.innerWidth - margin - (left + w);
    }

    popover.style.translate =
      dx === 0
        ? ""
        : align === "center"
          ? `calc(-50% + ${dx}px) 0`
          : `${dx}px 0`;
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-expanded={open}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full",
          "text-current opacity-70 transition hover:opacity-100",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        )}
      >
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
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={label}
          className={cn(
            "animate-pop-in absolute z-50 w-72 max-w-[calc(100vw-1.5rem)] rounded-xl border border-border bg-surface p-4 text-left shadow-xl",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",

            side === "top"
              ? align === "end"
                ? "origin-bottom-right"
                : align === "start"
                  ? "origin-bottom-left"
                  : "origin-bottom"
              : align === "end"
                ? "origin-top-right"
                : align === "start"
                  ? "origin-top-left"
                  : "origin-top",
            align === "end" && "right-0",
            align === "start" && "left-0",
            align === "center" && "left-1/2 -translate-x-1/2",
            className,
          )}
        >
          <div className="text-sm text-foreground">{children}</div>
        </div>
      )}
    </div>
  );
}
