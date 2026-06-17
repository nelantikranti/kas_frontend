"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import HrPageHeader from "@/components/hr/HrPageHeader";
import PayslipDocument, {
  type PayslipDeductionsDetail,
  type PayslipDocumentData,
  type PayslipEarnings,
} from "@/components/hr/PayslipDocument";
import type { CalculationData } from "@/components/hr/PayslipCalculationPreview";
import PdfPreviewPanel from "@/components/hr/PdfPreviewPanel";
import HrActionToolbar from "@/components/hr/HrActionToolbar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import { downloadBlob } from "@/lib/hrShare";
import { can, getUserPermissions, PERMISSIONS } from "@/lib/permissions";
import { formatInr, formatLetterDate, formatPayrollMonth } from "@/components/hr/hrDocumentUtils";
import PayslipEditPanel from "@/components/hr/PayslipEditPanel";
import HrListFilters from "@/components/hr/HrListFilters";
import EmployeeCodeBadge from "@/components/hr/EmployeeCodeBadge";
import { IoCheckmarkCircle, IoChevronForward, IoWarningOutline } from "react-icons/io5";

function lastMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string;
  joinDate?: string | null;
  accountNumber?: string;
  panNumber?: string;
  uanNumber?: string;
};
type Payslip = {
  id: string;
  userId: string;
  month: string;
  employeeName: string;
  employeeId?: string;
  role?: string;
  email?: string;
  joinDate?: string;
  accountNumber?: string;
  panNumber?: string;
  uanNumber?: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  earnings?: PayslipEarnings;
  deductionsDetail?: PayslipDeductionsDetail;
  presentDays?: number;
  workingDays?: number;
  unpaidLeaveDays?: number;
  absentDays?: number;
  status: "draft" | "published" | "superseded";
  publishedAt?: string;
  emailedAt?: string;
};

type SalaryStatus = {
  configured: boolean;
  errors: string[];
  salary: { monthlyGross?: number; basic?: number } | null;
};

type ConfirmState = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: "danger" | "primary";
  onConfirm: () => Promise<void>;
};

const STEPS = ["Select employee", "Review payslip", "Save", "Publish all"] as const;

function payslipToCalculation(slip: Payslip): CalculationData {
  return {
    month: slip.month,
    employeeName: slip.employeeName,
    employeeId: slip.employeeId,
    role: slip.role,
    email: slip.email,
    joinDate: slip.joinDate,
    accountNumber: slip.accountNumber,
    panNumber: slip.panNumber,
    uanNumber: slip.uanNumber,
    workingDays: slip.workingDays ?? 0,
    presentDays: slip.presentDays ?? 0,
    unpaidLeaveDays: slip.unpaidLeaveDays ?? 0,
    absentDays: slip.absentDays ?? 0,
    earnings: slip.earnings ?? { basic: 0, hra: 0, da: 0, allowances: 0, incentive: 0, total: slip.grossPay },
    deductionsDetail: slip.deductionsDetail ?? {
      pf: 0,
      esi: 0,
      tds: 0,
      professionalTax: 0,
      lop: 0,
      total: slip.deductions,
    },
    grossPay: slip.grossPay,
    deductions: slip.deductions,
    netPay: slip.netPay,
    monthlyGross:
      slip.deductionsDetail?.lop != null
        ? Math.round((slip.grossPay + slip.deductionsDetail.lop) * 100) / 100
        : undefined,
  };
}

function buildPdfPayload(calc: CalculationData, role?: string) {
  return {
    month: calc.month,
    monthLabel: formatPayrollMonth(calc.month),
    employeeName: calc.employeeName,
    employeeId: calc.employeeId,
    role: calc.role || role,
    joinDate: calc.joinDate,
    accountNumber: calc.accountNumber,
    panNumber: calc.panNumber,
    uanNumber: calc.uanNumber,
    workingDays: calc.workingDays,
    presentDays: calc.presentDays,
    unpaidLeaveDays: calc.unpaidLeaveDays,
    absentDays: calc.absentDays,
    earnings: calc.earnings,
    deductionsDetail: calc.deductionsDetail,
    grossPay: calc.grossPay,
    deductions: calc.deductions,
    netPay: calc.netPay,
  };
}

