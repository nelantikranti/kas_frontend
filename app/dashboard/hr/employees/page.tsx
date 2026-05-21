"use client";

import { useEffect, useState } from "react";
import HrNav from "@/components/hr/HrNav";
import Modal from "@/components/Modal";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import { can, getUserPermissions, PERMISSIONS } from "@/lib/permissions";

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  phone: string;
  employeeId: string;
  department: string;
  joinDate: string | null;
  managerId: string | null;
  managerName: string | null;
};

export default function HrEmployeesPage() {
  const perms = getUserPermissions();
  const canEdit = can(PERMISSIONS.HR_EMPLOYEES_MANAGE, perms);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Employee | null>(null);
  const [form, setForm] = useState({ phone: "", employeeId: "", department: "", joinDate: "", managerId: "" });

  const load = () => {
    setLoading(true);
    hrAPI
      .getEmployees()
      .then(setEmployees)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (emp: Employee) => {
    setEdit(emp);
    setForm({
      phone: emp.phone || "",
      employeeId: emp.employeeId || "",
      department: emp.department || "",
      joinDate: emp.joinDate || "",
      managerId: emp.managerId || "",
    });
  };

  const save = async () => {
    if (!edit) return;
    try {
      await hrAPI.updateProfile(edit.id, form);
      toast.success("Profile updated");
      setEdit(null);
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
      <HrNav />

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Join date</th>
              {canEdit && <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
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
              employees.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-gray-500">{e.email}</div>
                  </td>
                  <td className="px-4 py-3">{e.role}</td>
                  <td className="px-4 py-3">{e.department || "—"}</td>
                  <td className="px-4 py-3">{e.managerName || "—"}</td>
                  <td className="px-4 py-3">{e.joinDate || "—"}</td>
                  {canEdit && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEdit(e)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Edit profile
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!edit} onClose={() => setEdit(null)} title="Employee profile">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">{edit?.name} — {edit?.email}</p>
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(ev) => setForm({ ...form, phone: ev.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={(ev) => setForm({ ...form, employeeId: ev.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(ev) => setForm({ ...form, department: ev.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="date"
            value={form.joinDate}
            onChange={(ev) => setForm({ ...form, joinDate: ev.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <label className="text-xs text-gray-500">Manager (user ID)</label>
          <select
            value={form.managerId}
            onChange={(ev) => setForm({ ...form, managerId: ev.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">None</option>
            {employees
              .filter((x) => x.id !== edit?.id)
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
          </select>
          <button onClick={save} className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
