export function formatLopDeductionLabel(_unpaidLeaveDays?: number): string {
  return "LOP";
}

export type PayslipDeductionLine = { label: string; amount: number };

export function buildPayslipDeductionLines(
  detail: { pf: number; esi: number; tds: number; professionalTax: number; lop: number },
  _unpaidLeaveDays?: number
): PayslipDeductionLine[] {
  const lines: PayslipDeductionLine[] = [];
  if (detail.lop > 0) {
    lines.push({ label: formatLopDeductionLabel(), amount: detail.lop });
  }
  lines.push(
    { label: "Provident Fund", amount: detail.pf },
    { label: "ESI", amount: detail.esi },
    { label: "TDS", amount: detail.tds },
    { label: "Professional Tax", amount: detail.professionalTax }
  );
  return lines;
}

export function statutoryDeductionTotal(detail: {
  pf: number;
  esi: number;
  tds: number;
  professionalTax: number;
}): number {
  return detail.pf + detail.esi + detail.tds + detail.professionalTax;
}
