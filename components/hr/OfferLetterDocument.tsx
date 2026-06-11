"use client";

import HrDocumentLetterhead from "./HrDocumentLetterhead";
import EmployeeCodeBadge from "./EmployeeCodeBadge";
import { COMPANY_NAME, formatInr, formatLetterDate } from "./hrDocumentUtils";
import { computePayrollTotals } from "@/lib/payrollTotals";

export type OfferLetterDocumentData = {
  candidateName: string;
  role: string;
  department?: string;
  monthlyGross: number | string;
  basic?: number | string;
  hra?: number | string;
  da?: number | string;
  allowances?: number | string;
  pf?: number | string;
  esi?: number | string;
  tds?: number | string;
  professionalTax?: number | string;
  joinDate: string;
  notes?: string;
  employeeId?: string;
  inHandSalary?: number | string;
};

export default function OfferLetterDocument({ data }: { data: OfferLetterDocumentData }) {
  const basic = Number(data.basic) || 0;
  const hra = Number(data.hra) || 0;
  const da = Number(data.da) || 0;
  const allowances = Number(data.allowances) || 0;
  const pf = Number(data.pf) || 0;
  const esi = Number(data.esi) || 0;
  const tds = Number(data.tds) || 0;
  const professionalTax = Number(data.professionalTax) || 0;

  const totals = computePayrollTotals(
    { basic, hra, da, allowances },
    { pf, esi, tds, professionalTax, lop: 0 }
  );
  const gross = Number(data.monthlyGross) || totals.grossPay;
  const statutoryDeductions = totals.deductionsDetail.pf + totals.deductionsDetail.esi + totals.deductionsDetail.tds + totals.deductionsDetail.professionalTax;
  const inHand =
    data.inHandSalary != null && data.inHandSalary !== ""
      ? Number(data.inHandSalary)
      : totals.inHandSalary;

  return (
    <div className="bg-white border border-gray-400 max-w-[210mm] mx-auto font-serif text-gray-900 text-sm leading-relaxed shadow-sm print:shadow-none">
      <HrDocumentLetterhead title="Letter of Employment Offer" />

      <div className="px-8 py-6 space-y-5">
        <p className="text-xs text-gray-600">Date: {formatLetterDate()}</p>

        <p>
          <span className="font-semibold">Dear {data.candidateName || "Candidate"},</span>
        </p>

        <p>
          With reference to your application and subsequent discussions, we are pleased to offer you employment at{" "}
          {COMPANY_NAME} on the following terms and conditions:
        </p>

        <div>
          <p className="font-semibold mb-2">1. Position &amp; Department</p>
          <table className="w-full border border-gray-300 text-sm">
            <tbody>
              <tr className="border-b border-gray-300">
                <td className="px-3 py-2 w-2/5 bg-gray-50 font-medium">Designation</td>
                <td className="px-3 py-2">{data.role || "—"}</td>
              </tr>
              {data.department ? (
                <tr className="border-b border-gray-300">
                  <td className="px-3 py-2 bg-gray-50 font-medium">Department</td>
                  <td className="px-3 py-2">{data.department}</td>
                </tr>
              ) : null}
              {data.employeeId ? (
                <tr>
                  <td className="px-3 py-2 bg-gray-50 font-medium">Employee Code</td>
                  <td className="px-3 py-2">
                    <EmployeeCodeBadge code={data.employeeId} className="text-sm" />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div>
          <p className="font-semibold mb-2">2. Date of Joining</p>
          <p>{data.joinDate ? formatLetterDate(data.joinDate) : "To be confirmed"}</p>
        </div>

        <div>
          <p className="font-semibold mb-2">3. Compensation</p>
          <table className="w-full border border-gray-300 text-sm mb-2">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="px-3 py-2 text-left font-semibold">Component</th>
                <th className="px-3 py-2 text-right font-semibold">Monthly (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-2">Total Package (Gross)</td>
                <td className="px-3 py-2 text-right tabular-nums">{gross > 0 ? formatInr(gross) : "—"}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-3 py-2">Deductions (Statutory)</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {statutoryDeductions > 0 ? formatInr(statutoryDeductions) : "—"}
                </td>
              </tr>
              <tr className="font-bold bg-gray-50">
                <td className="px-3 py-2">In-Hand Salary</td>
                <td className="px-3 py-2 text-right tabular-nums">{inHand > 0 ? formatInr(inHand) : "—"}</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-600 mt-2">
            Compensation is subject to applicable taxes and statutory deductions as per company policy and law.
          </p>
        </div>

        <div>
          <p className="font-semibold mb-2">4. Terms of Employment</p>
          <p>
            This offer is subject to satisfactory verification of documents, background checks, and completion of
            onboarding formalities. Your employment shall be governed by the policies, rules, and regulations of the
            company as amended from time to time.
          </p>
        </div>

        {data.notes ? (
          <div>
            <p className="font-semibold mb-2">5. Additional Terms</p>
            <p className="whitespace-pre-wrap">{data.notes}</p>
          </div>
        ) : null}

        <p>
          We are confident that you will make a significant contribution to our organization and look forward to a
          mutually rewarding association. Please sign and return a copy of this letter as token of your acceptance.
        </p>

        <div className="pt-4 grid sm:grid-cols-2 gap-8 border-t border-gray-300 mt-6">
          <div>
            <p className="font-semibold">For {COMPANY_NAME}</p>
            <div className="mt-12 border-t border-gray-500 pt-1 max-w-[200px]">
              <p>Authorized Signatory</p>
              <p className="text-xs text-gray-600">Human Resources Department</p>
            </div>
          </div>
          <div>
            <p className="font-semibold">Acceptance by Candidate</p>
            <div className="mt-12 border-t border-gray-500 pt-1 max-w-[200px]">
              <p>{data.candidateName || "Candidate"}</p>
              <p className="text-xs text-gray-600">Signature &amp; Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
