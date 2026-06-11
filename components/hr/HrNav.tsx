"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  can,
  getUserPermissions,
  isAdmin,
  isHrManagerRole,
  PERMISSIONS,
} from "@/lib/permissions";

const hrManagerLinks = [
  { href: "/dashboard/hr", label: "Overview", anyOf: [PERMISSIONS.HR_VIEW] },
  { href: "/dashboard/hr/employees", label: "Employees", perm: PERMISSIONS.HR_VIEW },
  { href: "/dashboard/hr/onboarding", label: "Onboarding", perm: PERMISSIONS.HR_ONBOARDING_MANAGE },
  { href: "/dashboard/hr/leave", label: "Leave", anyOf: [PERMISSIONS.HR_LEAVE_VIEW, PERMISSIONS.HR_LEAVE_MANAGE] },
  { href: "/dashboard/hr/attendance", label: "Attendance", anyOf: [PERMISSIONS.HR_ATTENDANCE_VIEW, PERMISSIONS.HR_ATTENDANCE_MANAGE] },
  { href: "/dashboard/hr/timesheets", label: "Timesheets", anyOf: [PERMISSIONS.HR_TIMESHEET_VIEW, PERMISSIONS.HR_TIMESHEET_MANAGE] },
  { href: "/dashboard/hr/performance", label: "Performance", perm: PERMISSIONS.VIEW_PERFORMANCE_REPORT },
];

/** Staff self-service — no HR branding, no attendance tab (check-in is on main dashboard) */
const employeeServiceLinks = [
  { href: "/dashboard/hr/leave", label: "Leave", anyOf: [PERMISSIONS.HR_LEAVE_REQUEST] },
  { href: "/dashboard/hr/timesheets", label: "Timesheets", anyOf: [PERMISSIONS.HR_TIMESHEET_SUBMIT] },
  { href: "/dashboard/hr/payslip", label: "Payslip", perm: PERMISSIONS.HR_PAYSLIP_SELF },
];

function readUserRole(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem("user");
    return raw ? String(JSON.parse(raw).role || "").trim() : "";
  } catch {
    return "";
  }
}

type HrNavProps = {
  trailing?: ReactNode;
};

export default function HrNav({ trailing }: HrNavProps) {
  const pathname = usePathname();
  const perms = getUserPermissions();
  const role = readUserRole();
  const hrManager = isHrManagerRole(role, perms);

  if (isAdmin() && !trailing) return null;

  const linkSet = hrManager ? hrManagerLinks : employeeServiceLinks;
  const visible = linkSet.filter((l) => {
    if (l.anyOf) return l.anyOf.some((p) => can(p, perms));
    if (l.perm) return can(l.perm, perms);
    return false;
  });

  if (visible.length === 0 && !trailing) return null;

  return (
    <nav className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3 mb-4">
      <div className="flex flex-wrap gap-2 flex-1 min-w-0">
        {visible.map((l) => {
          const active =
            pathname === l.href ||
            (l.href !== "/dashboard/hr" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                active ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
      {trailing ? <div className="flex flex-wrap items-center gap-2 shrink-0">{trailing}</div> : null}
    </nav>
  );
}
