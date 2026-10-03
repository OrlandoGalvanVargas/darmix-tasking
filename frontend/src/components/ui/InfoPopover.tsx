import { useEffect, useRef, useState, type ReactNode } from "react";
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
          role="dialog"
          aria-label={label}
          className={cn(
            "absolute z-50 w-72 rounded-xl border border-border bg-surface p-4 text-left shadow-xl",
            "animate-fade-in-up",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
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
