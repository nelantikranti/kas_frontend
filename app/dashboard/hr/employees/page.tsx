"use client";

import { useEffect, useState } from "react";
import HrNav from "@/components/hr/HrNav";
import Modal from "@/components/Modal";
import SalaryStructureForm, { type SalaryFormData } from "@/components/hr/SalaryStructureForm";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import { can, getUserPermissions, PERMISSIONS } from "@/lib/permissions";
import { formatInr } from "@/components/hr/hrDocumentUtils";
import EmployeeCodeBadge from "@/components/hr/EmployeeCodeBadge";
import HrListFilters from "@/components/hr/HrListFilters";

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

type SalaryStatus = {
  configured: boolean;
  errors: string[];
  salary: SalaryFormData & { monthlyGross?: number } | null;
};

export default function HrEmployeesPage() {
  const perms = getUserPermissions();
  const canEdit = can(PERMISSIONS.HR_EMPLOYEES_MANAGE, perms);
  const canSalary = canEdit || can(PERMISSIONS.HR_PAYROLL_MANAGE, perms);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Employee | null>(null);
  const [salaryEmp, setSalaryEmp] = useState<Employee | null>(null);
  const [salaryStatus, setSalaryStatus] = useState<SalaryStatus | null>(null);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [form, setForm] = useState({ phone: "", department: "", joinDate: "", managerId: "" });

  const load = () => {
    setLoading(true);
    hrAPI
      .getEmployees({ search: search || undefined, role: roleFilter || undefined })
      .then(setEmployees)
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search, roleFilter]);

  const openEdit = (emp: Employee) => {
    setEdit(emp);
    setForm({
      phone: emp.phone || "",
      department: emp.department || "",
      joinDate: emp.joinDate || "",
      managerId: emp.managerId || "",
    });
  };

  const openSalary = async (emp: Employee) => {
    setSalaryEmp(emp);
    setSalaryStatus(null);
    setSalaryLoading(true);
    try {
      const status = (await hrAPI.getEmployeeSalary(emp.id)) as SalaryStatus;
      setSalaryStatus(status);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not load salary structure");
      setSalaryEmp(null);
    } finally {
      setSalaryLoading(false);
    }
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

  const saveSalary = async (data: SalaryFormData) => {
    if (!salaryEmp) return;
    const res = (await hrAPI.saveSalary(salaryEmp.id, {
      basic: Number(data.basic),
      hra: Number(data.hra) || 0,
      da: Number(data.da) || 0,
      allowances: Number(data.allowances) || 0,
      pf: Number(data.pf) || 0,
      esi: Number(data.esi) || 0,
      tds: Number(data.tds) || 0,
      professionalTax: Number(data.professionalTax) || 0,
    })) as SalaryStatus;
    setSalaryStatus(res);
    toast.success("Salary structure saved");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
      <HrNav
        trailing={
          <HrListFilters
            compact
            search={search}
            role={roleFilter}
            onSearchChange={setSearch}
            onRoleChange={setRoleFilter}
          />
        }
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              {(canEdit || canSalary) && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={canEdit || canSalary ? 4 : 3} className="px-4 py-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : (
              employees.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{e.name}</div>
                    <EmployeeCodeBadge code={e.employeeId} className="mt-0.5" />
                  </td>
                  <td className="px-4 py-3 text-gray-700">{e.role}</td>
                  <td className="px-4 py-3 text-gray-600">{e.email || "—"}</td>
                  {(canEdit || canSalary) && (
                    <td className="px-4 py-3 text-right space-x-3">
                      {canSalary && (
                        <button
                          type="button"
                          onClick={() => openSalary(e)}
                          className="text-gray-900 hover:underline font-medium"
                        >
                          Salary structure
                        </button>
                      )}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => openEdit(e)}
                          className="text-gray-700 hover:underline font-medium"
                        >
                          Edit profile
                        </button>
                      )}
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
          <p className="text-sm text-gray-600">
            {edit?.name} — {edit?.email}
          </p>
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(ev) => setForm({ ...form, phone: ev.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {edit?.employeeId && (
            <p className="text-sm text-gray-600">
              Employee code: <EmployeeCodeBadge code={edit.employeeId} className="inline text-sm" />
            </p>
          )}
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
          <button onClick={save} className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
            Save
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={!!salaryEmp}
        onClose={() => {
          setSalaryEmp(null);
          setSalaryStatus(null);
        }}
        title="Salary structure"
      >
        {salaryEmp && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 border-b pb-3">
              <p className="font-semibold text-gray-900">{salaryEmp.name}</p>
              <p>{salaryEmp.email}</p>
              {salaryEmp.department && <p>Department: {salaryEmp.department}</p>}
              {salaryStatus?.salary?.monthlyGross != null && salaryStatus.configured && (
                <p className="mt-1">
                  Current gross: <strong>{formatInr(salaryStatus.salary.monthlyGross)}</strong>
                </p>
              )}
            </div>

            {salaryLoading ? (
              <p className="text-gray-500 text-sm">Loading salary structure…</p>
            ) : (
              <>
                {salaryStatus && !salaryStatus.configured && salaryStatus.errors.length > 0 && (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    <p className="font-semibold">Configuration incomplete</p>
                    <ul className="list-disc list-inside mt-1">
                      {salaryStatus.errors.map((err) => (
                        <li key={err}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <SalaryStructureForm
                  initial={salaryStatus?.salary}
                  onSave={saveSalary}
                  disabled={!canSalary}
                />
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
