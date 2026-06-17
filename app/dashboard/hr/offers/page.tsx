"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import DocumentsShell from "@/components/hr/DocumentsShell";
import OfferLetterDocument from "@/components/hr/OfferLetterDocument";
import PdfPreviewPanel from "@/components/hr/PdfPreviewPanel";
import HrActionToolbar from "@/components/hr/HrActionToolbar";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import { downloadBlob, sharePdfViaGmail } from "@/lib/hrShare";
import { computePayrollTotals } from "@/lib/payrollTotals";
import { useRoles } from "@/hooks/useRoles";
import EmployeeCodeBadge from "@/components/hr/EmployeeCodeBadge";
import { formatInr } from "@/components/hr/hrDocumentUtils";
import { IoPersonOutline, IoDocumentTextOutline } from "react-icons/io5";

type OfferRow = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  monthlyGross: number;
  joinDate: string;
  sentAt?: string;
};

type EmployeeOption = { id: string; name: string; email: string; role: string; status: string };

const empty = {
  userId: "",
  candidateName: "",
  candidateEmail: "",
  role: "",
  department: "",
  employeeId: "",
  monthlyGross: "",
  basic: "",
  hra: "",
  da: "",
  allowances: "",
  pf: "",
  esi: "",
  tds: "",
  professionalTax: "",
  joinDate: "",
  notes: "",
};

