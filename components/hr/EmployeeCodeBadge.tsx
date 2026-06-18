"use client";

import { toast } from "@/components/Toast";

type Props = {
  code?: string | null;
  className?: string;
};

const EMPLOYEE_CODE_PATTERN = /^\d{4,}$/;

export default function EmployeeCodeBadge({ code, className = "" }: Props) {
  const value = code?.trim();
  if (!value || !EMPLOYEE_CODE_PATTERN.test(value)) return null;

  return (
    <button
      type="button"
      title="Click to copy employee code"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast.success(`Copied ${value}`);
        } catch {
          toast.error("Could not copy");
        }
      }}
      className={`text-xs font-mono text-gray-500 hover:text-gray-800 hover:underline cursor-pointer ${className}`}
    >
      {value}
    </button>
  );
}
