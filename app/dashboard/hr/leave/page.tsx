"use client";

import { useEffect, useState } from "react";
import HrNav from "@/components/hr/HrNav";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import EmployeeCodeBadge from "@/components/hr/EmployeeCodeBadge";
import { can, getUserPermissions, isAdmin, isHrManagerRole, PERMISSIONS } from "@/lib/permissions";

type LeaveRow = {
  id: string;
  userName: string;
  userRole?: string;
  employeeId?: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
};

function readRole() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? String(JSON.parse(raw).role || "").trim() : "";
  } catch {
    return "";
  }
}

export default function HrLeavePage() {
  const perms = getUserPermissions();
  const hrManager = isHrManagerRole(readRole(), perms);
  const canManage = can(PERMISSIONS.HR_LEAVE_MANAGE, perms);
  const canRequest = can(PERMISSIONS.HR_LEAVE_REQUEST, perms);
  const viewerIsAdmin = isAdmin();
  const viewerRole = readRole();

  const canReviewLeave = (row: LeaveRow) => {
    if (row.status !== "pending") return false;
    if (row.userRole === "HR") return viewerIsAdmin;
    return canManage;
  };
  const [rows, setRows] = useState<LeaveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: "casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const load = () => {
    setLoading(true);
    hrAPI
      .getLeave()
      .then(setRows)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await hrAPI.requestLeave(form);
      toast.success("Leave request submitted");
      setForm({ type: "casual", startDate: "", endDate: "", reason: "" });
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const approve = async (id: string) => {
    try {
      await hrAPI.approveLeave(id);
      toast.success("Approved");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  const reject = async (id: string) => {
    const note = prompt("Rejection reason (optional):") || "";
    try {
      await hrAPI.rejectLeave(id, note);
      toast.success("Rejected");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {hrManager ? "Leave management" : "My leave"}
      </h1>
      <p className="text-sm text-gray-600 -mt-2">
        {hrManager ? "Human Resources" : "My Services"}
      </p>
      <HrNav />

      {canRequest && (
        <form onSubmit={submit} className="bg-white border rounded-lg p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border rounded-lg text-sm">
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="earned">Earned</option>
            <option value="unpaid">Unpaid</option>
            <option value="other">Other</option>
          </select>
          <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
          <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
          <input required placeholder="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="px-3 py-2 border rounded-lg text-sm sm:col-span-2" />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            Request leave
          </button>
        </form>
      )}

      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
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
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No leave requests.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.userName}</div>
                    <EmployeeCodeBadge code={r.employeeId} />
                    {r.userRole && <div className="text-xs text-gray-500">{r.userRole}</div>}
                  </td>
                  <td className="px-4 py-3 capitalize">{r.type}</td>
                  <td className="px-4 py-3">
                    {r.startDate} → {r.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        r.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : r.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  {canManage && (
                    <td className="px-4 py-3 text-right space-x-2">
                      {canReviewLeave(r) && (
                        <>
                          <button onClick={() => approve(r.id)} className="text-green-600 font-medium hover:underline">
                            Approve
                          </button>
                          <button onClick={() => reject(r.id)} className="text-red-600 font-medium hover:underline">
                            Reject
                          </button>
                        </>
                      )}
                      {r.status === "pending" && r.userRole === "HR" && !viewerIsAdmin && viewerRole === "HR" && (
                        <span className="text-xs text-gray-500">Admin approval required</span>
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
