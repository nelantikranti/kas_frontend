"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { hrAPI } from "@/lib/api";
import AttendanceTodayCard from "@/components/hr/AttendanceTodayCard";
import { can, getUserPermissions, isAdmin, PERMISSIONS } from "@/lib/permissions";
import {
  IoPeople,
  IoPersonAdd,
  IoCalendar,
  IoTime,
  IoBriefcase,
  IoDocumentText,
  IoClipboard,
  IoStatsChart,
  IoList,
  IoChevronForward,
  IoCheckmarkCircle,
  IoNotifications,
} from "react-icons/io5";

type HrStats = {
  activeEmployees: number;
  pendingSignups: number;
  pendingLeave: number;
  todayAttendance: number;
  canManage: boolean;
};

type QuickModule = {
  title: string;
  href: string;
  desc: string;
  icon: React.ReactNode;
  accent: string;
};

export default function HrHubPage() {
  const perms = getUserPermissions();
  const canManage = can(PERMISSIONS.HR_VIEW, perms);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<HrStats>({
    activeEmployees: 0,
    pendingSignups: 0,
    pendingLeave: 0,
    todayAttendance: 0,
    canManage: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.name || u.email || "there");
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    hrAPI
      .getDashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = useMemo(() => {
    if (canManage) {
      return [
        {
          title: "Active staff",
          value: stats.activeEmployees,
          icon: <IoPeople className="w-6 h-6" />,
          trend: "Employees on record",
          color: "green" as const,
        },
        {
          title: "Pending signups",
          value: stats.pendingSignups,
          icon: <IoPersonAdd className="w-6 h-6" />,
          trend: "Awaiting approval",
          color: "orange" as const,
        },
        {
          title: "Pending leave",
          value: stats.pendingLeave,
          icon: <IoCalendar className="w-6 h-6" />,
          trend: "Requests to review",
          color: "purple" as const,
        },
        {
          title: "Today attendance",
          value: stats.todayAttendance,
          icon: <IoTime className="w-6 h-6" />,
          trend: "Checked in today",
          color: "blue" as const,
        },
      ];
    }
    return [
      {
        title: "My pending leave",
        value: stats.pendingLeave,
        icon: <IoCalendar className="w-6 h-6" />,
        trend: "Awaiting decision",
        color: "purple" as const,
      },
      {
        title: "Today (me)",
        value: stats.todayAttendance,
        icon: <IoCheckmarkCircle className="w-6 h-6" />,
        trend: "Attendance status",
        color: "green" as const,
      },
    ];
  }, [canManage, stats]);

  const modules = [
    {
      title: "Employees",
      href: "/dashboard/hr/employees",
      show: can(PERMISSIONS.HR_VIEW, perms),
      desc: "Profiles, departments & managers",
      icon: <IoPeople className="w-7 h-7" />,
      accent: "from-green-500 to-emerald-600",
    },
    {
      title: "Onboarding",
      href: "/dashboard/hr/onboarding",
      show: can(PERMISSIONS.HR_ONBOARDING_MANAGE, perms),
      desc: "Checklists & document uploads",
      icon: <IoDocumentText className="w-7 h-7" />,
      accent: "from-blue-500 to-indigo-600",
    },
    {
      title: "Leave",
      href: "/dashboard/hr/leave",
      show: can(PERMISSIONS.HR_LEAVE_VIEW, perms) || can(PERMISSIONS.HR_LEAVE_REQUEST, perms),
      desc: "Apply, approve & track leave",
      icon: <IoCalendar className="w-7 h-7" />,
      accent: "from-violet-500 to-purple-600",
    },
    {
      title: "Attendance",
      href: "/dashboard/hr/attendance",
      show: can(PERMISSIONS.HR_ATTENDANCE_VIEW, perms) || can(PERMISSIONS.HR_ATTENDANCE_SELF, perms),
      desc: "Check-in & attendance records",
      icon: <IoTime className="w-7 h-7" />,
      accent: "from-amber-500 to-orange-600",
    },
    {
      title: "Timesheets",
      href: "/dashboard/hr/timesheets",
      show: can(PERMISSIONS.HR_TIMESHEET_VIEW, perms) || can(PERMISSIONS.HR_TIMESHEET_SUBMIT, perms),
      desc: "Hours logged & workload",
      icon: <IoClipboard className="w-7 h-7" />,
      accent: "from-cyan-500 to-teal-600",
    },
    {
      title: "Performance",
      href: "/dashboard/hr/performance",
      show: can(PERMISSIONS.VIEW_PERFORMANCE_REPORT, perms),
      desc: "KPIs, reports & export",
      icon: <IoStatsChart className="w-7 h-7" />,
      accent: "from-rose-500 to-pink-600",
    },
    {
      title: "Activity log",
      href: "/dashboard/activity",
      show: can(PERMISSIONS.ACTIVITY_VIEW, perms),
      desc: "System audit trail",
      icon: <IoList className="w-7 h-7" />,
      accent: "from-slate-500 to-gray-600",
    },
    {
      title: "Pending signups",
      href: "/dashboard/users",
      show: canManage && stats.pendingSignups > 0,
      desc: `${stats.pendingSignups} awaiting approval`,
      icon: <IoPersonAdd className="w-7 h-7" />,
      accent: "from-green-600 to-green-700",
    },
  ].filter((m) => m.show);

  const alerts = useMemo(() => {
    const items: { text: string; href: string; label: string }[] = [];
    if (canManage && stats.pendingSignups > 0) {
      items.push({
        text: `${stats.pendingSignups} staff signup${stats.pendingSignups === 1 ? "" : "s"} need approval`,
        href: "/dashboard/users",
        label: "Review signups",
      });
    }
    if (canManage && stats.pendingLeave > 0) {
      items.push({
        text: `${stats.pendingLeave} leave request${stats.pendingLeave === 1 ? "" : "s"} pending`,
        href: "/dashboard/hr/leave",
        label: "Review leave",
      });
    }
    return items;
  }, [canManage, stats.pendingSignups, stats.pendingLeave]);

  return (
    <div className="space-y-6 sm:space-y-8">
      <AttendanceTodayCard />
      {/* <div className="rounded-xl bg-gradient-to-r from-green-600 via-green-700 to-emerald-800 text-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Human Resources</p>
            <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-green-50/90 text-sm sm:text-base mt-2 max-w-xl">
              Welcome back{userName ? `, ${userName}` : ""}! Manage your team, leave, attendance, and HR operations from one place.
            </p>
          </div>
          <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur shrink-0">
            <IoBriefcase className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
          </div>
        </div>
      </div> */}

      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div
              key={a.href}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <IoNotifications className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-900">{a.text}</p>
              </div>
              <Link
                href={a.href}
                className="inline-flex items-center justify-center gap-1 text-sm font-medium text-amber-900 hover:text-amber-950 underline-offset-2 hover:underline shrink-0"
              >
                {a.label}
                <IoChevronForward className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-500">Loading HR dashboard…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <HrStatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Quick access</h2>
        <p className="text-sm text-gray-600 mb-4">Jump to HR modules and daily tasks</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:border-green-500 hover:shadow-md transition-all duration-200"
            >
              <div className={`h-1.5 bg-gradient-to-r ${m.accent}`} />
              <div className="p-5 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${m.accent} text-white shadow-sm`}
                  >
                    {m.icon}
                  </div>
                  <IoChevronForward className="w-5 h-5 text-gray-300 group-hover:text-green-600 transition-colors mt-1" />
                </div>
                <h3 className="font-semibold text-gray-900 mt-4">{m.title}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-1">{m.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-green-50 text-green-600 border-green-200",
  purple: "bg-purple-50 text-purple-600 border-purple-200",
  orange: "bg-orange-50 text-orange-600 border-orange-200",
  red: "bg-red-50 text-red-600 border-red-200",
};

function HrStatCard({
  title,
  value,
  icon,
  trend,
  color = "blue",
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: string;
  color?: keyof typeof colorClasses;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
