export type EarningsInput = {
  basic: number | string;
  hra: number | string;
  da: number | string;
  allowances: number | string;
};

export type DeductionsInput = {
  pf: number | string;
  esi: number | string;
  tds: number | string;
  professionalTax: number | string;
  lop: number | string;
};

function n(v: unknown): number {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function round2(x: number) {
  return Math.round(x * 100) / 100;
}

export type PayrollTotalsOptions = {
  monthlyGross?: number;
  /** When true, re-derive LOP from monthly package − earned gross (earnings edit). */
  recalcLopFromPackage?: boolean;
};

export function computePayrollTotals(
  earnings: EarningsInput,
  deductions: DeductionsInput,
  options?: PayrollTotalsOptions
) {
  const basic = n(earnings.basic);
  const hra = n(earnings.hra);
  const da = n(earnings.da);
  const allowances = n(earnings.allowances);
  const gross = round2(basic + hra + da + allowances);

  const pf = n(deductions.pf);
  const esi = n(deductions.esi);
  const tds = n(deductions.tds);
  const professionalTax = n(deductions.professionalTax);
  const statutory = round2(pf + esi + tds + professionalTax);

  const monthlyGross = options?.monthlyGross;
  let lop = round2(n(deductions.lop));
  if (options?.recalcLopFromPackage && monthlyGross != null && monthlyGross > 0) {
    lop = round2(Math.max(0, monthlyGross - gross));
  }

  const totalDeductions = round2(statutory + lop);
  // When LOP ≤ gross it is a payroll deduction; when LOP > gross it is attendance loss (already in earnings).
  const inHandSalary =
    lop <= gross
      ? round2(Math.max(0, gross - totalDeductions))
      : round2(Math.max(0, gross - statutory));

  return {
    earnings: { basic, hra, da, allowances, total: gross },
    deductionsDetail: { pf, esi, tds, professionalTax, lop, total: totalDeductions },
    grossPay: gross,
    deductions: totalDeductions,
    netPay: inHandSalary,
    inHandSalary,
  };
}
