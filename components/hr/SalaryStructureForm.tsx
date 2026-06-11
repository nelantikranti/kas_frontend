"use client";

import { useEffect, useMemo, useState } from "react";
import { formatInr } from "./hrDocumentUtils";

export type SalaryFormData = {
  basic: string;
  hra: string;
  da: string;
  allowances: string;
  pf: string;
  esi: string;
  tds: string;
  professionalTax: string;
};

export const emptySalaryForm: SalaryFormData = {
  basic: "",
  hra: "",
  da: "",
  allowances: "",
  pf: "",
  esi: "",
  tds: "",
  professionalTax: "",
};

type Props = {
  initial?: Partial<SalaryFormData> | null;
  onSave: (data: SalaryFormData) => Promise<void>;
  disabled?: boolean;
};

export default function SalaryStructureForm({ initial, onSave, disabled }: Props) {
  const [form, setForm] = useState<SalaryFormData>(emptySalaryForm);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        basic: initial.basic != null ? String(initial.basic) : "",
        hra: initial.hra != null ? String(initial.hra) : "",
        da: initial.da != null ? String(initial.da) : "",
        allowances: initial.allowances != null ? String(initial.allowances) : "",
        pf: initial.pf != null ? String(initial.pf) : "",
        esi: initial.esi != null ? String(initial.esi) : "",
        tds: initial.tds != null ? String(initial.tds) : "",
        professionalTax: initial.professionalTax != null ? String(initial.professionalTax) : "",
      });
    } else {
      setForm(emptySalaryForm);
    }
  }, [initial]);

  const gross = useMemo(() => {
    const n = (v: string) => Number(v) || 0;
    return n(form.basic) + n(form.hra) + n(form.da) + n(form.allowances);
  }, [form]);

  const field = (label: string, key: keyof SalaryFormData, required?: boolean) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <input
        type="number"
        min={0}
        step="0.01"
        disabled={disabled || busy}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (Number(form.basic) <= 0) return;
        setBusy(true);
        try {
          await onSave(form);
        } finally {
          setBusy(false);
        }
      }}
    >
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Earnings (monthly)</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {field("Basic Pay", "basic", true)}
          {field("HRA", "hra")}
          {field("DA", "da")}
          {field("Allowances", "allowances")}
        </div>
        <p className="mt-2 text-sm text-gray-700">
          Gross salary: <strong>{formatInr(gross)}</strong>
        </p>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Statutory deductions (monthly)</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {field("PF", "pf")}
          {field("ESI", "esi")}
          {field("TDS", "tds")}
          {field("Professional Tax", "professionalTax")}
        </div>
      </div>
      <button
        type="submit"
        disabled={disabled || busy || Number(form.basic) <= 0}
        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save salary structure"}
      </button>
    </form>
  );
}
