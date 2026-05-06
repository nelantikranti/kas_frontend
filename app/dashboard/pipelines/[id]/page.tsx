"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { toast } from "@/components/Toast";
import { leadsAPI, pipelinesAPI, type Lead } from "@/lib/api";

type Stage = { name: string; order: number };

function stageKey(name: string) {
  return String(name || "").trim().toLowerCase();
}

function formatINR(value: number) {
  const n = Number(value || 0);
  const abs = Math.abs(n);

  const fmt = (v: number, suffix: string) => {
    const rounded = Math.round(v * 10) / 10; // 1 decimal max
    const str = Number.isInteger(rounded) ? String(Math.trunc(rounded)) : String(rounded);
    return `${n < 0 ? "-" : ""}₹${str}${suffix}`;
  };

  if (abs >= 1e7) return fmt(abs / 1e7, "Cr");
  if (abs >= 1e5) return fmt(abs / 1e5, "L");
  if (abs >= 1e3) return fmt(abs / 1e3, "K");
  return `${n < 0 ? "-" : ""}₹${abs.toLocaleString("en-IN")}`;
}

function isBoardDragTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return true;
  return !target.closest("button, a, input, select, textarea, [contenteditable='true']");
}

export default function PipelineBoardPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const pipelineId = params?.id;

  const [loading, setLoading] = useState(true);
  const [pipeline, setPipeline] = useState<{
    id: string;
    pipelineName: string;
    details: string;
    groupId: string | null;
    groupName: string | null;
    stages: Stage[];
  } | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const boardScrollRef = useRef<HTMLDivElement>(null);
  const boardPanRef = useRef<{ pointerId: number; startX: number; startScrollLeft: number } | null>(null);
  const [boardPanning, setBoardPanning] = useState(false);

  const stages = useMemo(() => {
    const s = pipeline?.stages || [];
    return s.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [pipeline?.stages]);

  const stageNamesSet = useMemo(() => {
    const set = new Set<string>();
    for (const s of stages) set.add(stageKey(s.name));
    return set;
  }, [stages]);

  const leadsByStage = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const s of stages) map[stageKey(s.name)] = [];
    for (const l of leads) {
      const key = stageKey(l.stage);
      if (!map[key]) map[key] = [];
      map[key].push(l);
    }
    return map;
  }, [leads, stages]);

  const fetchBoard = async () => {
    if (!pipelineId) return;
    try {
      setLoading(true);
      const res = await pipelinesAPI.getBoard(String(pipelineId));
      setPipeline(res.pipeline);
      setLeads(Array.isArray(res.leads) ? res.leads : []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load pipeline board");
      setPipeline(null);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipelineId]);

  const updateLeadStage = async (lead: Lead, newStageName: string) => {
    const stageName = String(newStageName || "").trim();
    if (!stageName) return;
    try {
      setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, stage: stageName } : l)));
      await leadsAPI.update(lead.id, { stage: stageName });
      toast.success("Stage updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update stage");
      fetchBoard();
    }
  };

  return (
    <div className="min-w-0 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => router.push("/dashboard/pipelines")}
            className="text-sm text-gray-600 hover:underline"
          >
            ← Back to pipelines
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
            {pipeline?.pipelineName || "Pipeline Board"}
          </h1>
          {pipeline?.groupName && (
            <p className="text-sm text-gray-600 mt-1">
              Group: <span className="font-medium text-gray-900">{pipeline.groupName}</span>
            </p>
          )}
          {!!pipeline?.details && <p className="text-sm text-gray-600 mt-1">{pipeline.details}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchBoard}
            className="px-3 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 px-4 py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
          <span className="text-sm">Loading board...</span>
        </div>
      ) : !pipeline ? (
        <div className="px-4 py-12 text-center text-gray-500 text-sm bg-white rounded-lg border border-gray-200">
          Pipeline not found or you don&apos;t have access.
        </div>
      ) : stages.length === 0 ? (
        <div className="px-4 py-12 text-center text-gray-500 text-sm bg-white rounded-lg border border-gray-200">
          No stages configured for this pipeline.
        </div>
      ) : (
        <div
          ref={boardScrollRef}
          onPointerDown={(e) => {
            if (e.pointerType === "touch") return;
            if (e.button !== 0 || !isBoardDragTarget(e.target)) return;
            const el = boardScrollRef.current;
            if (!el) return;
            boardPanRef.current = {
              pointerId: e.pointerId,
              startX: e.clientX,
              startScrollLeft: el.scrollLeft,
            };
            el.setPointerCapture(e.pointerId);
            setBoardPanning(true);
          }}
          onPointerMove={(e) => {
            const pan = boardPanRef.current;
            if (!pan || pan.pointerId !== e.pointerId) return;
            const el = boardScrollRef.current;
            if (!el) return;
            el.scrollLeft = pan.startScrollLeft - (e.clientX - pan.startX);
          }}
          onPointerUp={(e) => {
            const pan = boardPanRef.current;
            if (!pan || pan.pointerId !== e.pointerId) return;
            const el = boardScrollRef.current;
            if (el?.hasPointerCapture(e.pointerId)) {
              el.releasePointerCapture(e.pointerId);
            }
            boardPanRef.current = null;
            setBoardPanning(false);
          }}
          onPointerCancel={(e) => {
            const pan = boardPanRef.current;
            if (!pan || pan.pointerId !== e.pointerId) return;
            const el = boardScrollRef.current;
            if (el?.hasPointerCapture(e.pointerId)) {
              el.releasePointerCapture(e.pointerId);
            }
            boardPanRef.current = null;
            setBoardPanning(false);
          }}
          onLostPointerCapture={() => {
            boardPanRef.current = null;
            setBoardPanning(false);
          }}
          className={`w-full max-w-full min-w-0 overflow-x-auto pb-1 [scrollbar-width:thin] ${
            boardPanning ? "cursor-grabbing select-none" : "cursor-grab"
          }`}
        >
          <div className="flex w-max min-w-full gap-4 pb-2">
            {stages.map((s) => {
              const key = stageKey(s.name);
              const colLeads = leadsByStage[key] || [];
              const colTotal = colLeads.reduce((sum, l) => sum + Number((l as any)?.value || 0), 0);
              return (
                <div key={key} className="w-[280px] shrink-0">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="px-3 py-3 border-b border-gray-200 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{s.name}</p>
                        <p className="text-xs text-gray-500">
                          {colLeads.length} leads · <span className="font-medium text-gray-900">{formatINR(colTotal)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="p-3 space-y-3">
                      {colLeads.length === 0 ? (
                        <div className="text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg p-3 text-center">
                          No leads
                        </div>
                      ) : (
                        colLeads.map((l) => (
                          <button
                            type="button"
                            key={l.id}
                            onClick={() => setSelectedLead(l)}
                            className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 hover:shadow-sm transition"
                            title="Open lead actions"
                          >
                            <p className="text-sm font-semibold text-gray-900 truncate">{l.name}</p>
                            <p className="text-xs text-gray-600 truncate">{l.company || "—"}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500 truncate">{l.assignedTo || "—"}</span>
                              <span className="text-xs font-medium text-gray-900">₹{Number(l.value || 0).toLocaleString("en-IN")}</span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Unmapped stages (leads whose stage is not in pipeline) */}
            {leads.some((l) => !stageNamesSet.has(stageKey(l.stage))) && (
              (() => {
                const unmappedLeads = leads.filter((l) => !stageNamesSet.has(stageKey(l.stage)));
                const unmappedTotal = unmappedLeads.reduce((sum, l) => sum + Number((l as any)?.value || 0), 0);
                return (
              <div className="w-[280px] shrink-0">
                <div className="bg-red-50 border border-red-200 rounded-lg">
                  <div className="px-3 py-3 border-b border-red-200">
                    <p className="text-sm font-semibold text-red-900 truncate">Unmapped</p>
                    <p className="text-xs text-red-700">
                      {unmappedLeads.length} leads · <span className="font-semibold">{formatINR(unmappedTotal)}</span>
                    </p>
                  </div>
                  <div className="p-3 space-y-3">
                    {unmappedLeads
                      .map((l) => (
                        <button
                          type="button"
                          key={l.id}
                          onClick={() => setSelectedLead(l)}
                          className="w-full text-left bg-white border border-red-200 rounded-lg p-3 hover:border-red-300 hover:shadow-sm transition"
                          title="Open lead actions"
                        >
                          <p className="text-sm font-semibold text-gray-900 truncate">{l.name}</p>
                          <p className="text-xs text-gray-600 truncate">{l.company || "—"}</p>
                          <p className="text-xs text-red-700 mt-1 truncate">Stage: {l.stage || "—"}</p>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
                );
              })()
            )}
          </div>
        </div>
      )}

      {selectedLead && pipeline && (
        <Modal
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
          title="Lead Actions"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm font-semibold text-gray-900">{selectedLead.name}</p>
              <p className="text-xs text-gray-600 mt-0.5">{selectedLead.company || "—"}</p>
              <p className="text-xs text-gray-500 mt-1">Current stage: {selectedLead.stage || "—"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Move to stage</label>
              <select
                value={selectedLead.stage || ""}
                onChange={(e) => updateLeadStage(selectedLead, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {stages.map((s) => (
                  <option key={stageKey(s.name)} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Tip: if this lead is “Unmapped”, pick a valid stage to bring it into the board.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedLead(null);
                  router.push(`/dashboard/leads/edit/${selectedLead.id}`);
                }}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Edit Lead
              </button>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

