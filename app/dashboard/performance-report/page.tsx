"use client";

import { useEffect, useMemo, useState } from "react";
import { performanceAPI } from "@/lib/api";

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

export default function PerformanceReportPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const hasFilters = Boolean(from || to);

  const fetchReport = async (opts?: { from?: string; to?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await performanceAPI.getReport(opts);
      setRows(res.data || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load performance report");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => b.efficiency - a.efficiency);
  }, [rows]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Staff Performance Report</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Task-based performance summary (total, completed, pending, efficiency).
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-3 lg:gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">From</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">To</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full sm:w-56 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchReport({ from: from || undefined, to: to || undefined })}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              Apply
            </button>
            <button
              onClick={() => {
                setFrom("");
                setTo("");
                fetchReport();
              }}
              className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
              disabled={loading || !hasFilters}
            >
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Name</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Tasks</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Efficiency (%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-10 text-center text-sm text-gray-500">
                    Loading performance report…
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-10 text-center text-sm text-gray-500">
                    No data available{hasFilters ? " for the selected date range" : ""}.
                  </td>
                </tr>
              ) : (
                sorted.map((r) => (
                  <tr key={r.userId} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{r.staffName}</span>
                        <span className="text-xs text-gray-500">{r.email}</span>
                      </div>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.totalTasks}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.completedTasks}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700">{r.pendingTasks}</td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {r.efficiency.toFixed(1)}
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

