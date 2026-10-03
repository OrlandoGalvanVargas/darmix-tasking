import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, options, placeholder, className, id, ...rest },
    ref,
  ) {
    const selectId = id ?? rest.name ?? undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="group space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={errorId}
            className={cn(
              "block w-full cursor-pointer appearance-none rounded-xl border bg-surface py-2.5 pl-3.5 pr-10 text-sm text-foreground",
              "transition-[border-color,box-shadow] duration-200",
              "focus:outline-none focus:ring-4",
              "disabled:cursor-not-allowed disabled:opacity-60",
              error
                ? "animate-shake border-danger focus:border-danger focus:ring-danger/15"
                : "border-border hover:border-foreground-muted/40 focus:border-primary focus:ring-primary/15",
              className,
            )}
            {...rest}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-foreground-muted transition-transform duration-300 ease-spring group-focus-within:rotate-180 group-focus-within:text-primary"
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
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>

        {error && (
          <p
            id={errorId}
            aria-live="polite"
            className="text-xs font-medium text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
