"use client";

import { useEffect, useState } from "react";
import { formatInr } from "./hrDocumentUtils";
import { computePayrollTotals } from "@/lib/payrollTotals";
import type { CalculationData } from "./PayslipCalculationPreview";

type Props = {
  data: CalculationData;
  onChange: (data: CalculationData) => void;
  onSave?: () => void;
  saving?: boolean;
  saveDisabled?: boolean;
};

const fields = [
  { key: "basic", label: "Basic Pay", section: "earnings" as const },
  { key: "hra", label: "HRA", section: "earnings" as const },
  { key: "da", label: "DA", section: "earnings" as const },
  { key: "allowances", label: "Allowances", section: "earnings" as const },
  { key: "incentive", label: "Incentive", section: "earnings" as const },
  { key: "pf", label: "Provident Fund", section: "deductions" as const },
  { key: "esi", label: "ESI", section: "deductions" as const },
  { key: "tds", label: "TDS", section: "deductions" as const },
  { key: "professionalTax", label: "Professional Tax", section: "deductions" as const },
  { key: "lop", label: "Loss of Pay", section: "deductions" as const },
];

function round2(x: number) {
  return Math.round(x * 100) / 100;
}

function syncAttendance(
  data: CalculationData,
  patch: { presentDays?: number; absentDays?: number }
): CalculationData {
  const calendar = data.workingDays;
  const paid = data.paidLeaveDays ?? 0;
  const unpaid = data.unpaidLeaveDays ?? 0;
  const next = { ...data };
  if (patch.presentDays != null) {
    next.presentDays = Math.max(0, patch.presentDays);
    next.absentDays = Math.max(0, round2(calendar - next.presentDays - paid - unpaid));
  } else if (patch.absentDays != null) {
    next.absentDays = Math.max(0, patch.absentDays);
    next.presentDays = Math.max(0, round2(calendar - next.absentDays - paid - unpaid));
  }
  return next;
}

function resolveMonthlyGross(data: CalculationData) {
  if (data.monthlyGross && data.monthlyGross > 0) return data.monthlyGross;
  return round2(data.grossPay + (data.deductionsDetail?.lop ?? 0));
}

function scaleEarningsForPresentChange(prev: CalculationData, next: CalculationData): CalculationData {
  const calendarDays = next.workingDays;
  const prevPresent = prev.presentDays;
  const newPresent = next.presentDays;
  if (newPresent === prevPresent) return next;

  let scale: number | null = null;
  if (prevPresent > 0) {
    scale = newPresent / prevPresent;
  } else if (calendarDays > 0) {
    const monthlyGross = resolveMonthlyGross(prev);
    const paid = prev.paidLeaveDays ?? 0;
    if (monthlyGross > 0) {
      const targetGross = round2(monthlyGross * ((newPresent + paid) / calendarDays));
      const currentGross = prev.grossPay || 0;
      if (currentGross > 0) scale = targetGross / currentGross;
    }
  }

  if (scale != null && Number.isFinite(scale) && scale !== 1) {
    next.earnings = {
      basic: round2(prev.earnings.basic * scale),
      hra: round2(prev.earnings.hra * scale),
      da: round2(prev.earnings.da * scale),
      allowances: round2(prev.earnings.allowances * scale),
      incentive: round2((prev.earnings.incentive ?? 0) * scale),
      total: 0,
    };
  }
  return next;
}

export default function PayslipEditPanel({ data, onChange, onSave, saving, saveDisabled }: Props) {
  const [form, setForm] = useState(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const apply = (next: CalculationData, recalcLopFromPackage = false) => {
    const monthlyGross = resolveMonthlyGross(next);
    const totals = computePayrollTotals(next.earnings, next.deductionsDetail, {
      monthlyGross: monthlyGross > 0 ? monthlyGross : undefined,
      recalcLopFromPackage,
    });
    const merged: CalculationData = {
      ...next,
      monthlyGross: monthlyGross > 0 ? monthlyGross : next.monthlyGross,
      earnings: totals.earnings,
      deductionsDetail: totals.deductionsDetail,
      grossPay: totals.grossPay,
      deductions: totals.deductions,
      netPay: totals.netPay,
    };
    setForm(merged);
    onChange(merged);
  };

  const setField = (section: "earnings" | "deductions", key: string, value: string) => {
    const next = { ...form };
    if (section === "earnings") {
      next.earnings = { ...next.earnings, [key]: Number(value) || 0 };
      apply(next, true);
    } else {
      next.deductionsDetail = { ...next.deductionsDetail, [key]: Number(value) || 0 };
      apply(next, false);
    }
  };

  const setWorkingDays = (value: string) => {
    const newPresent = Math.max(0, Number(value) || 0);
    let next = syncAttendance(form, { presentDays: newPresent });
    next = scaleEarningsForPresentChange(form, next);
    apply(next, true);
  };

  const setLopDays = (value: string) => {
    const newAbsent = Math.max(0, Number(value) || 0);
    let next = syncAttendance(form, { absentDays: newAbsent });
    next = scaleEarningsForPresentChange(form, next);
    apply(next, true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <p className="text-sm font-semibold text-gray-900">Manual adjustment (optional)</p>
      <p className="text-xs text-gray-500">
        In-hand salary = gross earnings − total deductions (including loss of pay). Updates apply to the payslip preview
        instantly.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600">Working Days</label>
          <input
            type="number"
            min={0}
            step="0.5"
            className="w-full mt-1 px-2 py-1.5 border rounded text-sm"
            value={form.presentDays}
            onChange={(e) => setWorkingDays(e.target.value)}
          />
          <p className="text-[11px] text-gray-400 mt-1">Present days (auto from attendance).</p>
        </div>
        <div>
          <label className="text-xs text-gray-600">LOP Days</label>
          <input
            type="number"
            min={0}
            step="0.5"
            className="w-full mt-1 px-2 py-1.5 border rounded text-sm"
            value={form.absentDays}
            onChange={(e) => setLopDays(e.target.value)}
          />
          <p className="text-[11px] text-gray-400 mt-1">Loss-of-pay days (auto from attendance).</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {fields.map((f) => {
          const val =
            f.section === "earnings"
              ? form.earnings[f.key as keyof typeof form.earnings]
              : form.deductionsDetail[f.key as keyof typeof form.deductionsDetail];
          return (
            <div key={f.key}>
              <label className="text-xs text-gray-600">{f.label}</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className="w-full mt-1 px-2 py-1.5 border rounded text-sm"
                value={val}
                onChange={(e) => setField(f.section, f.key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Total deductions</span>
          <span className="tabular-nums font-medium">{formatInr(form.deductions)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-semibold">
          <span>In-Hand Salary</span>
          <span className="text-green-700 tabular-nums">{formatInr(form.netPay)}</span>
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

