import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  icon?: string;
  placeholder?: string;
  value: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  // 입력을 시작했는데 조건을 만족하지 못할 때 보여줄 오류 문구
  errorMessage?: string | null;
  // 입력칸 오른쪽에 붙는 버튼 (중복 확인 등)
  action?: ReactNode;
  onChange?: (value: string) => void;
}

export function FormField({
  id,
  label,
  type = "text",
  icon,
  placeholder,
  value,
  disabled,
  readOnly,
  autoComplete,
  errorMessage,
  action,
  onChange,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border bg-white px-3 py-2.5",
          errorMessage ? "border-red-400" : "border-gray-200",
          (disabled || readOnly) && "bg-gray-100",
        )}
      >
        {icon && <img src={icon} alt="" className="h-4 w-4 opacity-50" />}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? errorId : undefined}
          onChange={(event) => onChange?.(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none disabled:text-gray-400 read-only:text-gray-500"
        />
        {action}
      </div>
      {errorMessage && (
        <p id={errorId} className="text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
