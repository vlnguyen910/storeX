import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FieldShell({ label, error, hint, children }: FieldShellProps) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      {children}
      {error ? <span className="text-[0.82rem] text-danger">{error}</span> : null}
      {!error && hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "min-h-[46px] w-full rounded-[11px] border border-slate-300 bg-white px-3 text-ink outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10",
          className,
        )}
        {...props}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "min-h-[46px] w-full rounded-[11px] border border-slate-300 bg-white px-3 text-ink outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
