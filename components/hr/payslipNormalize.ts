import type { PayslipDeductionsDetail, PayslipDocumentData, PayslipEarnings } from "./PayslipDocument";

function num(v: unknown): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeEarningsRow(e: PayslipEarnings, grossPay: number): PayslipEarnings {
  const basic = num(e.basic);
  const hra = num(e.hra);
  const da = num(e.da);
  const allowances = num(e.allowances);
  const incentive = num(e.incentive);
  const total = num(e.total) > 0 ? num(e.total) : basic + hra + da + allowances + incentive || num(grossPay);
  return { basic, hra, da, allowances, incentive, total };
}

function normalizeDeductionsRow(d: PayslipDeductionsDetail, deductions: number): PayslipDeductionsDetail {
  const pf = num(d.pf);
  const esi = num(d.esi);
  const tds = num(d.tds);
  const professionalTax = num(d.professionalTax);
  const lop = num(d.lop);
  const total = num(d.total) > 0 ? num(d.total) : pf + esi + tds + professionalTax + lop || num(deductions);
  return { pf, esi, tds, professionalTax, lop, total };
}

function hasEarningsBreakdown(e?: PayslipEarnings | null): boolean {
  if (!e) return false;
  return num(e.total) > 0 || num(e.basic) > 0 || num(e.hra) > 0 || num(e.da) > 0 || num(e.allowances) > 0 || num(e.incentive) > 0;
}

function hasDeductionsBreakdown(d?: PayslipDeductionsDetail | null): boolean {
  if (!d) return false;
  return (
    num(d.total) > 0 ||
    num(d.pf) > 0 ||
    num(d.esi) > 0 ||
    num(d.tds) > 0 ||
    num(d.professionalTax) > 0 ||
    num(d.lop) > 0
  );
}

export function resolvePayslipEarnings(data: PayslipDocumentData): PayslipEarnings {
  const grossPay = num(data.grossPay);
  if (hasEarningsBreakdown(data.earnings)) {
    return normalizeEarningsRow(data.earnings!, grossPay);
  }
  const netPay = num(data.netPay);
  const deductions = num(data.deductions);
  const gross = grossPay > 0 ? grossPay : netPay > 0 ? netPay + deductions : 0;
  if (gross > 0) {
    return { basic: gross, hra: 0, da: 0, allowances: 0, incentive: 0, total: gross };
  }
  return { basic: 0, hra: 0, da: 0, allowances: 0, incentive: 0, total: 0 };
}

export function resolvePayslipDeductions(data: PayslipDocumentData): PayslipDeductionsDetail {
  const deductions = num(data.deductions);
  if (hasDeductionsBreakdown(data.deductionsDetail)) {
    return normalizeDeductionsRow(data.deductionsDetail!, deductions);
  }
  return { pf: 0, esi: 0, tds: 0, professionalTax: 0, lop: deductions, total: deductions };
}

export function normalizePayslipDocument(data: PayslipDocumentData): PayslipDocumentData {
  const earnings = resolvePayslipEarnings(data);
  const deductionsDetail = resolvePayslipDeductions(data);
  const grossPay = num(data.grossPay) > 0 ? num(data.grossPay) : earnings.total;
  const deductions = num(data.deductions) > 0 ? num(data.deductions) : deductionsDetail.total;
  const lop = deductionsDetail.lop;
  const netPay =
    lop <= grossPay
      ? Math.max(0, round2(grossPay - deductions))
      : num(data.netPay) > 0
        ? num(data.netPay)
        : Math.max(0, round2(grossPay - (deductions - lop)));
  return {
    ...data,
    grossPay,
    deductions,
    netPay,
    earnings,
    deductionsDetail,
  };
}

function round2(x: number) {
  return Math.round(x * 100) / 100;
}
