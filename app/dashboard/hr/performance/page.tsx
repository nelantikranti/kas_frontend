"use client";

import { useEffect, useMemo, useState } from "react";
import HrNav from "@/components/hr/HrNav";
import { performanceAPI } from "@/lib/api";
import { can, getUserPermissions, PERMISSIONS } from "@/lib/permissions";
import { toast } from "@/components/Toast";

type Row = {
  userId: string;
  staffName: string;
  email: string;
  role: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  efficiency: number;
};

export default function HrPerformancePage() {
  const perms = getUserPermissions();
  const canExport = can(PERMISSIONS.HR_PERFORMANCE_EXPORT, perms);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await performanceAPI.getReport({ from: from || undefined, to: to || undefined });
      setRows(res.data || []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const sorted = useMemo(() => [...rows].sort((a, b) => b.efficiency - a.efficiency), [rows]);

  const exportFile = async (format: "csv" | "pdf") => {
    try {
      await performanceAPI.exportReport({ from: from || undefined, to: to || undefined, format });
      toast.success(`Exported ${format.toUpperCase()}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Performance KPIs</h1>
      <HrNav />

      <div className="bg-white border rounded-lg p-4 flex flex-wrap gap-3 items-end">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
        <button onClick={fetchReport} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium" disabled={loading}>
          Apply
        </button>
        {canExport && (
          <>
            <button onClick={() => exportFile("csv")} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
              Export CSV
            </button>
            <button onClick={() => exportFile("pdf")} className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
              Export PDF
            </button>
          </>
        )}
      </div>

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Done</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr key={r.userId}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.staffName}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">{r.role}</td>
                  <td className="px-4 py-3">{r.totalTasks}</td>
                  <td className="px-4 py-3">{r.completedTasks}</td>
                  <td className="px-4 py-3">{r.pendingTasks}</td>
                  <td className="px-4 py-3 font-semibold">{r.efficiency.toFixed(1)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
