"use client";

import { useEffect, useState } from "react";
import HrNav from "@/components/hr/HrNav";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import { can, getUserPermissions, PERMISSIONS } from "@/lib/permissions";

type Row = {
  id: string;
  userName: string;
  date: string;
  hours: number;
  description: string;
  status: string;
};

export default function HrTimesheetsPage() {
  const perms = getUserPermissions();
  const canSubmit = can(PERMISSIONS.HR_TIMESHEET_SUBMIT, perms);
  const canManage = can(PERMISSIONS.HR_TIMESHEET_MANAGE, perms);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ date: "", hours: "8", description: "", submit: true });

  const load = () => {
    setLoading(true);
    hrAPI
      .getTimesheets()
      .then(setRows)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hrAPI.createTimesheet({
        date: form.date,
        hours: Number(form.hours),
        description: form.description,
        status: form.submit ? "submitted" : "draft",
      });
      toast.success(form.submit ? "Timesheet submitted" : "Draft saved");
      setForm({ date: "", hours: "8", description: "", submit: true });
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const setStatus = async (id: string, status: string) => {
    try {
      await hrAPI.updateTimesheet(id, { status });
      toast.success("Updated");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Timesheets</h1>
      <HrNav />

      {canSubmit && (
        <form onSubmit={add} className="bg-white border rounded-lg p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
          <input type="number" min={0.25} max={24} step={0.25} required value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-3 py-2 border rounded-lg text-sm lg:col-span-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.submit} onChange={(e) => setForm({ ...form, submit: e.target.checked })} />
            Submit for review
          </label>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
            Add entry
          </button>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {canManage && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.userName}</td>
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.hours}</td>
                  <td className="px-4 py-3 capitalize">{r.status}</td>
                  {canManage && (
                    <td className="px-4 py-3 text-right space-x-2">
                      {r.status === "submitted" && (
                        <>
                          <button onClick={() => setStatus(r.id, "approved")} className="text-green-600 font-medium">
                            Approve
                          </button>
                          <button onClick={() => setStatus(r.id, "rejected")} className="text-red-600 font-medium">
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
