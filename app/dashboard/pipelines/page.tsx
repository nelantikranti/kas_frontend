"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/Modal";
import { toast } from "@/components/Toast";
import { IoAdd, IoSearch } from "react-icons/io5";
import AnimatedDeleteButton from "@/components/AnimatedDeleteButton";
import AnimatedEditButton from "@/components/AnimatedEditButton";
import { pipelinesAPI, PipelineListItem, groupsAPI } from "@/lib/api";
import { can, PERMISSIONS } from "@/lib/permissions";

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
  const [editPipelineName, setEditPipelineName] = useState("");
  const [newGroupId, setNewGroupId] = useState<string>("");
  const [editGroupId, setEditGroupId] = useState<string>("");
  const [groups, setGroups] = useState<{ id: string; groupName: string }[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserPermissions(u.permissions || []);
        setCurrentUserId(u.id || "");
      } catch (_) {}
    }
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
    try {
      await pipelinesAPI.create({
        pipelineName: newPipelineName.trim(),
        groupId: newGroupId || null,
        addedBy: currentUserId,
      });
      setNewPipelineName("");
      setNewGroupId("");
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
    setEditGroupId(row.groupId || "");
    setEditAssignedTeam(row.assignedTeam?.map((t) => t.id) || []);
    setIsEditModalOpen(true);
  };

  const handleUpdatePipeline = async () => {
    if (!editingPipeline) return;
    if (!editPipelineName.trim()) {
      toast.error("Pipeline name is required");
      return;
    }
    try {
      await pipelinesAPI.update(editingPipeline.id, {
        pipelineName: editPipelineName.trim(),
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
    <div>
      <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 shrink-0">Leads Pipelines</h1>
        <div className="flex flex-1 justify-end gap-3 sm:gap-4 items-center min-w-0">
          <div className="relative min-w-[180px] sm:min-w-[220px] max-w-md w-full sm:w-auto">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white placeholder-gray-500"
              aria-label="Search pipelines"
            />
          </div>
          {canCreate && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap text-sm font-medium shadow-sm shrink-0"
            >
              <IoAdd className="w-5 h-5" />
              Add Pipeline
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pipeline Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leads
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assign Team
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.pipelineName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {row.groupName ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {row.leads}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
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
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatCreated(row.created)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
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
          <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          setNewGroupId("");
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
