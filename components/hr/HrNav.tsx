"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { can, getUserPermissions, isAdmin, PERMISSIONS } from "@/lib/permissions";

const links = [
  { href: "/dashboard/hr", label: "Overview", anyOf: [PERMISSIONS.HR_VIEW, PERMISSIONS.HR_LEAVE_REQUEST] },
  { href: "/dashboard/hr/employees", label: "Employees", perm: PERMISSIONS.HR_VIEW },
  { href: "/dashboard/hr/onboarding", label: "Onboarding", perm: PERMISSIONS.HR_ONBOARDING_MANAGE },
  { href: "/dashboard/hr/leave", label: "Leave", anyOf: [PERMISSIONS.HR_LEAVE_VIEW, PERMISSIONS.HR_LEAVE_REQUEST] },
  { href: "/dashboard/hr/attendance", label: "Attendance", anyOf: [PERMISSIONS.HR_ATTENDANCE_VIEW, PERMISSIONS.HR_ATTENDANCE_MANAGE] },
  { href: "/dashboard/hr/timesheets", label: "Timesheets", anyOf: [PERMISSIONS.HR_TIMESHEET_VIEW, PERMISSIONS.HR_TIMESHEET_SUBMIT] },
  { href: "/dashboard/hr/performance", label: "Performance", perm: PERMISSIONS.VIEW_PERFORMANCE_REPORT },
];

export default function HrNav() {
  const pathname = usePathname();
  const perms = getUserPermissions();

  if (isAdmin()) return null;

  const visible = links.filter((l) => {
    if (l.anyOf) return l.anyOf.some((p) => can(p, perms));
    if (l.perm) return can(l.perm, perms);
    return true;
  });

  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 mb-4">
      {visible.map((l) => {
        const active = pathname === l.href || (l.href !== "/dashboard/hr" && pathname.startsWith(l.href));
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
    </nav>
  );
}
