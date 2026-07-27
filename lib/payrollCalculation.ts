/** HR payroll always uses 30 days for day-rate calculation. */
export const PAYROLL_TWD = 30;

export type SalaryComponentsInput = {
  basic: number;
  hra: number;
  da: number;
  allowances: number;
  pf: number;
  esi: number;
  tds: number;
  professionalTax: number;
};

function round2(x: number) {
  return Math.round(x * 100) / 100;
}

export function computeMonthlyPackage(
  components: Pick<SalaryComponentsInput, "basic" | "hra" | "da" | "allowances">
): number {
  return round2(components.basic + components.hra + components.da + components.allowances);
}

/** Re-apply salary structure package to an existing payslip calculation (attendance/incentive preserved). */
export function refreshCalculationFromSalary(
  data: {
    presentDays: number;
    paidLeaveDays?: number;
    unpaidLeaveDays: number;
    absentDays: number;
    earnings: { incentive?: number };
    deductionsDetail: { pf: number; esi: number; tds: number; professionalTax: number };
  },
  components: SalaryComponentsInput
) {
  return computeAttendancePayroll({
    components,
    presentDays: data.presentDays,
    paidLeaveDays: data.paidLeaveDays ?? 0,
    unpaidLeaveDays: data.unpaidLeaveDays,
    manualIncentive: data.earnings.incentive ?? 0,
    absentDays: data.absentDays,
    deductionOverrides: {
      pf: data.deductionsDetail.pf,
      esi: data.deductionsDetail.esi,
      tds: data.deductionsDetail.tds,
      professionalTax: data.deductionsDetail.professionalTax,
    },
  });
}

export function computeDayRate(monthlyPackage: number): number {
  return PAYROLL_TWD > 0 ? round2(monthlyPackage / PAYROLL_TWD) : 0;
}

/** Avoid day-rate rounding drift when present + unpaid leave = TWD (e.g. full month → exact package). */
function computeAttendancePay(
  monthlyPackage: number,
  dayRate: number,
  payableDays: number,
  unpaidLeaveDays: number
) {
  const lop = round2(dayRate * unpaidLeaveDays);
  const attendancePay =
    round2(payableDays + unpaidLeaveDays) === PAYROLL_TWD
      ? round2(monthlyPackage - lop)
      : round2(dayRate * payableDays);
  return { attendancePay, lop };
}

export function computeAttendancePayroll(input: {
  components: SalaryComponentsInput;
  presentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  manualIncentive?: number;
  absentDays?: number;
  deductionOverrides?: Partial<Pick<SalaryComponentsInput, "pf" | "esi" | "tds" | "professionalTax">>;
}) {
  const { components, presentDays, paidLeaveDays, unpaidLeaveDays } = input;
  const manualIncentive = round2(input.manualIncentive ?? 0);
  const monthlyPackage = computeMonthlyPackage(components);
  const dayRate = computeDayRate(monthlyPackage);
  // Paid leave is payable; unpaid leave is LOP (handled in computeAttendancePay).
  const payableDays = round2(presentDays + paidLeaveDays);
  const { attendancePay, lop } = computeAttendancePay(monthlyPackage, dayRate, payableDays, unpaidLeaveDays);
  const absentDays =
    input.absentDays != null
      ? round2(input.absentDays)
      : Math.max(0, round2(PAYROLL_TWD - presentDays - paidLeaveDays));
  const attendanceRatio = PAYROLL_TWD > 0 ? round2(payableDays / PAYROLL_TWD) : 0;
  const ratio = monthlyPackage > 0 ? attendancePay / monthlyPackage : 0;

  const basic = round2(components.basic * ratio);
  const hra = round2(components.hra * ratio);
  const da = round2(components.da * ratio);
  const allowances = round2(components.allowances * ratio);
  const earningsTotal = round2(attendancePay + manualIncentive);

  const pf = round2(input.deductionOverrides?.pf ?? components.pf);
  const esi = round2(input.deductionOverrides?.esi ?? components.esi);
  const tds = round2(input.deductionOverrides?.tds ?? components.tds);
  const professionalTax = round2(input.deductionOverrides?.professionalTax ?? components.professionalTax);
  const statutory = round2(pf + esi + tds + professionalTax);
  /** LOP is already reflected in attendance pay (present × day rate); do not deduct again. */
  const totalDeductions = statutory;
  const netPay = round2(Math.max(0, earningsTotal - totalDeductions));

  return {
    workingDays: PAYROLL_TWD,
    presentDays: round2(presentDays),
    paidLeaveDays: round2(paidLeaveDays),
    unpaidLeaveDays: round2(unpaidLeaveDays),
    absentDays,
    attendanceRatio,
    monthlyPackage,
    dayRate,
    payableDays,
    attendancePay,
    earnings: {
      basic,
      hra,
      da,
      allowances,
      incentive: manualIncentive,
      total: earningsTotal,
    },
    deductionsDetail: {
      pf,
      esi,
      tds,
      professionalTax,
      lop,
      total: totalDeductions,
    },
    grossPay: earningsTotal,
    deductions: totalDeductions,
    netPay,
    inHandSalary: netPay,
  };
}
