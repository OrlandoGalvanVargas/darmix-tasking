import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, className, id, ...rest }, ref) {
    const textareaId = id ?? rest.name ?? undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const hintId = hint && !error ? `${textareaId}-hint` : undefined;

    return (
      <div className="group space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
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
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={cn(errorId, hintId) || undefined}
          className={cn(
            "block max-h-64 min-h-24 w-full resize-y rounded-xl border bg-surface px-3.5 py-2.5 text-sm leading-relaxed text-foreground caret-accent field-sizing-content",
            "placeholder:text-foreground-muted/50",
            "transition-[border-color,box-shadow] duration-200",
            "focus:outline-none focus:ring-4",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error
              ? "animate-shake border-danger focus:border-danger focus:ring-danger/15"
              : "border-border hover:border-foreground-muted/40 focus:border-primary focus:ring-primary/15",
            className,
          )}
          {...rest}
        />
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
  },
);

Textarea.displayName = "Textarea";
