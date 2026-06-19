"use client";

import { useEffect, useState } from "react";
import HrNav from "@/components/hr/HrNav";
import { toast } from "@/components/Toast";
import { hrAPI } from "@/lib/api";
import { sortByEmployeeCode } from "@/lib/employeeSort";

type ChecklistItem = { key: string; label: string; completed: boolean; completedAt?: string };
type Employee = {
  id: string;
  name: string;
  email: string;
  onboarding?: {
    checklist: ChecklistItem[];
    documents: { _id: string; fileName: string; fileUrl: string; uploadedAt: string }[];
    completedAt?: string;
  };
};

export default function HrOnboardingPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [detail, setDetail] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hrAPI
      .getEmployees()
      .then((list: Employee[]) => {
        const sorted = sortByEmployeeCode(list);
        setEmployees(sorted);
        if (sorted.length) setSelectedId(sorted[0].id);
      })
      .catch((e: Error) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    hrAPI
      .getEmployee(selectedId)
      .then(setDetail)
      .catch((e: Error) => toast.error(e.message));
  }, [selectedId]);

  const toggle = async (key: string, completed: boolean) => {
    if (!selectedId) return;
    try {
      await hrAPI.toggleOnboarding(selectedId, key, completed);
      const updated = await hrAPI.getEmployee(selectedId);
      setDetail(updated);
      toast.success("Checklist updated");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  const onUpload = async (file: File) => {
    if (!selectedId) return;
    try {
      await hrAPI.uploadDocument(selectedId, file);
      const updated = await hrAPI.getEmployee(selectedId);
      setDetail(updated);
      toast.success("Document uploaded");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    }
  };

  const checklist = detail?.onboarding?.checklist || [];
  const docs = detail?.onboarding?.documents || [];
  const doneCount = checklist.filter((c) => c.completed).length;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
      <HrNav />

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white border rounded-lg p-4">
            <label className="text-xs font-medium text-gray-600">Employee</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">{detail?.name}</h2>
                <span className="text-sm text-gray-500">
                  {doneCount}/{checklist.length} complete
                  {detail?.onboarding?.completedAt && (
                    <span className="ml-2 text-green-600">✓ Onboarding done</span>
                  )}
                </span>
              </div>
              <ul className="space-y-2">
                {checklist.map((item) => (
                  <li key={item.key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => toggle(item.key, e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className={item.completed ? "text-gray-500 line-through" : "text-gray-800"}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h2 className="font-semibold mb-3">Documents</h2>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                  e.target.value = "";
                }}
                className="text-sm"
              />
              <ul className="mt-3 space-y-2">
                {docs.map((d) => (
                  <li key={d._id}>
                    <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">
                      {d.fileName}
                    </a>
                  </li>
                ))}
                {docs.length === 0 && <p className="text-sm text-gray-500">No documents yet.</p>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
