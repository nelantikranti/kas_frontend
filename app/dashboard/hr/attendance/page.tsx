"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import HrNav from "@/components/hr/HrNav";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import {
  canEditAttendanceTimes,
  canViewAttendanceList,
  getEffectivePermissions,
  getDashboardHomePath,
  getUserPermissions,
  isAdmin,
} from "@/lib/permissions";
import { todayLocalDate } from "@/lib/dateLocal";
import { downloadBlob } from "@/lib/hrShare";
import {
  buildAttendanceWorkbook,
  computeAttendanceSummary,
  resolveExportRange,
  type AttendanceExportRow,
  type LeaveExportRow,
} from "@/lib/attendanceExport";
import { formatInr } from "@/components/hr/hrDocumentUtils";
import {
  computeAttendancePayroll,
  computeMonthlyPackage,
  type SalaryComponentsInput,
} from "@/lib/payrollCalculation";
import {
  IoTime,
  IoPeople,
  IoCalendar,
  IoCreateOutline,
  IoDownloadOutline,
  IoWalletOutline,
  IoCalendarNumberOutline,
  IoCheckmarkCircleOutline,
  IoLeafOutline,
  IoCloseCircleOutline,
  IoBedOutline,
  IoGiftOutline,
  IoRemoveCircleOutline,
  IoAlarmOutline,
} from "react-icons/io5";
import EmployeeCodeBadge from "@/components/hr/EmployeeCodeBadge";
import { sortByEmployeeCode } from "@/lib/employeeSort";
import Modal from "@/components/Modal";
import { useRoles } from "@/hooks/useRoles";

type Row = {
  id: string;
  userId: string;
  userName: string;
  role?: string;
  employeeId?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
};

type EmployeeOption = {
  id: string;
  name: string;
  employeeId?: string;
  role: string;
  joinDate?: string | null;
};

const FILTER_INPUT =
  "block mt-1 h-9 px-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500";
const TABLE_PAGE_SIZE = 75;

function resolveSummaryRange(
  from: string,
  to: string,
  joinDate?: string | null
): { start: string; end: string; label: string } {
  const end = to || todayLocalDate();
  if (from && to) {
    return { start: from, end: to, label: `${formatReportDate(from)} – ${formatReportDate(to)}` };
  }
  if (from) {
    return { start: from, end, label: `from ${formatReportDate(from)}` };
  }
  if (to) {
    const start = joinDate || "2000-01-01";
    return { start, end: to, label: `until ${formatReportDate(to)}` };
  }
  const start = joinDate || "2000-01-01";
  return { start, end, label: "all" };
}

function apiDateRange(
  from: string,
  to: string,
  employeeId: string,
  joinDate?: string | null
) {
  if (from || to) {
    return { from: from || undefined, to: to || undefined };
  }
  if (employeeId && joinDate) {
    return { from: joinDate, to: undefined };
  }
  return { from: undefined, to: undefined };
}

type StatTone = "emerald" | "blue" | "green" | "teal" | "rose" | "indigo" | "amber" | "orange" | "red";

const STAT_TONE: Record<StatTone, { wrap: string; icon: string }> = {
  emerald: { wrap: "bg-emerald-50 border-emerald-100 text-emerald-600", icon: "text-emerald-600" },
  blue: { wrap: "bg-blue-50 border-blue-100 text-blue-600", icon: "text-blue-600" },
  green: { wrap: "bg-green-50 border-green-100 text-green-600", icon: "text-green-600" },
  teal: { wrap: "bg-teal-50 border-teal-100 text-teal-600", icon: "text-teal-600" },
  rose: { wrap: "bg-rose-50 border-rose-100 text-rose-600", icon: "text-rose-600" },
  indigo: { wrap: "bg-indigo-50 border-indigo-100 text-indigo-600", icon: "text-indigo-600" },
  amber: { wrap: "bg-amber-50 border-amber-100 text-amber-600", icon: "text-amber-600" },
  orange: { wrap: "bg-orange-50 border-orange-100 text-orange-600", icon: "text-orange-600" },
  red: { wrap: "bg-red-50 border-red-100 text-red-600", icon: "text-red-600" },
};

