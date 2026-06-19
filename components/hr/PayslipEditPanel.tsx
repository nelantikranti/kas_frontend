"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { formatInr } from "./hrDocumentUtils";
import { computeAttendancePayroll, computeMonthlyPackage, PAYROLL_TWD, type SalaryComponentsInput } from "@/lib/payrollCalculation";
import type { CalculationData } from "./PayslipCalculationPreview";

type Props = {
  data: CalculationData;
  salaryComponents: SalaryComponentsInput | null;
  onChange: (data: CalculationData) => void;
  onSave?: () => void;
  saving?: boolean;
  saveDisabled?: boolean;
};

type Patch = Partial<{
  presentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  absentDays: number;
  incentive: number;
  pf: number;
  esi: number;
  tds: number;
  professionalTax: number;
}>;

const LABEL_CLASS = "block text-xs text-gray-600 min-h-[2rem] leading-snug flex items-end";
const INPUT_CLASS = "w-full mt-1.5 px-2.5 py-2 border border-gray-300 rounded-md text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <span className={LABEL_CLASS}>{label}</span>
      {children}
    </div>
  );
}

function round2(x: number) {
  return Math.round(x * 100) / 100;
}

function resolveAbsent(data: CalculationData, patch: Patch): number {
  if (patch.absentDays != null) return Math.max(0, patch.absentDays);
  if (patch.presentDays != null) return Math.max(0, PAYROLL_TWD - patch.presentDays);
  return Math.max(0, data.absentDays ?? PAYROLL_TWD - data.presentDays);
}

function deductionOverridesFrom(data: CalculationData, patch: Patch) {
  return {
    pf: patch.pf ?? data.deductionsDetail.pf,
    esi: patch.esi ?? data.deductionsDetail.esi,
    tds: patch.tds ?? data.deductionsDetail.tds,
    professionalTax: patch.professionalTax ?? data.deductionsDetail.professionalTax,
  };
}

function recalc(data: CalculationData, salaryComponents: SalaryComponentsInput, patch: Patch): CalculationData {
  const presentDays = patch.presentDays ?? data.presentDays;
  const absentDays = resolveAbsent(data, patch);
  const result = computeAttendancePayroll({
    components: salaryComponents,
    presentDays,
    paidLeaveDays: patch.paidLeaveDays ?? data.paidLeaveDays ?? 0,
    unpaidLeaveDays: patch.unpaidLeaveDays ?? data.unpaidLeaveDays,
    manualIncentive: patch.incentive ?? data.earnings.incentive ?? 0,
    absentDays,
    deductionOverrides: deductionOverridesFrom(data, patch),
  });
  return {
    ...data,
    workingDays: result.workingDays,
    presentDays: result.presentDays,
    paidLeaveDays: result.paidLeaveDays,
    unpaidLeaveDays: result.unpaidLeaveDays,
    absentDays: result.absentDays,
    attendanceRatio: result.attendanceRatio,
    monthlyGross: result.monthlyPackage,
    dayRate: result.dayRate,
    earnings: result.earnings,
    deductionsDetail: result.deductionsDetail,
    grossPay: result.grossPay,
    deductions: result.deductions,
    netPay: result.netPay,
  };
}

function numInput(onChange: (v: number) => void, props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      className={INPUT_CLASS}
      onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
      {...props}
    />
  );
}

