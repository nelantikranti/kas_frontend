"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { toast } from "@/components/Toast";
import { IoAdd, IoSearch, IoEye, IoCopyOutline, IoTrash } from "react-icons/io5";
import AnimatedDeleteButton from "@/components/AnimatedDeleteButton";
import AnimatedEditButton from "@/components/AnimatedEditButton";
import { groupsAPI, usersAPI, leadsAPI } from "@/lib/api";
import { can, PERMISSIONS } from "@/lib/permissions";

interface AssignedUser {
  id: string;
  name: string;
}

interface Group {
  id: string;
  groupName: string;
  totalLeads: number;
  isSelected: boolean;
  created: string;
  addedBy: { id: string; name: string } | null;
  assignedTeam: AssignedUser[];
}

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

export default function GroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
  const [viewGroup, setViewGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupName, setEditGroupName] = useState("");
  const [newAssignedTeam, setNewAssignedTeam] = useState<string[]>([]);
  const [editAssignedTeam, setEditAssignedTeam] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [viewGroupLeads, setViewGroupLeads] = useState<{ id: string; name: string; email: string; stage?: string }[]>([]);
  const [viewGroupLeadsLoading, setViewGroupLeadsLoading] = useState(false);

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

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupsAPI.getAll(searchQuery.trim() || undefined);
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
      setGroups([]);
      toast.error("Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      const list = Array.isArray(data) ? data : [];
      setUsers(list.map((u: any) => ({ id: u.id, name: u.name || u.email || "User" })));
    } catch (_) {
      setUsers([]);
    }
  };

  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) fetchUsers();
  }, [isAddModalOpen, isEditModalOpen]);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    try {
      const created = await groupsAPI.create({
        groupName: newGroupName.trim(),
        addedBy: currentUserId,
        assignedTeam: newAssignedTeam,
      });
      setGroups((prev) => [created as Group, ...prev]);
      setIsAddModalOpen(false);
      setNewGroupName("");
      setNewAssignedTeam([]);
      toast.success("Group created");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create group");
    }
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setEditGroupName(group.groupName);
    setEditAssignedTeam(group.assignedTeam.map((t) => t.id));
    setIsEditModalOpen(true);
  };

  const handleUpdateGroup = async () => {
    if (!editingGroup) return;
    if (!editGroupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    try {
      const updated = await groupsAPI.update(editingGroup.id, {
        groupName: editGroupName.trim(),
        assignedTeam: editAssignedTeam,
      });
      setGroups((prev) => prev.map((g) => (g.id === editingGroup.id ? (updated as Group) : g)));
      setIsEditModalOpen(false);
      setEditingGroup(null);
      toast.success("Group updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update group");
    }
  };

  const handleViewGroup = async (group: Group) => {
    setViewGroup(group);
    setIsViewModalOpen(true);
    setViewGroupLeads([]);
    setViewGroupLeadsLoading(true);
    try {
      const leads = await leadsAPI.getAll(group.id);
      const list = Array.isArray(leads) ? leads : [];
      setViewGroupLeads(list.map((l: any) => ({ id: l.id || l.leadId || l._id?.toString(), name: l.name || "—", email: l.email || "—", stage: l.stage })));
    } catch (err) {
      console.error("Failed to load leads for group:", err);
      setViewGroupLeads([]);
    } finally {
      setViewGroupLeadsLoading(false);
    }
  };

  const handleCopy = async (group: Group) => {
    try {
      const copied = await groupsAPI.copy(group.id);
      setGroups((prev) => [copied as Group, ...prev]);
      toast.success("Group copied");
    } catch (err: any) {
      toast.error(err?.message || "Failed to copy group");
    }
  };

  const handleToggle = async (group: Group) => {
    try {
      const updated = await groupsAPI.toggle(group.id, !group.isSelected);
      setGroups((prev) => prev.map((g) => (g.id === group.id ? (updated as Group) : g)));
    } catch (_) {
      toast.error("Failed to update toggle");
    }
  };

  const handleDeleteClick = (group: Group) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!groupToDelete) return;
    try {
      await groupsAPI.delete(groupToDelete.id);
      setGroups((prev) => prev.filter((g) => g.id !== groupToDelete.id));
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
      toast.success("Group deleted");
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete group");
    }
  };

  const canCreate =
    can(PERMISSIONS.GROUPS_CREATE, userPermissions) ||
    can(PERMISSIONS.GROUPS_VIEW, userPermissions) ||
    can(PERMISSIONS.LEADS_VIEW, userPermissions);
  const canView = can(PERMISSIONS.GROUPS_VIEW, userPermissions) || can(PERMISSIONS.LEADS_VIEW, userPermissions);
  const canEdit = can(PERMISSIONS.GROUPS_EDIT, userPermissions);
  const canDelete = can(PERMISSIONS.GROUPS_DELETE, userPermissions);

  return (
    <div className="min-w-0 w-full">
      {/* Header: stack on mobile, row on sm+ */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 shrink-0">Groups</h1>
        <div className="flex flex-col sm:flex-row flex-1 gap-3 sm:gap-4 sm:justify-end sm:items-center min-w-0 w-full sm:w-auto">
          <div className="relative w-full min-w-0 sm:min-w-[180px] md:min-w-[220px] sm:max-w-md">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white placeholder-gray-500"
              aria-label="Search groups"
            />
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap text-sm font-medium shadow-sm shrink-0 w-full sm:w-auto min-h-[44px] sm:min-h-0 touch-manipulation"
          >
            <IoAdd className="w-5 h-5" />
            Add Group
          </button>
        </div>
      </div>

      {/* Desktop: table (md and up) */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-14">
                  Icon
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Leads
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Added By
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assign Team
                </th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
                      <span>Loading groups...</span>
                    </div>
                  </td>
                </tr>
              ) : groups.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    No groups found
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggle(group)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                          group.isSelected ? "bg-green-600" : "bg-gray-200"
                        }`}
                        role="switch"
                        aria-checked={group.isSelected}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                            group.isSelected ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path d="M12 4.5a3 3 0 11-6 0 3 3 0 016 0zM6 10.5a3 3 0 00-3 3v3h6v-3a3 3 0 00-3-3H6zM18 10.5a3 3 0 00-3 3v3h6v-3a3 3 0 00-3-3h-3z" />
                        </svg>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {canView ? (
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/leads?groupId=${group.id}`)}
                          className="text-green-700 hover:text-green-900 hover:underline"
                          title="View leads in this group"
                        >
                          {group.groupName}
                        </button>
                      ) : (
                        <span>{group.groupName}</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {group.totalLeads}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatCreated(group.created)}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {group.addedBy?.name ?? "—"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center -space-x-2">
                        {(group.assignedTeam || []).slice(0, 3).map((u) => (
                          <div
                            key={u.id}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-xs font-semibold border-2 border-white ring-1 ring-gray-200"
                            title={u.name}
                          >
                            {getInitials(u.name)}
                          </div>
                        ))}
                        {group.assignedTeam && group.assignedTeam.length > 3 && (
                          <span className="ml-1 text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                            +{group.assignedTeam.length - 3}
                          </span>
                        )}
                        {(!group.assignedTeam || group.assignedTeam.length === 0) && (
                          <span className="text-xs text-gray-400">+0</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {canView && (
                          <button
                            onClick={() => handleViewGroup(group)}
                            className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="View"
                          >
                            <IoEye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(group)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy"
                        >
                          <IoCopyOutline className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <AnimatedEditButton
                            onClick={() => handleEditGroup(group)}
                            size="sm"
                            title="Edit"
                          />
                        )}
                        {canDelete && (
                          <AnimatedDeleteButton
                            onClick={() => handleDeleteClick(group)}
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
      </div>

      {/* Mobile/Tablet: card layout (below md) */}
      <div className="md:hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-12 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent" />
            <span className="text-sm">Loading groups...</span>
          </div>
        ) : groups.length === 0 ? (
          <div className="px-4 py-12 text-center text-gray-500 text-sm bg-white rounded-xl border border-gray-200 shadow-sm">
            No groups found
          </div>
        ) : (
          <ul className="flex flex-col gap-3 sm:gap-4">
            {groups.map((group) => (
              <li
                key={group.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden"
              >
                <div className="p-4 sm:p-5 flex flex-col gap-4">
                  {/* Row 1: Toggle + Icon + Name & meta + Actions */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => handleToggle(group)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                          group.isSelected ? "bg-green-600" : "bg-gray-200"
                        }`}
                        role="switch"
                        aria-checked={group.isSelected}
                        aria-label={group.isSelected ? "Deselect group" : "Select group"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${
                            group.isSelected ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 flex-shrink-0">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path d="M12 4.5a3 3 0 11-6 0 3 3 0 016 0zM6 10.5a3 3 0 00-3 3v3h6v-3a3 3 0 00-3-3H6zM18 10.5a3 3 0 00-3 3v3h6v-3a3 3 0 00-3-3h-3z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                      {canView ? (
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/leads?groupId=${group.id}`)}
                          className="text-sm font-semibold text-gray-900 hover:text-green-700 hover:underline text-left block w-full break-words line-clamp-2"
                          title={group.groupName}
                        >
                          {group.groupName}
                        </button>
                      ) : (
                        <p className="text-sm font-semibold text-gray-900 break-words line-clamp-2">{group.groupName}</p>
                      )}
                        <p className="text-xs text-gray-500 mt-1">
                          {group.totalLeads} leads · {formatCreated(group.created)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {canView && (
                        <button
                          onClick={() => handleViewGroup(group)}
                          className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors touch-manipulation"
                          title="View"
                          aria-label="View group"
                        >
                          <IoEye className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(group)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                        title="Copy"
                        aria-label="Copy group"
                      >
                        <IoCopyOutline className="w-5 h-5" />
                      </button>
                      {canEdit && (
                        <AnimatedEditButton
                          onClick={() => handleEditGroup(group)}
                          size="sm"
                          title="Edit"
                        />
                      )}
                      {canDelete && (
                        <AnimatedDeleteButton
                          onClick={() => handleDeleteClick(group)}
                          size="sm"
                          title="Delete"
                        />
                      )}
                    </div>
                  </div>
                  {/* Row 2: By + Assigned team */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-gray-100 pt-3">
                    <span className="text-xs text-gray-500 shrink-0">
                      By {group.addedBy?.name ?? "—"}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      {(group.assignedTeam || []).slice(0, 5).map((u) => (
                        <div
                          key={u.id}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm flex-shrink-0"
                          title={u.name}
                        >
                          {getInitials(u.name)}
                        </div>
                      ))}
                      {group.assignedTeam && group.assignedTeam.length > 5 && (
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          +{group.assignedTeam.length - 5}
                        </span>
                      )}
                      {(!group.assignedTeam || group.assignedTeam.length === 0) && (
                        <span className="text-xs text-gray-400">No team</span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Group Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setNewGroupName("");
          setNewAssignedTeam([]);
        }}
        title="Add Group"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter group name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Team</label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {users.map((u) => (
                <label key={u.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={newAssignedTeam.includes(u.id)}
                    onChange={(e) =>
                      setNewAssignedTeam((prev) =>
                        e.target.checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)
                      )
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{u.name}</span>
                </label>
              ))}
              {users.length === 0 && (
                <p className="text-sm text-gray-500 p-2">No users available</p>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddGroup}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Group
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

      {/* View Group Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewGroup(null);
          setViewGroupLeads([]);
        }}
        title="Group Details"
        size="md"
      >
        {viewGroup && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 via-white to-green-50 border border-green-100 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{viewGroup.groupName}</h2>
              <p className="text-sm text-gray-600">
                Created on <span className="font-medium">{formatCreated(viewGroup.created)}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Added by{" "}
                <span className="font-medium">
                  {viewGroup.addedBy?.name ?? "—"}
                </span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Leads</p>
                <p className="text-lg font-semibold text-gray-900">{viewGroup.totalLeads}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900">
                  {viewGroup.isSelected ? "Selected" : "Not Selected"}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Leads in this group</p>
              {viewGroupLeadsLoading ? (
                <div className="flex items-center gap-2 py-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent" />
                  Loading leads...
                </div>
              ) : viewGroupLeads.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {viewGroupLeads.map((lead) => (
                    <li key={lead.id} className="flex items-center justify-between gap-2 py-1.5 border-b border-gray-100 last:border-0">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-900 block truncate">{lead.name}</span>
                        <span className="text-xs text-gray-500 block truncate">{lead.email}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsViewModalOpen(false);
                          setViewGroup(null);
                          setViewGroupLeads([]);
                          router.push(`/dashboard/leads/edit/${lead.id}`);
                        }}
                        className="shrink-0 text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No leads assigned to this group</p>
              )}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Assigned Team</p>
              {viewGroup.assignedTeam && viewGroup.assignedTeam.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {viewGroup.assignedTeam.map((member) => (
                    <div
                      key={member.id}
                      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-green-50 border border-green-100"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white text-xs font-semibold">
                        {getInitials(member.name)}
                      </div>
                      <span className="text-sm text-gray-800">{member.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No team members assigned</p>
              )}
            </div>
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewGroup(null);
                  setViewGroupLeads([]);
                  router.push(`/dashboard/leads?groupId=${viewGroup.id}`);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Open leads for this group
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewGroup(null);
                  setViewGroupLeads([]);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Group Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingGroup(null);
        }}
        title="Edit Group"
        size="md"
      >
        {editingGroup && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group Name *</label>
              <input
                type="text"
                value={editGroupName}
                onChange={(e) => setEditGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter group name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign Team</label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                {users.map((u) => (
                  <label key={u.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={editAssignedTeam.includes(u.id)}
                      onChange={(e) =>
                        setEditAssignedTeam((prev) =>
                          e.target.checked ? [...prev, u.id] : prev.filter((id) => id !== u.id)
                        )
                      }
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{u.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUpdateGroup}
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
      {isDeleteModalOpen && groupToDelete && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setGroupToDelete(null);
          }}
          title="Delete Group"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the group &quot;{groupToDelete.groupName}&quot;? This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setGroupToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <IoTrash className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
