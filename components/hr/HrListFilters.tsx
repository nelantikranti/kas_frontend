"use client";

import { useRoles } from "@/hooks/useRoles";

type Props = {
  search: string;
  role: string;
  onSearchChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  searchPlaceholder?: string;
  /** Inline compact controls — matches HR tab button sizing */
  compact?: boolean;
  /** Fixed-width fields aligned with date pickers on filter rows */
  size?: "default" | "sm";
  hideLabels?: boolean;
  className?: string;
};

export default function HrListFilters({
  search,
  role,
  onSearchChange,
  onRoleChange,
  searchPlaceholder = "Search name or employee code…",
  compact = false,
  size = "default",
  hideLabels = false,
  className = "",
}: Props) {
  const { roles, loading } = useRoles();

  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-40 sm:w-44 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
        />
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-32 sm:w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
          disabled={loading}
        >
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const searchWidth = size === "sm" ? "w-[11.5rem]" : "w-full";
  const roleWidth = size === "sm" ? "w-[9.5rem]" : "w-full";
  const searchWrap = size === "sm" ? "" : "min-w-[200px] flex-1";
  const roleWrap = size === "sm" ? "" : "min-w-[160px]";

  const fieldMt = hideLabels ? "" : "mt-1";

  return (
    <div className={`flex flex-wrap gap-3 items-end ${className}`}>
      <div className={searchWrap}>
        {!hideLabels && <label className="text-xs font-medium text-gray-600">Search</label>}
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={`${fieldMt} ${searchWidth} px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500`}
        />
      </div>
      <div className={roleWrap}>
        {!hideLabels && <label className="text-xs font-medium text-gray-600">Role</label>}
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className={`${fieldMt} ${roleWidth} px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500`}
          disabled={loading}
        >
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