export default function PayslipEditPanel({
  data,
  salaryComponents,
  onChange,
  onSave,
  saving,
  saveDisabled,
}: Props) {
  const [form, setForm] = useState(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const summary = useMemo(() => {
    const pkg = salaryComponents ? computeMonthlyPackage(salaryComponents) : form.monthlyGross ?? 0;
    const dayRate = PAYROLL_TWD > 0 ? round2(pkg / PAYROLL_TWD) : 0;
    const lopAmount = round2(dayRate * form.unpaidLeaveDays);
    const monthlyPay = round2(pkg - lopAmount);
    const statutory =
      (form.deductionsDetail?.pf ?? 0) +
      (form.deductionsDetail?.esi ?? 0) +
      (form.deductionsDetail?.tds ?? 0) +
      (form.deductionsDetail?.professionalTax ?? 0);
    return { pkg, dayRate, lopAmount, monthlyPay, statutory };
  }, [form, salaryComponents]);

  const apply = (patch: Patch) => {
    if (!salaryComponents) return;
    const next = recalc(form, salaryComponents, patch);
    setForm(next);
    onChange(next);
  };

  if (!salaryComponents) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        Save salary structure for this employee before adjusting the payslip.
      </div>
    );
  }

  const d = form.deductionsDetail;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">Payslip adjustment</p>
        <p className="text-xs text-gray-500 mt-1">
          Monthly pay = Package − (Unpaid leave × day rate). LOP is already included there — only statutory
          amounts are deducted below. Total credit = Monthly pay + Incentive.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Package</p>
          <p className="font-semibold tabular-nums mt-0.5">{formatInr(summary.pkg)}</p>
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
          <p className="text-xs text-gray-500">Day rate (÷ {PAYROLL_TWD})</p>
          <p className="font-semibold tabular-nums mt-0.5">{formatInr(summary.dayRate)}</p>
        </div>
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 sm:col-span-2">
          <p className="text-xs text-gray-600">Monthly pay (Package − LOP)</p>
          <p className="font-semibold tabular-nums text-green-800 mt-0.5">{formatInr(summary.monthlyPay)}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1.5">
          Attendance
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-4">
          <Field label="TWD">
            <input type="number" readOnly className={`${INPUT_CLASS} bg-gray-50`} value={PAYROLL_TWD} />
          </Field>
          <Field label="Present">
            {numInput(
              (v) => apply({ presentDays: Math.min(PAYROLL_TWD, v) }),
              { min: 0, max: PAYROLL_TWD, step: "0.5", value: form.presentDays }
            )}
          </Field>
          <Field label="Absent (TWD − Present)">
            {numInput((v) => apply({ absentDays: v }), { min: 0, step: "0.5", value: form.absentDays })}
          </Field>
          <Field label="Paid leave">
            {numInput((v) => apply({ paidLeaveDays: v }), { min: 0, step: "0.5", value: form.paidLeaveDays ?? 0 })}
          </Field>
          <Field label="Unpaid leave (LOP days)">
            {numInput((v) => apply({ unpaidLeaveDays: v }), { min: 0, step: "0.5", value: form.unpaidLeaveDays })}
          </Field>
          <Field label="Incentive (manual)">
            {numInput((v) => apply({ incentive: v }), { min: 0, step: "0.01", value: form.earnings.incentive })}
          </Field>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1.5">
          Statutory deductions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4">
          <Field label="Provident Fund (PF)">
            {numInput((v) => apply({ pf: v }), { min: 0, step: "0.01", value: d.pf })}
          </Field>
          <Field label="ESI">
            {numInput((v) => apply({ esi: v }), { min: 0, step: "0.01", value: d.esi })}
          </Field>
          <Field label="TDS">
            {numInput((v) => apply({ tds: v }), { min: 0, step: "0.01", value: d.tds })}
          </Field>
          <Field label="Professional Tax">
            {numInput((v) => apply({ professionalTax: v }), { min: 0, step: "0.01", value: d.professionalTax })}
          </Field>
        </div>
      </div>

      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4 text-gray-600">
          <span>Monthly + Incentive (total credit)</span>
          <span className="tabular-nums font-medium shrink-0">{formatInr(form.grossPay)}</span>
        </div>
        <div className="flex justify-between gap-4 text-gray-600">
          <span>Statutory deductions</span>
          <span className="tabular-nums font-medium shrink-0">{formatInr(summary.statutory)}</span>
        </div>
        <div className="flex justify-between items-center gap-4 pt-2 border-t border-gray-200 font-semibold">
          <span>In-Hand Salary</span>
          <span className="text-green-700 tabular-nums shrink-0">{formatInr(form.netPay)}</span>
        </div>
      </div>

      {onSave && (
        <button
          type="button"
          onClick={onSave}
          disabled={saving || saveDisabled}
          className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      )}
    </div>
  );
}
