"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HrNav from "@/components/hr/HrNav";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import {
  canViewAttendanceList,
  getEffectivePermissions,
  getDashboardHomePath,
  getUserPermissions,
  isAdmin,
} from "@/lib/permissions";
import { IoTime, IoPeople, IoCalendar } from "react-icons/io5";

type Row = {
  id: string;
  userId: string;
  userName: string;
  department?: string;
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

export default function HrAttendancePage() {
  const router = useRouter();
  const perms = getUserPermissions();
  const admin = isAdmin();
  const canViewAll = canViewAttendanceList(undefined, perms) || admin;

  const [rows, setRows] = useState<Row[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

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

  const load = useCallback(() => {
    if (!canViewAll) return;
    setLoading(true);
    hrAPI
      .getAttendance({ from: from || undefined, to: to || undefined })
      .then((list) => setRows(Array.isArray(list) ? list : []))
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [from, to, canViewAll]);

  useEffect(() => {
    load();
  }, [load]);

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
            <p className="text-xl font-bold text-gray-900">{loading ? "…" : rows.length}</p>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <IoTime className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Checked in today</p>
            <p className="text-xl font-bold text-gray-900">
              {loading
                ? "…"
                : rows.filter(
                    (r) =>
                      r.date === new Date().toISOString().split("T")[0] && r.checkIn
                  ).length}
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
              {loading
                ? "…"
                : rows.filter(
                    (r) =>
                      r.date === new Date().toISOString().split("T")[0] &&
                      r.checkIn &&
                      r.checkOut
                  ).length}
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
        <button
          onClick={load}
          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
        >
          Apply filter
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">All employee attendance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check in</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check out</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    Loading attendance…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                    No attendance records for this period.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-medium text-gray-900">{r.userName || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{r.department || "—"}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