function calculationToDocument(c: CalculationData): PayslipDocumentData {
  return {
    month: c.month,
    employeeName: c.employeeName,
    employeeId: c.employeeId,
    role: c.role,
    joinDate: c.joinDate,
    accountNumber: c.accountNumber,
    panNumber: c.panNumber,
    uanNumber: c.uanNumber,
    grossPay: c.grossPay,
    deductions: c.deductions,
    netPay: c.netPay,
    earnings: c.earnings,
    deductionsDetail: c.deductionsDetail,
    presentDays: c.presentDays,
    workingDays: c.workingDays,
    unpaidLeaveDays: c.unpaidLeaveDays,
    absentDays: c.absentDays,
  };
}

export default function HrPayrollPage() {
  const perms = getUserPermissions();
  const canGenerate = can(PERMISSIONS.HR_PAYROLL_GENERATE, perms);

  const [month, setMonth] = useState(lastMonth());
  const [employeeId, setEmployeeId] = useState("");
  const [calculation, setCalculation] = useState<CalculationData | null>(null);
  const [currentDraft, setCurrentDraft] = useState<Payslip | null>(null);
  const [salaryStatus, setSalaryStatus] = useState<SalaryStatus | null>(null);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pdfModal, setPdfModal] = useState<Payslip | null>(null);
  const [pdfKey, setPdfKey] = useState(0);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [registrySearch, setRegistrySearch] = useState("");
  const [registryRole, setRegistryRole] = useState("");

  const selectedEmployee = employees.find((e) => e.id === employeeId);
  const salaryConfigured = salaryStatus?.configured === true;

  const savedSlip = useMemo(
    () =>
      payslips.find(
        (p) =>
          p.userId === employeeId &&
          p.month === month &&
          (p.status === "draft" || p.status === "published")
      ) ?? null,
    [payslips, employeeId, month]
  );

  const step = useMemo(() => {
    if (!employeeId) return 0;
    if (!calculation) return 1;
    if (!currentDraft || currentDraft.status === "draft") return currentDraft ? 2 : 1;
    if (currentDraft.status === "published") return 3;
    return 2;
  }, [employeeId, calculation, currentDraft]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [slips, emps] = await Promise.all([
        hrAPI.getPayslips({
          month,
          search: registrySearch || undefined,
          role: registryRole || undefined,
        }),
        hrAPI.getEmployees(),
      ]);
      setPayslips(Array.isArray(slips) ? slips : []);
      setEmployees(
        (Array.isArray(emps) ? emps : [])
          .filter((e: { status: string; role: string }) => e.status === "Active" && e.role !== "Admin")
          .map((e: Employee & { status: string }) => ({
            id: e.id,
            name: e.name,
            email: e.email,
            role: e.role,
            employeeId: e.employeeId,
            joinDate: e.joinDate,
            accountNumber: e.accountNumber,
            panNumber: e.panNumber,
            uanNumber: e.uanNumber,
          }))
      );
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load payroll");
    } finally {
      setLoading(false);
    }
  }, [month, registrySearch, registryRole]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!employeeId) {
      setCalculation(null);
      setCurrentDraft(null);
      setSalaryStatus(null);
      return;
    }
    const draft = payslips.find((p) => p.userId === employeeId && p.month === month && p.status === "draft");
    const published = payslips.find((p) => p.userId === employeeId && p.month === month && p.status === "published");
    setCurrentDraft(draft || published || null);

    setSalaryLoading(true);
    hrAPI
      .getEmployeeSalary(employeeId)
      .then((status) => setSalaryStatus(status as SalaryStatus))
      .catch(() => setSalaryStatus({ configured: false, errors: ["Could not load salary structure"], salary: null }))
      .finally(() => setSalaryLoading(false));
  }, [employeeId, month, payslips]);

  const enrichCalculation = useCallback(
    (calc: CalculationData): CalculationData => {
      const emp = employees.find((e) => e.id === employeeId);
      return {
        ...calc,
        employeeId: calc.employeeId || emp?.employeeId,
        joinDate: calc.joinDate || emp?.joinDate || undefined,
        accountNumber: calc.accountNumber || emp?.accountNumber,
        panNumber: calc.panNumber || emp?.panNumber,
        uanNumber: calc.uanNumber || emp?.uanNumber,
        earnings: {
          ...calc.earnings,
          incentive: calc.earnings.incentive ?? 0,
        },
      };
    },
    [employees, employeeId]
  );

  useEffect(() => {
    if (!employeeId || !salaryConfigured || salaryLoading) {
      if (!employeeId) setCalculation(null);
      return;
    }
    if (savedSlip) {
      setCalculation(enrichCalculation(payslipToCalculation(savedSlip)));
    }
  }, [employeeId, month, salaryConfigured, salaryLoading, savedSlip, enrichCalculation]);

  useEffect(() => {
    if (!employeeId || !salaryConfigured || salaryLoading || savedSlip) return;
    let cancelled = false;
    hrAPI
      .calculatePayroll(employeeId, month)
      .then((calc) => {
        if (!cancelled) setCalculation(enrichCalculation(calc as CalculationData));
      })
      .catch(() => {
        if (!cancelled) setCalculation(null);
      });
    return () => {
      cancelled = true;
    };
  }, [employeeId, month, salaryConfigured, salaryLoading, savedSlip, enrichCalculation]);

  const runConfirm = (cfg: Omit<ConfirmState, "open">) => {
    setConfirm({ ...cfg, open: true });
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    setBusy(true);
    try {
      await confirm.onConfirm();
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const savePayslip = async () => {
    if (!employeeId) return toast.error("Select an employee");
    if (!calculation) return toast.error("No payslip data to save");
    setBusy(true);
    try {
      const overrides = {
        earnings: calculation.earnings,
        deductionsDetail: calculation.deductionsDetail,
      };
      const res = (await hrAPI.savePayrollDraft(employeeId, month, overrides)) as {
        payslip: Payslip;
        calculation: CalculationData;
      };
      setCalculation(res.calculation);
      setCurrentDraft(res.payslip);
      toast.success("Payslip saved");
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const publishAll = () => {
    const draftCount = payslips.filter((p) => p.month === month && p.status === "draft").length;
    if (draftCount === 0) {
      return toast.error(`No draft payslips for ${formatPayrollMonth(month)}`);
    }
    runConfirm({
      title: "Publish all payslips?",
      message: `Publish ${draftCount} draft payslip(s) for ${formatPayrollMonth(month)}.\n\nAll employees will see their latest monthly payslip under My Services.`,
      confirmLabel: "Publish all",
      variant: "primary",
      onConfirm: async () => {
        const res = (await hrAPI.publishAllPayslips(month)) as { count: number };
        toast.success(`Published ${res.count ?? draftCount} payslip(s)`);
        await load();
      },
    });
  };

  const deleteDraft = (slip: Payslip) => {
    runConfirm({
      title: "Delete draft?",
      message: `Remove the draft payslip for ${slip.employeeName}?`,
      confirmLabel: "Delete draft",
      variant: "danger",
      onConfirm: async () => {
        await hrAPI.deletePayslipDraft(slip.id);
        if (currentDraft?.id === slip.id) setCurrentDraft(null);
        toast.success("Draft deleted");
        await load();
      },
    });
  };

  const livePdfPayload = useMemo(() => {
    if (!calculation) return null;
    return buildPdfPayload(enrichCalculation(calculation), selectedEmployee?.role);
  }, [calculation, selectedEmployee, enrichCalculation]);

  const isLivePayslipEdit = useCallback(
    (slip: Payslip) =>
      !!calculation && slip.userId === employeeId && slip.month === month,
    [calculation, employeeId, month]
  );

  const loadPdf = useCallback(() => {
    if (!pdfModal) return Promise.reject(new Error("No payslip"));
    if (livePdfPayload && isLivePayslipEdit(pdfModal)) {
      return hrAPI.previewPayslipPdf(livePdfPayload);
    }
    return hrAPI.getPayslipPdf(pdfModal.id);
  }, [pdfModal, livePdfPayload, isLivePayslipEdit]);

  const downloadSlip = async (slip: Payslip) => {
    try {
      const blob =
        livePdfPayload && isLivePayslipEdit(slip)
          ? await hrAPI.previewPayslipPdf(livePdfPayload)
          : await hrAPI.getPayslipPdf(slip.id);
      downloadBlob(blob, `payslip-${slip.month}-${slip.employeeName.replace(/\s+/g, "-")}.pdf`);
      toast.success("PDF downloaded");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Download failed");
    }
  };

  const openPdfModal = (slip: Payslip) => {
    setPdfModal(slip);
    setPdfKey((k) => k + 1);
  };

  const activeEmployees = employees.filter((e) => e.id !== "Admin");

  const previewDocument = useMemo((): PayslipDocumentData | null => {
    if (calculation) {
      const doc = calculationToDocument(enrichCalculation(calculation));
      if (!doc.role && selectedEmployee?.role) doc.role = selectedEmployee.role;
      return doc;
    }
    if (currentDraft) {
      const doc = { ...currentDraft };
      if (!doc.role && selectedEmployee?.role) doc.role = selectedEmployee.role;
      return doc;
    }
    return null;
  }, [calculation, currentDraft, selectedEmployee, enrichCalculation]);

  return (
    <div className="space-y-6">
      <HrPageHeader
        badge="Human Resources"
        title="Payroll"
        subtitle="Payroll auto-calculates from attendance. Adjust if needed, save, then publish all for the month."
      />

      <div className="flex flex-wrap items-center gap-2 text-sm">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
                step >= i ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {step > i ? <IoCheckmarkCircle className="w-4 h-4" /> : <span className="w-4 text-center">{i + 1}</span>}
              {label}
            </span>
            {i < STEPS.length - 1 && <IoChevronForward className="text-gray-300 w-4 h-4" />}
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-6 items-start">
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-gray-50">
              <h2 className="font-semibold text-gray-900">1. Select employee &amp; period</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600">Payroll month</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setCalculation(null);
                  }}
                  className="mt-1 w-full px-3 py-2.5 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">Employee</label>
                <select
                  value={employeeId}
                  onChange={(e) => {
                    setEmployeeId(e.target.value);
                    setCalculation(null);
                  }}
                  className="mt-1 w-full px-3 py-2.5 border rounded-lg text-sm bg-white"
                >
                  <option value="">— Select employee —</option>
                  {activeEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.employeeId ? `${e.employeeId} · ` : ""}
                      {e.name} · {e.role}
                    </option>
                  ))}
                </select>
              </div>
              {selectedEmployee && (() => {
                const profileConfigured = Boolean(
                  selectedEmployee.joinDate &&
                    selectedEmployee.accountNumber?.trim() &&
                    selectedEmployee.panNumber?.trim() &&
                    selectedEmployee.uanNumber?.trim()
                );
                return (
                <div className="rounded-lg border border-gray-200 bg-gray-50/80 overflow-hidden text-sm">
                  <div className="px-4 py-3 border-b border-gray-200 bg-white">
                    <p className="font-semibold text-gray-900">{selectedEmployee.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600">
                      <EmployeeCodeBadge code={selectedEmployee.employeeId} className="text-xs" />
                      <span>{selectedEmployee.email}</span>
                      <span>Role: {selectedEmployee.role}</span>
                    </div>
                  </div>

                  <div className="px-4 py-3 space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-2">
                        Profile details (for payslip)
                      </p>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div className="flex justify-between sm:block gap-2">
                          <dt className="text-gray-500">Joining date</dt>
                          <dd className="font-medium text-gray-900 sm:mt-0.5">
                            {selectedEmployee.joinDate
                              ? formatLetterDate(selectedEmployee.joinDate)
                              : "—"}
                          </dd>
                        </div>
                        <div className="flex justify-between sm:block gap-2">
                          <dt className="text-gray-500">Account no.</dt>
                          <dd className="font-medium text-gray-900 sm:mt-0.5">
                            {selectedEmployee.accountNumber || "—"}
                          </dd>
                        </div>
                        <div className="flex justify-between sm:block gap-2">
                          <dt className="text-gray-500">PAN</dt>
                          <dd className="font-medium text-gray-900 sm:mt-0.5">
                            {selectedEmployee.panNumber || "—"}
                          </dd>
                        </div>
                        <div className="flex justify-between sm:block gap-2">
                          <dt className="text-gray-500">UAN</dt>
                          <dd className="font-medium text-gray-900 sm:mt-0.5">
                            {selectedEmployee.uanNumber || "—"}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      {profileConfigured ? (
                        <div className="flex items-center gap-2 text-xs text-green-800">
                          <IoCheckmarkCircle className="w-4 h-4 shrink-0" />
                          <p>
                            Profile details: <strong>Configured</strong>
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-start text-amber-800 text-xs">
                          <IoWarningOutline className="w-4 h-4 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-semibold">Profile details not configured</p>
                            <p>
                              Store or update phone, joining date, account, PAN, UAN and manager under{" "}
                              <Link href="/dashboard/hr/employees" className="underline font-medium">
                                HR → Employees → Edit profile
                              </Link>
                              .
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      {salaryLoading ? (
                        <p className="text-xs text-gray-500">Checking salary structure…</p>
                      ) : salaryConfigured ? (
                        <div className="flex items-center gap-2 text-xs text-green-800">
                          <IoCheckmarkCircle className="w-4 h-4 shrink-0" />
                          <p>
                            Salary structure: <strong>Configured</strong>
                            {salaryStatus?.salary?.monthlyGross != null && (
                              <> · Monthly gross {formatInr(salaryStatus.salary.monthlyGross)}</>
                            )}
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-start text-amber-800 text-xs">
                          <IoWarningOutline className="w-4 h-4 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-semibold">Salary structure not configured</p>
                            <p>
                              Configure under{" "}
                              <Link href="/dashboard/hr/employees" className="underline font-medium">
                                HR → Employees → Salary structure
                              </Link>{" "}
                              before generating payroll.
                            </p>
                            {salaryStatus?.errors?.length ? (
                              <ul className="list-disc list-inside">
                                {salaryStatus.errors.map((err) => (
                                  <li key={err}>{err}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                );
              })()}
            </div>
          </div>

          {calculation && canGenerate && (
            <PayslipEditPanel
              data={calculation}
              onChange={setCalculation}
              onSave={savePayslip}
              saving={busy}
              saveDisabled={!employeeId || !salaryConfigured}
            />
          )}

          {currentDraft && (
            <div className="bg-white border rounded-xl p-4 text-sm">
              <p className="font-semibold text-gray-900">Current payslip</p>
              <p className="text-gray-600 mt-1">
                {currentDraft.employeeName} · {formatPayrollMonth(currentDraft.month)}
              </p>
              <span
                className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                  currentDraft.status === "published"
                    ? "bg-gray-200 text-gray-800"
                    : currentDraft.status === "draft"
                      ? "bg-amber-100 text-amber-900"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {currentDraft.status}
              </span>
              {currentDraft.status === "draft" && canGenerate && (
                <button
                  type="button"
                  onClick={() => deleteDraft(currentDraft)}
                  className="block mt-3 text-red-600 text-xs font-medium hover:underline"
                >
                  Delete draft
                </button>
              )}
            </div>
          )}
        </div>

        <div className="xl:col-span-3 space-y-4">
          {previewDocument ? (
            <>
              <PayslipDocument data={previewDocument} />
              {currentDraft && (
                <HrActionToolbar
                  layout="row"
                  actions={[
                    { id: "pv", label: "Preview PDF", icon: "preview", onClick: () => openPdfModal(currentDraft) },
                    { id: "dl", label: "Download", icon: "download", onClick: () => downloadSlip(currentDraft) },
                  ]}
                />
              )}
            </>
          ) : (
            <div className="bg-white border border-dashed rounded-xl p-10 text-center text-gray-400 text-sm">
              {employeeId && !salaryConfigured && !salaryLoading
                ? "Configure salary structure before calculating payroll"
                : "Select an employee to auto-load the payslip preview"}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-xl min-w-0 max-w-full">
        <div className="px-5 py-3 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <span className="font-semibold text-sm whitespace-nowrap">
              Payroll registry (audit) — {formatPayrollMonth(month)}
            </span>
            <HrListFilters
              compact
              search={registrySearch}
              role={registryRole}
              onSearchChange={setRegistrySearch}
              onRoleChange={setRegistryRole}
            />
          </div>
          {canGenerate && (
            <button
              type="button"
              onClick={publishAll}
              disabled={busy || payslips.filter((p) => p.status === "draft").length === 0}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 shrink-0"
            >
              Publish all drafts for {formatPayrollMonth(month)}
            </button>
          )}
        </div>
        {loading ? (
          <p className="p-5 text-gray-500 text-sm">Loading…</p>
        ) : payslips.length === 0 ? (
          <p className="p-5 text-gray-500 text-sm">No payslips processed yet.</p>
        ) : (
          <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-2">Employee</th>
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2">Net (INR)</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div>{p.employeeName}</div>
                      <EmployeeCodeBadge code={p.employeeId} />
                    </td>
                    <td className="px-4 py-2">{formatPayrollMonth(p.month)}</td>
                    <td className="px-4 py-2">{p.netPay.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          p.status === "published"
                            ? "bg-gray-200 text-gray-800"
                            : p.status === "draft"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => openPdfModal(p)} className="text-gray-800 hover:underline">
                          Preview
                        </button>
                        <button type="button" onClick={() => downloadSlip(p)} className="text-gray-700 hover:underline">
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setPdfModal(null)}>
          <div
            className="bg-gray-100 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">PDF — {pdfModal.employeeName}</h3>
              <button type="button" onClick={() => setPdfModal(null)} className="text-sm text-gray-500 hover:text-gray-800">
                Close
              </button>
            </div>
            <PayslipDocument
              data={
                pdfModal && isLivePayslipEdit(pdfModal) && previewDocument ? previewDocument : pdfModal
              }
            />
            <PdfPreviewPanel
              title="Official PDF"
              loadPdf={loadPdf}
              refreshKey={
                livePdfPayload && pdfModal && isLivePayslipEdit(pdfModal)
                  ? `${pdfKey}-${calculation?.presentDays}-${calculation?.absentDays}-${calculation?.netPay}-${calculation?.deductionsDetail?.lop}`
                  : pdfKey
              }
            />
            <HrActionToolbar
              layout="row"
              actions={[
                { id: "d", label: "Download", icon: "download", onClick: () => downloadSlip(pdfModal) },
              ]}
            />
          </div>
        </div>
      )}

      {confirm && (
        <ConfirmDialog
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          variant={confirm.variant}
          loading={busy}
          onConfirm={handleConfirm}
          onCancel={() => !busy && setConfirm(null)}
        />
      )}
    </div>
  );
}