function EmployeeStatCard({
  label,
  value,
  icon,
  tone,
  compactValue,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone: StatTone;
  compactValue?: boolean;
}) {
  const styles = STAT_TONE[tone];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${styles.wrap}`}
      >
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 leading-snug">{label}</p>
        <p
          className={`font-bold text-gray-900 tabular-nums leading-tight mt-0.5 ${
            compactValue ? "text-sm" : "text-lg"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
function formatReportDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function effectiveRangeLabel(from: string, to: string) {
  if (from && to) return `${formatReportDate(from)} – ${formatReportDate(to)}`;
  if (from) return `from ${formatReportDate(from)}`;
  if (to) return `until ${formatReportDate(to)}`;
  return "all";
}

function formatTime(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function workDuration(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return "—";
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  if (ms <= 0) return "—";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function readCurrentUser(): { id: string; role: string } {
  try {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : {};
    return { id: String(user.id || user._id || ""), role: String(user.role || "") };
  } catch {
    return { id: "", role: "" };
  }
}

function isoToTimeInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function timeInputToIso(dateStr: string, timeStr: string) {
  if (!timeStr) return null;
  const d = new Date(`${dateStr}T${timeStr}:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export default function HrAttendancePage() {
  const router = useRouter();
  const { roles, loading: rolesLoading } = useRoles();
  const perms = getUserPermissions();
  const admin = isAdmin();
  const canViewAll = canViewAttendanceList(undefined, perms) || admin;

  const [rows, setRows] = useState<Row[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedFrom, setDebouncedFrom] = useState("");
  const [debouncedTo, setDebouncedTo] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const hasLoadedRef = useRef(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [leaves, setLeaves] = useState<LeaveExportRow[]>([]);
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponentsInput | null>(null);

  const currentUser = readCurrentUser();
  const canEditTimes = (rowUserId: string) =>
    canEditAttendanceTimes(currentUser.role, currentUser.id, rowUserId);

  useEffect(() => {
    if (!canViewAll) {
      try {
        const raw = localStorage.getItem("user");
        const user = raw ? JSON.parse(raw) : {};
        router.replace(getDashboardHomePath(user.role || "", getEffectivePermissions(user)));
      } catch {
        router.replace("/dashboard");
      }
    }
  }, [canViewAll, router]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFrom(from), 400);
    return () => clearTimeout(timer);
  }, [from]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTo(to), 400);
    return () => clearTimeout(timer);
  }, [to]);

  useEffect(() => {
    if (!canViewAll) return;
    hrAPI
      .getEmployees()
      .then((list) =>
        setEmployees(
          sortByEmployeeCode(
            (Array.isArray(list) ? list : []).map((e: EmployeeOption) => ({
              id: e.id,
              name: e.name,
              employeeId: e.employeeId,
              role: e.role,
              joinDate: e.joinDate ?? null,
            }))
          )
        )
      )
      .catch(() => {});
  }, [canViewAll]);

  useEffect(() => {
    if (!canViewAll) return;
    hrAPI
      .getLeave({ status: "approved" })
      .then((list) => setLeaves(Array.isArray(list) ? (list as LeaveExportRow[]) : []))
      .catch(() => setLeaves([]));
  }, [canViewAll]);

  useEffect(() => {
    if (!employeeId) {
      setSalaryComponents(null);
      return;
    }
    hrAPI
      .getEmployeeSalary(employeeId)
      .then((status: { configured?: boolean; salary?: SalaryComponentsInput | null }) => {
        if (!status?.configured || !status.salary) {
          setSalaryComponents(null);
          return;
        }
        const s = status.salary;
        setSalaryComponents({
          basic: Number(s.basic) || 0,
          hra: Number(s.hra) || 0,
          da: Number(s.da) || 0,
          allowances: Number(s.allowances) || 0,
          pf: Number(s.pf) || 0,
          esi: Number(s.esi) || 0,
          tds: Number(s.tds) || 0,
          professionalTax: Number(s.professionalTax) || 0,
        });
      })
      .catch(() => setSalaryComponents(null));
  }, [employeeId]);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === employeeId),
    [employees, employeeId]
  );

  const summaryRange = useMemo(
    () => resolveSummaryRange(debouncedFrom, debouncedTo, selectedEmployee?.joinDate),
    [debouncedFrom, debouncedTo, selectedEmployee?.joinDate]
  );

  const employeeStats = useMemo(() => {
    if (!employeeId) return null;
    return computeAttendanceSummary(
      employeeId,
      rows as AttendanceExportRow[],
      leaves,
      summaryRange.start,
      summaryRange.end
    );
  }, [employeeId, rows, leaves, summaryRange.start, summaryRange.end]);

  const hasDateFilter = Boolean(debouncedFrom || debouncedTo);

  const employeeSalary = useMemo(() => {
    if (!salaryComponents) return null;
    // Employee only (no From/To): show configured monthly package, not cumulative attendance pay.
    if (!hasDateFilter) {
      return computeMonthlyPackage(salaryComponents);
    }
    if (!employeeStats) return null;
    const unpaidLeaveDays = Math.max(0, employeeStats.lop - employeeStats.absent);
    const result = computeAttendancePayroll({
      components: salaryComponents,
      presentDays: employeeStats.present,
      paidLeaveDays: employeeStats.leave,
      unpaidLeaveDays,
      absentDays: employeeStats.absent,
      manualIncentive: 0,
    });
    return result.netPay;
  }, [salaryComponents, employeeStats, hasDateFilter]);

  const today = todayLocalDate();
  const todayStats = useMemo(
    () => ({
      checkedIn: rows.filter((r) => r.date === today && r.checkIn).length,
      completed: rows.filter((r) => r.date === today && r.checkIn && r.checkOut).length,
    }),
    [rows, today]
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / TABLE_PAGE_SIZE));
  const pagedRows = useMemo(() => {
    const safePage = Math.min(tablePage, totalPages);
    const start = (safePage - 1) * TABLE_PAGE_SIZE;
    return rows.slice(start, start + TABLE_PAGE_SIZE);
  }, [rows, tablePage, totalPages]);

  useEffect(() => {
    setTablePage(1);
  }, [debouncedFrom, debouncedTo, debouncedSearch, employeeId, roleFilter, rows.length]);

  useEffect(() => {
    if (!canViewAll) return;

    const controller = new AbortController();
    const isFirstLoad = !hasLoadedRef.current;
    if (isFirstLoad) setInitialLoading(true);
    else setRefreshing(true);

    hrAPI
      .getAttendance(
        {
          ...apiDateRange(debouncedFrom, debouncedTo, employeeId, selectedEmployee?.joinDate),
          userId: employeeId || undefined,
          search: debouncedSearch || undefined,
          role: roleFilter || undefined,
        },
        { signal: controller.signal }
      )
      .then((list) => {
        setRows(Array.isArray(list) ? list : []);
        hasLoadedRef.current = true;
      })
      .catch((e: Error & { name?: string }) => {
        if (e.name === "AbortError") return;
        toast.error(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setInitialLoading(false);
          setRefreshing(false);
        }
      });

    return () => controller.abort();
  }, [debouncedFrom, debouncedTo, debouncedSearch, employeeId, roleFilter, canViewAll, selectedEmployee?.joinDate]);

  const openEdit = (row: Row) => {
    setEditRow(row);
    setCheckInTime(isoToTimeInput(row.checkIn));
    setCheckOutTime(isoToTimeInput(row.checkOut));
  };

  const closeEdit = () => {
    if (saving) return;
    setEditRow(null);
    setCheckInTime("");
    setCheckOutTime("");
  };

  const clearFilters = () => {
    setFrom("");
    setTo("");
    setSearch("");
    setEmployeeId("");
    setRoleFilter("");
  };

  const downloadAttendanceExcel = async () => {
    setDownloading(true);
    try {
      const today = todayLocalDate();
      const hasDateFilter = !!(from || to);

      let exportEmployees = employees;
      if (employeeId) {
        exportEmployees = employees.filter((e) => e.id === employeeId);
      } else if (roleFilter) {
        exportEmployees = employees.filter((e) => e.role === roleFilter);
      }
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.trim().toLowerCase();
        exportEmployees = exportEmployees.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            (e.employeeId || "").toLowerCase().includes(q)
        );
      }

      let start: string;
      let end: string;
      if (hasDateFilter) {
        ({ start, end } = resolveExportRange(from, to, today));
      } else {
        end = today;
        const joinDates = exportEmployees
          .map((e) => e.joinDate)
          .filter((d): d is string => !!d);
        const allHaveJoinDate =
          exportEmployees.length > 0 && joinDates.length === exportEmployees.length;
        if (allHaveJoinDate) {
          start = joinDates.reduce((min, d) => (d < min ? d : min));
        } else {
          start = "2000-01-01";
        }
      }

      const [attendanceData, leaveData] = await Promise.all([
        hrAPI.getAttendance({
          from: start,
          to: end,
          userId: employeeId || undefined,
          search: debouncedSearch || undefined,
          role: roleFilter || undefined,
        }),
        hrAPI.getLeave({ status: "approved" }),
      ]);

      const attendanceRows = (Array.isArray(attendanceData) ? attendanceData : []) as AttendanceExportRow[];
      const leaves = (Array.isArray(leaveData) ? leaveData : []) as Array<{
        userId: string;
        startDate: string;
        endDate: string;
        type: string;
        status: string;
      }>;

      const employeeIds = new Set(exportEmployees.map((e) => e.id));
      const filteredAttendance = attendanceRows.filter((r) => employeeIds.has(r.userId));

      const titleEmployee = employeeId
        ? exportEmployees[0]?.name || "Employee"
        : "All Employees";
      const title = hasDateFilter
        ? `Attendance Report — ${titleEmployee} — ${effectiveRangeLabel(start, end)}`
        : `Attendance Report — ${titleEmployee}`;

      const buffer = await buildAttendanceWorkbook({
        title,
        employees: exportEmployees,
        attendance: filteredAttendance,
        leaves,
        from: start,
        to: end,
        perEmployeeRange: !hasDateFilter,
        fallbackTo: today,
      });

      const fileRange =
        from && to
          ? `${from}_to_${to}`
          : from
            ? `from-${from}`
            : to
              ? `to-${to}`
              : "";
      const baseName = employeeId
        ? `attendance-${(exportEmployees[0]?.name || "employee").replace(/\s+/g, "-")}`
        : "attendance-all-employees";
      const fileName = fileRange ? `${baseName}-${fileRange}.xlsx` : `${baseName}.xlsx`;

      downloadBlob(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName
      );
      toast.success("Attendance downloaded");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const saveTimes = async () => {
    if (!editRow) return;
    setSaving(true);
    try {
      const updated = (await hrAPI.updateAttendanceTimes(editRow.id, {
        checkIn: checkInTime ? timeInputToIso(editRow.date, checkInTime) : null,
        checkOut: checkOutTime ? timeInputToIso(editRow.date, checkOutTime) : null,
      })) as Row;
      setRows((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
      toast.success("Attendance times updated");
      setEditRow(null);
      setCheckInTime("");
      setCheckOutTime("");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update times");
    } finally {
      setSaving(false);
    }
  };

  if (!canViewAll) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-600 mt-1">
          View check-in and check-out records for all employees.
        </p>
      </div>
      {!admin && <HrNav />}

      <div
        className={`grid gap-4 ${
          employeeId ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-3"
        }`}
      >
        {employeeId ? (
          <>
            <EmployeeStatCard
              label="Salary"
              value={employeeSalary != null ? formatInr(employeeSalary) : "—"}
              icon={<IoWalletOutline className="w-5 h-5" />}
              tone="emerald"
              compactValue
            />
            <EmployeeStatCard
              label="Working Days"
              value={employeeStats?.workingDays ?? 0}
              icon={<IoCalendarNumberOutline className="w-5 h-5" />}
              tone="blue"
            />
            <EmployeeStatCard
              label="Present"
              value={employeeStats?.present ?? 0}
              icon={<IoCheckmarkCircleOutline className="w-5 h-5" />}
              tone="green"
            />
            <EmployeeStatCard
              label="Leave"
              value={employeeStats?.leave ?? 0}
              icon={<IoLeafOutline className="w-5 h-5" />}
              tone="teal"
            />
            <EmployeeStatCard
              label="Absent"
              value={employeeStats?.absent ?? 0}
              icon={<IoCloseCircleOutline className="w-5 h-5" />}
              tone="rose"
            />
            <EmployeeStatCard
              label="Weekly Off"
              value={employeeStats?.weeklyOff ?? 0}
              icon={<IoBedOutline className="w-5 h-5" />}
              tone="indigo"
            />
            <EmployeeStatCard
              label="Holidays"
              value={employeeStats?.holidays ?? 0}
              icon={<IoGiftOutline className="w-5 h-5" />}
              tone="amber"
            />
            <EmployeeStatCard
              label="LOP"
              value={employeeStats?.lop ?? 0}
              icon={<IoRemoveCircleOutline className="w-5 h-5" />}
              tone="orange"
            />
            <EmployeeStatCard
              label="Late Marks"
              value={employeeStats?.lateMarks ?? 0}
              icon={<IoAlarmOutline className="w-5 h-5" />}
              tone="red"
            />
          </>
        ) : (
          <>
            <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-50 text-green-600 border border-green-200">
                <IoPeople className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Records in range</p>
                <p className="text-xl font-bold text-gray-900">{rows.length}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                <IoTime className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Checked in today</p>
                <p className="text-xl font-bold text-gray-900">{todayStats.checkedIn}</p>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
                <IoCalendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Completed today</p>
                <p className="text-xl font-bold text-gray-900">{todayStats.completed}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {employeeId && selectedEmployee ? (
        <p className="text-sm text-gray-600 -mt-2 px-1">
          Summary for{" "}
          <span className="font-semibold text-gray-900">
            {selectedEmployee.employeeId ? `${selectedEmployee.employeeId} · ` : ""}
            {selectedEmployee.name}
          </span>
          <span className="text-gray-400"> · </span>
          {summaryRange.label}
        </p>
      ) : null}

      <div className="flex flex-wrap items-end gap-2.5 bg-white border border-gray-200 rounded-xl p-4">
        <div className="shrink-0">
          <label className="text-xs font-medium text-gray-600">Search</label>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or employee code…"
            className={`${FILTER_INPUT} w-[10.5rem]`}
          />
        </div>
        <div className="shrink-0">
          <label className="text-xs font-medium text-gray-600">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={`${FILTER_INPUT} w-[9.5rem]`}
          />
        </div>
        <div className="shrink-0">
          <label className="text-xs font-medium text-gray-600">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={`${FILTER_INPUT} w-[9.5rem]`}
          />
        </div>
        <div className="shrink-0">
          <label className="text-xs font-medium text-gray-600">Employee</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className={`${FILTER_INPUT} w-[11rem]`}
          >
            <option value="">All employees</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.employeeId ? `${e.employeeId} · ` : ""}
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div className="shrink-0">
          <label className="text-xs font-medium text-gray-600">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            disabled={rolesLoading}
            className={`${FILTER_INPUT} w-[8.5rem]`}
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={downloadAttendanceExcel}
          disabled={downloading}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 px-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <IoDownloadOutline className="w-4 h-4" />
          {downloading ? "Downloading…" : "Download"}
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="h-9 shrink-0 px-2 text-sm font-medium text-red-600 hover:text-red-700 bg-transparent"
        >
          Clear
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl min-w-0 max-w-full">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-800">All employee attendance</h2>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {rows.length > TABLE_PAGE_SIZE ? (
              <span>
                Page {Math.min(tablePage, totalPages)} of {totalPages} · {rows.length} records
              </span>
            ) : rows.length > 0 ? (
              <span>{rows.length} records</span>
            ) : null}
            {refreshing && <span className="text-gray-400 animate-pulse">Updating…</span>}
          </div>
        </div>
        <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
          <table className={`w-full min-w-[960px] text-sm transition-opacity duration-200 ${refreshing ? "opacity-60" : ""}`}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check in</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initialLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    Loading attendance…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-500">
                    No attendance records for this period.
                  </td>
                </tr>
              ) : (
                pagedRows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{r.userName || "—"}</div>
                      <EmployeeCodeBadge code={r.employeeId} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{r.role || "—"}</td>
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3">{formatTime(r.checkIn)}</td>
                    <td className="px-4 py-3">{formatTime(r.checkOut)}</td>
                    <td className="px-4 py-3 text-gray-600">{workDuration(r.checkIn, r.checkOut)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          r.status === "present"
                            ? "bg-green-100 text-green-800"
                            : r.status === "absent"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {canEditTimes(r.userId) ? (
                        <button
                          type="button"
                          onClick={() => openEdit(r)}
                          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-green-700 hover:bg-green-50 border border-transparent hover:border-green-200"
                          title="Edit check-in / check-out times"
                          aria-label={`Edit attendance for ${r.userName}`}
                        >
                          <IoCreateOutline className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {rows.length > TABLE_PAGE_SIZE && (
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100">
            <button
              type="button"
              disabled={tablePage <= 1}
              onClick={() => setTablePage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={tablePage >= totalPages}
              onClick={() => setTablePage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!editRow}
        onClose={closeEdit}
        title={editRow ? `Edit times — ${editRow.userName}` : "Edit times"}
        size="sm"
      >
        {editRow && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {editRow.date} · {editRow.role || "Employee"}
            </p>
            <div>
              <label className="text-xs font-medium text-gray-600">Check in</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Check out</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <p className="text-xs text-gray-500">
              Only check-in and check-out times can be changed. Clear a field to remove that time.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeEdit}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTimes}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
