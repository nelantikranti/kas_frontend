"use client";

import HrDocumentLetterhead from "./HrDocumentLetterhead";
import { formatInr, formatPayrollMonth } from "./hrDocumentUtils";

export type CalculationData = {
  employeeName: string;
  employeeId?: string;
  department?: string;
  role?: string;
  email?: string;
  month: string;
  monthLabel?: string;
  workingDays: number;
  presentDays: number;
  unpaidLeaveDays: number;
  absentDays: number;
  attendanceRatio?: number;
  earnings: { basic: number; hra: number; da: number; allowances: number; total: number };
  deductionsDetail: { pf: number; esi: number; tds: number; professionalTax: number; lop: number; total: number };
  grossPay: number;
  deductions: number;
  netPay: number;
  monthlyGross?: number;
  breakdown?: Array<{ label: string; value: string; highlight?: boolean; section?: string }>;
};

export default function PayslipCalculationPreview({ data }: { data: CalculationData }) {
  const period = data.monthLabel || formatPayrollMonth(data.month);

  return (
    <div className="bg-white border border-gray-300 max-w-2xl mx-auto font-serif text-gray-900">
      <HrDocumentLetterhead title={`Salary Payslip — ${period}`} />

      <div className="px-6 py-4 grid sm:grid-cols-2 gap-3 text-sm border-b border-gray-200">
        <div>
          <p><span className="font-semibold">Employee:</span> {data.employeeName}</p>
          <p><span className="font-semibold">ID:</span> {data.employeeId || "—"}</p>
          <p><span className="font-semibold">Role:</span> {data.role || "—"}</p>
        </div>
        <div>
          <p><span className="font-semibold">Working Days:</span> {data.workingDays}</p>
          <p><span className="font-semibold">LOP Days:</span> {data.absentDays}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-0 border-b border-gray-200">
        <div className="p-4 border-r border-gray-200">
          <p className="text-xs font-bold uppercase mb-2 border-b border-gray-300 pb-1">Earnings</p>
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Basic Pay", data.earnings.basic],
                ["HRA", data.earnings.hra],
                ["DA", data.earnings.da],
                ["Allowances", data.earnings.allowances],
              ].map(([l, v]) => (
                <tr key={String(l)}>
                  <td className="py-1 text-gray-700">{l}</td>
                  <td className="py-1 text-right">{formatInr(Number(v))}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-400 font-bold">
                <td className="py-2">Gross</td>
                <td className="py-2 text-right">{formatInr(data.earnings.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <p className="text-xs font-bold uppercase mb-2 border-b border-gray-300 pb-1">Deductions</p>
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Provident Fund", data.deductionsDetail.pf],
                ["ESI", data.deductionsDetail.esi],
                ["TDS", data.deductionsDetail.tds],
                ["Professional Tax", data.deductionsDetail.professionalTax],
                ["Loss of Pay", data.deductionsDetail.lop],
              ].map(([l, v]) => (
                <tr key={String(l)}>
                  <td className="py-1 text-gray-700">{l}</td>
                  <td className="py-1 text-right">{formatInr(Number(v))}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-400 font-bold">
                <td className="py-2">Total</td>
                <td className="py-2 text-right">{formatInr(data.deductionsDetail.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-6 py-4 flex justify-between items-center border-t-2 border-gray-900">
        <span className="font-bold uppercase text-sm">Net Salary Payable</span>
        <span className="text-xl font-bold">{formatInr(data.netPay)}</span>
      </div>
    </div>
  );
}
