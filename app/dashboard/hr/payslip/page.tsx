"use client";

import { useCallback, useEffect, useState } from "react";
import HrNav from "@/components/hr/HrNav";
import PayslipDocument, { type PayslipDeductionsDetail, type PayslipEarnings } from "@/components/hr/PayslipDocument";
import PdfPreviewPanel from "@/components/hr/PdfPreviewPanel";
import { hrAPI } from "@/lib/api";
import { downloadBlob } from "@/lib/hrShare";
import { getUserPermissions, isHrManagerRole } from "@/lib/permissions";
import { toast } from "@/components/Toast";
import HrActionToolbar from "@/components/hr/HrActionToolbar";
import { IoDocumentTextOutline } from "react-icons/io5";

type Payslip = {
  id: string;
  month: string;
  employeeName: string;
  employeeId?: string;
  department?: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  earnings?: PayslipEarnings;
  deductionsDetail?: PayslipDeductionsDetail;
  presentDays?: number;
  workingDays?: number;
  unpaidLeaveDays?: number;
  absentDays?: number;
  publishedAt?: string;
};

function readRole() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? String(JSON.parse(raw).role || "").trim() : "";
  } catch {
    return "";
  }
}

export default function MyPayslipPage() {
  const hrManager = isHrManagerRole(readRole(), getUserPermissions());
  const [slip, setSlip] = useState<Payslip | null | undefined>(undefined);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    hrAPI
      .getMyPayslip()
      .then((data) => setSlip(data as Payslip | null))
      .catch(() => setSlip(null));
  }, []);

  const loadPdf = useCallback(() => hrAPI.getMyPayslipPdf(), []);

  const handleDownload = async () => {
    if (!slip) return;
    setDownloading(true);
    try {
      const blob = await hrAPI.getMyPayslipPdf();
      downloadBlob(blob, `payslip-${slip.month}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My payslip</h1>
        <p className="text-sm text-gray-600 mt-1">
          {hrManager ? "Human Resources" : "My Services"} — view your latest published payslip
        </p>
      </div>
      <HrNav />

      {slip === undefined ? (
        <p className="text-gray-500 text-sm">Loading…</p>
      ) : !slip ? (
        <div className="bg-white border rounded-xl p-10 text-center">
          <IoDocumentTextOutline className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium">No published payslip yet</p>
          <p className="text-sm text-gray-500 mt-1">HR will publish after payroll is generated for your account.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <HrActionToolbar
            actions={[
              {
                id: "pdf",
                label: showPdf ? "Hide PDF" : "View official PDF",
                icon: "preview",
                onClick: () => {
                  if (!showPdf) setPdfKey((k) => k + 1);
                  setShowPdf((v) => !v);
                },
              },
              {
                id: "dl",
                label: downloading ? "Preparing…" : "Download PDF",
                icon: "download",
                onClick: handleDownload,
                disabled: downloading,
                variant: "primary",
              },
            ]}
          />

          <PayslipDocument data={slip} />

          {showPdf && (
            <PdfPreviewPanel
              title={`Official PDF — ${slip.month}`}
              loadPdf={loadPdf}
              refreshKey={pdfKey}
            />
          )}
        </div>
      )}
    </div>
  );
}
