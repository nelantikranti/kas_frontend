"use client";

import { useEffect, useRef, useState } from "react";
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
import { IoTime, IoPeople, IoCalendar, IoCreateOutline } from "react-icons/io5";
import EmployeeCodeBadge from "@/components/hr/EmployeeCodeBadge";
import HrListFilters from "@/components/hr/HrListFilters";
import Modal from "@/components/Modal";

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
  const perms = getUserPermissions();
  const admin = isAdmin();
  const canViewAll = canViewAttendanceList(undefined, perms) || admin;

  const [rows, setRows] = useState<Row[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (!canViewAll) return;

    const controller = new AbortController();
    const isFirstLoad = !hasLoadedRef.current;
    if (isFirstLoad) setInitialLoading(true);
    else setRefreshing(true);

    hrAPI
      .getAttendance(
        {
          from: from || undefined,
          to: to || undefined,
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
  }, [from, to, debouncedSearch, roleFilter, canViewAll]);

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
    setRoleFilter("");
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <p className="text-xl font-bold text-gray-900">
              {rows.filter((r) => r.date === todayLocalDate() && r.checkIn).length}
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600 border border-purple-200">
            <IoCalendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Completed today</p>
            <p className="text-xl font-bold text-gray-900">
              {
                rows.filter(
                  (r) => r.date === todayLocalDate() && r.checkIn && r.checkOut
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-end bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div>
          <label className="text-xs font-medium text-gray-600">From</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="block mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">To</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="block mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <HrListFilters
          search={search}
          role={roleFilter}
          onSearchChange={setSearch}
          onRoleChange={setRoleFilter}
          size="sm"
          hideLabels
        />
        <button
          type="button"
          onClick={clearFilters}
          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shrink-0"
        >
          Clear filter
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm min-w-0 max-w-full">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-800">All employee attendance</h2>
          {refreshing && (
            <span className="text-xs text-gray-400 animate-pulse">Updating…</span>
          )}
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
                rows.map((r) => (
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