export default function HrOffersPage() {
  const { roles } = useRoles();
  const [form, setForm] = useState(empty);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [history, setHistory] = useState<OfferRow[]>([]);
  const [previewMode, setPreviewMode] = useState<"document" | "pdf">("document");
  const [pdfKey, setPdfKey] = useState(0);
  const [busy, setBusy] = useState(false);
  const [prefillBusy, setPrefillBusy] = useState(false);
  const load = () => {
    hrAPI.getOffers().then((r) => setHistory(Array.isArray(r) ? r : [])).catch(() => {});
  };

  useEffect(() => {
    load();
    hrAPI
      .getEmployees()
      .then((rows) =>
        setEmployees(
          (Array.isArray(rows) ? rows : []).map((e: EmployeeOption) => ({
            id: e.id,
            name: e.name,
            email: e.email,
            role: e.role,
            status: e.status,
          }))
        )
      )
      .catch(() => {});
  }, []);

  const payload = useMemo(
    () => ({
      ...form,
      monthlyGross: Number(form.monthlyGross),
      basic: Number(form.basic) || 0,
      hra: Number(form.hra) || 0,
      da: Number(form.da) || 0,
      allowances: Number(form.allowances) || 0,
      pf: Number(form.pf) || 0,
      esi: Number(form.esi) || 0,
      tds: Number(form.tds) || 0,
      professionalTax: Number(form.professionalTax) || 0,
    }),
    [form]
  );

  const salarySummary = useMemo(() => {
    const totals = computePayrollTotals(
      { basic: form.basic, hra: form.hra, da: form.da, allowances: form.allowances },
      { pf: form.pf, esi: form.esi, tds: form.tds, professionalTax: form.professionalTax, lop: 0 }
    );
    const gross = Number(form.monthlyGross) || totals.grossPay;
    const deductions =
      totals.deductionsDetail.pf +
      totals.deductionsDetail.esi +
      totals.deductionsDetail.tds +
      totals.deductionsDetail.professionalTax;
    return { gross, deductions, inHand: totals.inHandSalary };
  }, [form]);
  const loadPdf = useCallback(() => hrAPI.previewOfferPdf(payload), [payload]);

  const validate = () => {
    if (!form.candidateName || !form.role || !form.monthlyGross || !form.joinDate) {
      toast.error("Fill name, role, salary, and join date");
      return false;
    }
    return true;
  };

  const loadFromEmployee = async (userId: string) => {
    if (!userId) {
      setForm(empty);
      return;
    }
    setPrefillBusy(true);
    try {
      const data = (await hrAPI.getOfferPrefill(userId)) as typeof empty & {
        monthlyGross: number;
        basic?: number;
        hra?: number;
        da?: number;
        allowances?: number;
      };
      setForm({
        userId,
        candidateName: data.candidateName || "",
        candidateEmail: data.candidateEmail || "",
        role: data.role || "",
        department: data.department || "",
        employeeId: data.employeeId || "",
        monthlyGross: data.monthlyGross ? String(data.monthlyGross) : "",
        basic: data.basic ? String(data.basic) : "",
        hra: data.hra ? String(data.hra) : "",
        da: data.da ? String(data.da) : "",
        allowances: data.allowances ? String(data.allowances) : "",
        pf: data.pf ? String(data.pf) : "",
        esi: data.esi ? String(data.esi) : "",
        tds: data.tds ? String(data.tds) : "",
        professionalTax: data.professionalTax ? String(data.professionalTax) : "",
        joinDate: data.joinDate || "",
        notes: "",
      });
      toast.success("Loaded from system");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Could not load employee");
    } finally {
      setPrefillBusy(false);
    }
  };

  const previewPdf = () => {
    if (!validate()) return;
    setPreviewMode("pdf");
    setPdfKey((k) => k + 1);
  };

  const downloadPdf = async () => {
    if (!validate()) return;
    setBusy(true);
    try {
      const blob = await hrAPI.previewOfferPdf(payload);
      downloadBlob(blob, `offer-${form.candidateName.replace(/\s+/g, "-")}.pdf`);
      toast.success("PDF downloaded");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Download failed");
    } finally {
      setBusy(false);
    }
  };

  const gmailShare = async () => {
    if (!form.candidateEmail) return toast.error("Candidate email required");
    if (!validate()) return;
    setBusy(true);
    try {
      const blob = await hrAPI.previewOfferPdf(payload);
      await sharePdfViaGmail({
        pdfBlob: blob,
        filename: `offer-${form.candidateName.replace(/\s+/g, "-")}.pdf`,
        to: form.candidateEmail,
        subject: `Offer of Employment — ${form.candidateName}`,
        body: `Dear ${form.candidateName},\n\nPlease find your offer letter attached.\n\nWe look forward to welcoming you.\n\nRegards,\nHR Team`,
        onDownloaded: () => toast.info("PDF downloaded — attach it in Gmail"),
      });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Gmail share failed");
    } finally {
      setBusy(false);
    }
  };

  const field = (
    label: string,
    key: keyof typeof empty,
    opts?: { type?: string; required?: boolean; placeholder?: string }
  ) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
        {opts?.required ? <span className="text-red-500"> *</span> : null}
      </label>
      {key === "role" ? (
        <select
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="">Select role</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={opts?.type || "text"}
          placeholder={opts?.placeholder}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <DocumentsShell
      activeTab="offers"
      description="Create and share official HR documents. Select a candidate, auto-fill details, preview, then download or share via Gmail."
    >
      <div className="grid xl:grid-cols-2 gap-6 items-start">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b">
            <h2 className="font-semibold flex items-center gap-2 text-gray-900">
              <IoPersonOutline className="text-gray-600" />
              Offer details
            </h2>
          </div>
          <form className="p-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">1. Select from system</label>
              <select
                className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white"
                value={form.userId}
                disabled={prefillBusy}
                onChange={(e) => loadFromEmployee(e.target.value)}
              >
                <option value="">— New candidate (manual) —</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} · {e.role} · {e.status}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {field("Candidate name", "candidateName", { required: true })}
              {field("Email", "candidateEmail", { type: "email", required: true })}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {field("Role", "role", { required: true })}
              {field("Department", "department")}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {field("Monthly Gross Salary (Rs.)", "monthlyGross", { type: "number", required: true })}
              {field("Joining date", "joinDate", { type: "date", required: true })}
            </div>
            {form.employeeId ? (
              <p className="text-sm text-gray-600">
                Employee code: <EmployeeCodeBadge code={form.employeeId} className="inline text-sm" />
              </p>
            ) : null}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Compensation summary</p>
              <div className="flex justify-between">
                <span className="text-gray-600">Total package</span>
                <span className="font-medium tabular-nums">{formatInr(salarySummary.gross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deductions (statutory)</span>
                <span className="font-medium tabular-nums">{formatInr(salarySummary.deductions)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 font-semibold">
                <span>In-Hand Salary</span>
                <span className="text-green-700 tabular-nums">{formatInr(salarySummary.inHand)}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Additional terms</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2.5 border rounded-lg text-sm"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <HrActionToolbar
              layout="row"
              actions={[
                {
                  id: "live",
                  label: "Live preview",
                  icon: "document",
                  onClick: () => setPreviewMode("document"),
                  variant: previewMode === "document" ? "primary" : "secondary",
                },
                { id: "pdf", label: "Preview PDF", icon: "preview", onClick: previewPdf, disabled: busy },
                { id: "dl", label: "Download", icon: "download", onClick: downloadPdf, disabled: busy },
                { id: "gm", label: "Share via Gmail", icon: "gmail", onClick: gmailShare, disabled: busy },
              ]}
            />
          </form>
        </div>

        <div className="sticky top-4 space-y-3">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <IoDocumentTextOutline className="text-gray-600" />
            {previewMode === "document" ? "Letter preview" : "PDF preview"}
          </p>
          {previewMode === "document" ? (
            <OfferLetterDocument data={payload} />
          ) : (
            <PdfPreviewPanel title="Offer letter PDF" loadPdf={loadPdf} refreshKey={pdfKey} emptyHint="Click Preview PDF" />
          )}
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b bg-gray-50 font-semibold text-sm">Sent offers (audit log)</div>
        <ul className="divide-y text-sm">
          {history.length === 0 ? (
            <li className="p-5 text-gray-500">No offers sent yet.</li>
          ) : (
            history.map((o) => (
              <li key={o.id} className="px-5 py-3 flex justify-between gap-2 hover:bg-gray-50">
                <span>
                  <span className="font-medium">{o.candidateName}</span>
                  <span className="text-gray-500"> — {o.role}</span>
                </span>
                <span className="text-gray-500">{o.sentAt ? new Date(o.sentAt).toLocaleDateString("en-IN") : ""}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </DocumentsShell>
  );
}
