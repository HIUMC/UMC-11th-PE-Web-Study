import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  action?: ReactNode;
};

export function FormField({ id, label, hint, error, action, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-900">{label}</label>
      <div className={cn(
        "flex min-h-12 items-center rounded-lg border bg-white transition focus-within:border-blue-600 focus-within:ring-3 focus-within:ring-blue-100",
        error ? "border-red-400" : "border-slate-200",
      )}>
        <input {...props} id={id} aria-invalid={Boolean(error)}
          aria-describedby={error || hint ? `${id}-message` : undefined}
          className="h-12 min-w-0 flex-1 rounded-lg bg-transparent px-4 text-sm outline-none placeholder:text-slate-400 disabled:text-slate-500" />
        {action}
      </div>
      {(error || hint) && <p id={`${id}-message`} className={cn("mt-2 text-xs leading-5", error ? "text-red-600" : "text-slate-500")}>{error || hint}</p>}
    </div>
  );
}

export const primaryButtonClass = "flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300";
