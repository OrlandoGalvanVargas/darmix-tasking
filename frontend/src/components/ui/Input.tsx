import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightSlot, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name ?? undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const hintId = hint && !error ? `${inputId}-hint` : undefined;

  return (
    <div className="group space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium transition-colors duration-200",
            error
              ? "text-danger"
              : "text-foreground group-focus-within:text-primary",
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 transition-colors",
              error ? "text-danger" : "text-foreground-muted",
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={cn(errorId, hintId) || undefined}
          className={cn(
            "block w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-foreground caret-accent",
            "placeholder:text-foreground-muted/50",
            "transition-[border-color,box-shadow] duration-200",
            "focus:outline-none focus:ring-4",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error
              ? "animate-shake border-danger focus:border-danger focus:ring-danger/15"
              : "border-border hover:border-foreground-muted/40 focus:border-primary focus:ring-primary/15",
            Boolean(leftIcon) && "pl-10",
            Boolean(rightSlot) && "pr-11",
            className,
          )}
          {...rest}
        />

        {rightSlot && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-2">
            {rightSlot}
          </span>
        )}
      </div>

      {error ? (
        <p
          id={errorId}
          aria-live="polite"
          className="text-xs font-medium text-danger"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-foreground-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = "Input";
