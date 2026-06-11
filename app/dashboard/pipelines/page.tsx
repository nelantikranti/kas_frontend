"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { toast } from "@/components/Toast";
import { IoAdd, IoSearch } from "react-icons/io5";
import AnimatedDeleteButton from "@/components/AnimatedDeleteButton";
import AnimatedEditButton from "@/components/AnimatedEditButton";
import { pipelinesAPI, PipelineListItem, groupsAPI } from "@/lib/api";
import { can, PERMISSIONS } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { defaultPipelineStageNames } from "@/lib/leadStages";

function formatCreated(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
      ? "nd"
      : day === 3 || day === 23
      ? "rd"
      : "th";
  const month = d.toLocaleString("en", { month: "short" });
  const year = d.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

function getInitials(name: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function PipelinesPage() {
  const router = useRouter();
  const [data, setData] = useState<PipelineListItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingPipeline, setEditingPipeline] = useState<PipelineListItem | null>(null);
  const [pipelineToDelete, setPipelineToDelete] = useState<PipelineListItem | null>(null);
  const [newPipelineName, setNewPipelineName] = useState("");
  const [newPipelineDetails, setNewPipelineDetails] = useState("");
  const [newStageInput, setNewStageInput] = useState("");
  const [newStages, setNewStages] = useState<string[]>(() => defaultPipelineStageNames());
  const [editPipelineName, setEditPipelineName] = useState("");
  const [editPipelineDetails, setEditPipelineDetails] = useState("");
  const [editStageInput, setEditStageInput] = useState("");
  const [editStages, setEditStages] = useState<string[]>([]);
  const [newGroupId, setNewGroupId] = useState<string>("");
  const [editGroupId, setEditGroupId] = useState<string>("");
  const [editAssignedTeam, setEditAssignedTeam] = useState<string[]>([]);
  const [groups, setGroups] = useState<{ id: string; groupName: string }[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  const addStageChip = (value: string, mode: "new" | "edit") => {
    const v = String(value || "").trim();
    if (!v) return;
    const key = v.toLowerCase();
    if (mode === "new") {
      if (newStages.some((s) => s.toLowerCase() === key)) return;
      setNewStages((prev) => [...prev, v]);
      setNewStageInput("");
      return;
    }
    if (editStages.some((s) => s.toLowerCase() === key)) return;
    setEditStages((prev) => [...prev, v]);
    setEditStageInput("");
  };

  const removeStageChip = (value: string, mode: "new" | "edit") => {
    const key = value.toLowerCase();
    if (mode === "new") {
      setNewStages((prev) => prev.filter((s) => s.toLowerCase() !== key));
      return;
    }
    setEditStages((prev) => prev.filter((s) => s.toLowerCase() !== key));
  };

  useEffect(() => {
    const syncUserState = () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      try {
        const u = JSON.parse(userStr);
        setUserPermissions(Array.isArray(u.permissions) ? u.permissions : []);
        setCurrentUserId(u.id || "");
      } catch (_) {}
    };

    syncUserState();

    const handlePermissionsUpdate = () => syncUserState();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user") syncUserState();
    };

    window.addEventListener("userPermissionsUpdated", handlePermissionsUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("userPermissionsUpdated", handlePermissionsUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const fetchPipelines = async () => {
    try {
      setIsLoading(true);
      const res = await pipelinesAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery.trim() || undefined,
      });
      setData(res.data || []);
      setPagination((prev) => ({
        ...prev,
        ...res.pagination,
      }));
    } catch (err) {
      console.error("Failed to fetch pipelines:", err);
      setData([]);
      toast.error("Failed to load pipelines");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, [pagination.page, pagination.limit, searchQuery]);

  const fetchGroups = async () => {
    try {
      const list = await groupsAPI.getAll();
      setGroups(Array.isArray(list) ? list.map((g: any) => ({ id: g.id, groupName: g.groupName })) : []);
    } catch (_) {
      setGroups([]);
    }
  };

  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) fetchGroups();
  }, [isAddModalOpen, isEditModalOpen]);

  const handleAddPipeline = async () => {
    if (!newPipelineName.trim()) {
      toast.error("Pipeline name is required");
      return;
    }
    if (newStages.length === 0) {
      toast.error("Please add at least 1 stage");
      return;
    }
    try {
      await pipelinesAPI.create({
        pipelineName: newPipelineName.trim(),
        details: newPipelineDetails.trim(),
        stages: newStages,
        groupId: newGroupId || null,
        addedBy: currentUserId,
      });
      setNewPipelineName("");
      setNewPipelineDetails("");
      setNewGroupId("");
      setNewStages(defaultPipelineStageNames());
      setNewStageInput("");
      setIsAddModalOpen(false);
      fetchPipelines();
      toast.success("Pipeline created");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create pipeline");
    }
  };

  const handleEditPipeline = (row: PipelineListItem) => {
    setEditingPipeline(row);
    setEditPipelineName(row.pipelineName);
    setEditPipelineDetails(row.details || "");
    setEditGroupId(row.groupId || "");
    setEditAssignedTeam(row.assignedTeam?.map((t) => t.id) || []);
    setEditStages((row.stages || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).map((s) => s.name));
    setEditStageInput("");
    setIsEditModalOpen(true);
  };

  const handleUpdatePipeline = async () => {
    if (!editingPipeline) return;
    if (!editPipelineName.trim()) {
      toast.error("Pipeline name is required");
      return;
    }
    if (editStages.length === 0) {
      toast.error("Please add at least 1 stage");
      return;
    }
    try {
      await pipelinesAPI.update(editingPipeline.id, {
        pipelineName: editPipelineName.trim(),
        details: editPipelineDetails.trim(),
        stages: editStages,
        groupId: editGroupId || null,
      });
      setEditingPipeline(null);
      setIsEditModalOpen(false);
      fetchPipelines();
      toast.success("Pipeline updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update pipeline");
    }
  };

  const handleDeleteClick = (row: PipelineListItem) => {
    setPipelineToDelete(row);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pipelineToDelete) return;
    try {
      await pipelinesAPI.delete(pipelineToDelete.id);
      setPipelineToDelete(null);
      setIsDeleteModalOpen(false);
      fetchPipelines();
      toast.success("Pipeline deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete pipeline");
    }
  };

  const canCreate = can(PERMISSIONS.PIPELINES_CREATE, userPermissions);
  const canEdit = can(PERMISSIONS.PIPELINES_EDIT, userPermissions);
  const canDelete = can(PERMISSIONS.PIPELINES_DELETE, userPermissions);

  return (
    <div className="min-w-0 w-full">
      {/* Header: stack on mobile so title doesn't truncate, row on sm+ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 shrink-0 min-w-0">
          Leads Pipelines
        </h1>
        <div className="flex flex-col sm:flex-row flex-1 gap-3 sm:gap-4 sm:justify-end sm:items-center min-w-0 w-full sm:w-auto">
          <div className="relative w-full min-w-0 sm:min-w-[180px] md:min-w-[220px] sm:max-w-md">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white placeholder-gray-500"
              aria-label="Search pipelines"
            />
          </div>
          {canCreate && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap text-sm font-medium shadow-sm shrink-0 w-full sm:w-auto min-h-[44px] sm:min-h-0 touch-manipulation"
            >
              <IoAdd className="w-5 h-5" />
              Add Pipeline
            </button>
          )}
        </div>
      </div>

      {/* Desktop: table (md and up) */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 min-w-0 max-w-full">
        <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pipeline Name
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assign Team
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
                      <span>Loading pipelines...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    No pipelines found
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/70 hover:bg-gray-100/70"}
                  >
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/pipelines/${row.id}`)}
                        className="text-left hover:underline"
                        title="Open pipeline board"
                      >
                        {row.pipelineName}
                      </button>
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {row.groupName ?? "—"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {row.leads}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center -space-x-2">
                        {(row.assignedTeam || []).slice(0, 3).map((u) => (
                          <div
                            key={u.id}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-xs font-semibold border-2 border-white ring-1 ring-gray-200"
                            title={u.name}
                          >
                            {getInitials(u.name)}
                          </div>
                        ))}
                        {row.assignedTeam && row.assignedTeam.length > 3 && (
                          <span className="ml-1 text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            +{row.assignedTeam.length - 3}
                          </span>
                        )}
                        {(!row.assignedTeam || row.assignedTeam.length === 0) && (
                          <span className="inline-flex items-center justify-center min-w-[2rem] h-8 rounded-full bg-gray-200 text-gray-500 text-xs font-medium px-1.5">
                            +0
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatCreated(row.created)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/pipelines/${row.id}`)}
                          className="px-2.5 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                          title="Open board"
                        >
                          Board
                        </button>
                        {canEdit && (
                          <AnimatedEditButton
                            onClick={() => handleEditPipeline(row)}
                            size="sm"
                            title="Edit"
                          />
                        )}
                        {canDelete && (
                          <AnimatedDeleteButton
                            onClick={() => handleDeleteClick(row)}
                            size="sm"
                            title="Delete"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 px-3 sm:px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-0"
            >
              Prev
            </button>
            <span className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg">
              {pagination.page}
            </span>
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] sm:min-h-0"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Mobile/Tablet: card layout (below md) */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-12 text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
            <span className="text-sm">Loading pipelines...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-500 text-sm">No pipelines found</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <li
                key={row.id}
                className={`p-4 sm:p-4 hover:bg-gray-50/50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/pipelines/${row.id}`)}
                        className="text-sm font-semibold text-gray-900 truncate text-left hover:underline w-full"
                        title="Open pipeline board"
                      >
                        {row.pipelineName}
                      </button>
                      <p className="text-xs text-gray-600 mt-0.5">{row.groupName ?? "—"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {row.leads} leads · {formatCreated(row.created)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => router.push(`/dashboard/pipelines/${row.id}`)}
                        className="px-2.5 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                        title="Open board"
                      >
                        Board
                      </button>
                      {canEdit && (
                        <AnimatedEditButton
                          onClick={() => handleEditPipeline(row)}
                          size="sm"
                          title="Edit"
                        />
                      )}
                      {canDelete && (
                        <AnimatedDeleteButton
                          onClick={() => handleDeleteClick(row)}
                          size="sm"
                          title="Delete"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center -space-x-2 flex-wrap gap-y-1">
                    {(row.assignedTeam || []).slice(0, 3).map((u) => (
                      <div
                        key={u.id}
                        className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-xs font-semibold border-2 border-white ring-1 ring-gray-200"
                        title={u.name}
                      >
                        {getInitials(u.name)}
                      </div>
                    ))}
                    {row.assignedTeam && row.assignedTeam.length > 3 && (
                      <span className="ml-1 text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        +{row.assignedTeam.length - 3}
                      </span>
                    )}
                    {(!row.assignedTeam || row.assignedTeam.length === 0) && (
                      <span className="text-xs text-gray-400">No team</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center sm:justify-end gap-2 px-3 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              Prev
            </button>
            <span className="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))
              }
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Pipeline Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewPipelineName("");
          setNewPipelineDetails("");
          setNewGroupId("");
          setNewStages(defaultPipelineStageNames());
          setNewStageInput("");
        }}
        title="Add Pipeline"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name *</label>
            <input
              type="text"
              value={newPipelineName}
              onChange={(e) => setNewPipelineName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter pipeline name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
            <textarea
              value={newPipelineDetails}
              onChange={(e) => setNewPipelineDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Optional notes about this pipeline"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select
              value={newGroupId}
              onChange={(e) => setNewGroupId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">— None —</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">The selected group&apos;s team will be used by default.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stages *</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newStages.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border border-gray-200"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeStageChip(s, "new")}
                    className="text-gray-500 hover:text-gray-800"
                    aria-label={`Remove stage ${s}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStageInput}
                onChange={(e) => setNewStageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addStageChip(newStageInput, "new");
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Type stage name and press Enter"
              />
              <button
                type="button"
                onClick={() => addStageChip(newStageInput, "new")}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">These stages will be used in the pipeline board.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddPipeline}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Pipeline
            </button>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Pipeline Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPipeline(null);
        }}
        title="Edit Pipeline"
        size="md"
      >
        {editingPipeline && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Name *</label>
              <input
                type="text"
                value={editPipelineName}
                onChange={(e) => setEditPipelineName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter pipeline name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea
                value={editPipelineDetails}
                onChange={(e) => setEditPipelineDetails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Optional notes about this pipeline"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
              <select
                value={editGroupId}
                onChange={(e) => setEditGroupId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">— None —</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.groupName}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">The selected group&apos;s team is used by default.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stages *</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editStages.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs border border-gray-200"
                  >
                    {s}
                    <button
                      type="button"
                      onClick={() => removeStageChip(s, "edit")}
                      className="text-gray-500 hover:text-gray-800"
                      aria-label={`Remove stage ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editStageInput}
                  onChange={(e) => setEditStageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addStageChip(editStageInput, "edit");
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Type stage name and press Enter"
                />
                <button
                  type="button"
                  onClick={() => addStageChip(editStageInput, "edit")}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUpdatePipeline}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Update
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      {isDeleteModalOpen && pipelineToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPipelineToDelete(null);
          }}
          title="Delete Pipeline"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the pipeline &quot;{pipelineToDelete.pipelineName}&quot;? This
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setPipelineToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
