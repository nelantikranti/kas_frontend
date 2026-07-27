"use client";

import HrDocumentLetterhead from "./HrDocumentLetterhead";
import { formatInr, formatLetterDate, formatPayrollMonth, maskAccountNumber } from "./hrDocumentUtils";
import { normalizePayslipDocument, resolvePayslipDeductions, resolvePayslipEarnings } from "./payslipNormalize";
import { buildPayslipDeductionLines, statutoryDeductionTotal } from "@/lib/payslipDisplay";

export type PayslipEarnings = {
  basic: number;
  hra: number;
  da: number;
  allowances: number;
  incentive: number;
  total: number;
};

export type PayslipDeductionsDetail = {
  pf: number;
  esi: number;
  tds: number;
  professionalTax: number;
  lop: number;
  total: number;
};

export type PayslipDocumentData = {
  month: string;
  employeeName: string;
  employeeId?: string;
  role?: string;
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
  paidLeaveDays?: number;
  unpaidLeaveDays?: number;
  absentDays?: number;
  publishedAt?: string;
};

export default function PayslipDocument({ data }: { data: PayslipDocumentData }) {
  const slip = normalizePayslipDocument(data);
  const period = formatPayrollMonth(slip.month);
  const earnings = resolvePayslipEarnings(slip);
  const deductions = resolvePayslipDeductions(slip);
  const deductionLines = buildPayslipDeductionLines(deductions, slip.unpaidLeaveDays ?? 0);
  const statutoryTotal = statutoryDeductionTotal(deductions);
  const generatedOn = slip.publishedAt
    ? new Date(slip.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-white border border-gray-400 max-w-[210mm] mx-auto font-serif text-gray-900 text-sm shadow-sm print:shadow-none">
      <HrDocumentLetterhead title={`Salary Payslip — ${period}`} />

      <div className="px-8 py-4 grid sm:grid-cols-2 gap-4 border-b border-gray-300">
        <div className="space-y-1">
          <p><span className="font-semibold">Employee Name:</span> {slip.employeeName}</p>
          <p><span className="font-semibold">Employee ID:</span> {slip.employeeId || "—"}</p>
          <p><span className="font-semibold">Account Number:</span> {maskAccountNumber(slip.accountNumber)}</p>
          <p><span className="font-semibold">Pan Number:</span> {slip.panNumber || "—"}</p>
          <p><span className="font-semibold">UAN Number:</span> {slip.uanNumber || "—"}</p>
        </div>
        <div className="space-y-1 sm:text-right">
          <p><span className="font-semibold">Joining Date:</span> {slip.joinDate ? formatLetterDate(slip.joinDate) : "—"}</p>
          <p><span className="font-semibold">Pay Period:</span> {period}</p>
          <p><span className="font-semibold">TWD:</span> {slip.workingDays ?? 30}</p>
          <p><span className="font-semibold">Present:</span> {slip.presentDays ?? 0}</p>
          <p><span className="font-semibold">Paid leave:</span> {slip.paidLeaveDays ?? 0}</p>
          <p><span className="font-semibold">Unpaid leave:</span> {slip.unpaidLeaveDays ?? 0}</p>
          <p><span className="font-semibold">Absent:</span> {slip.absentDays ?? 0}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 border-b border-gray-300 divide-x divide-gray-300">
        <div className="p-5">
          <p className="text-xs font-bold uppercase border-b border-gray-400 pb-1 mb-2">Earnings</p>
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Basic Pay", earnings.basic],
                ["HRA", earnings.hra],
                ["DA", earnings.da],
                ["Allowances", earnings.allowances],
                ["Incentive", earnings.incentive],
              ].map(([label, amount]) => (
                <tr key={String(label)}>
                  <td className="py-1.5 text-gray-800 pr-4">{label}</td>
                  <td className="py-1.5 text-right tabular-nums whitespace-nowrap w-28">{formatInr(Number(amount))}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-500 font-bold">
                <td className="pt-2 pr-4">Gross Salary</td>
                <td className="pt-2 text-right tabular-nums whitespace-nowrap">{formatInr(earnings.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase border-b border-gray-400 pb-1 mb-2">Deductions</p>
          <table className="w-full text-sm">
            <tbody>
              {deductionLines.map((line) => (
                <tr key={line.label}>
                  <td className="py-1.5 text-gray-800 pr-4">{line.label}</td>
                  <td className="py-1.5 text-right tabular-nums whitespace-nowrap w-28">{formatInr(line.amount)}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-500 font-bold">
                <td className="pt-2 pr-4">Total Deductions</td>
                <td className="pt-2 text-right tabular-nums whitespace-nowrap">{formatInr(statutoryTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-8 py-5 flex justify-between items-center border-b-2 border-gray-900 bg-gray-50">
        <div>
          <span className="font-bold uppercase tracking-wide block">In-Hand Salary</span>
          <span className="text-xs text-gray-600">Gross earnings minus total deductions</span>
        </div>
        <span className="text-2xl font-bold tabular-nums">{formatInr(slip.netPay)}</span>
      </div>

      <div className="px-8 py-6 text-xs text-gray-600">
        <p>Generated on: {generatedOn}</p>
        <p className="mt-1">This is a system-generated document. For queries, contact HR.</p>
      </div>
    </div>
  );
}
