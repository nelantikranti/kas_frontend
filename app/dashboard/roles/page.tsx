"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import AnimatedDeleteButton from "@/components/AnimatedDeleteButton";
import { toast } from "@/components/Toast";
import { IoCreateOutline } from "react-icons/io5";
import { rolesAPI } from "@/lib/api";
import { can, getUserPermissions, PERMISSIONS } from "@/lib/permissions";

type RoleRow = {
  id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
  sortOrder?: number;
};

export default function RolesPage() {
  const canAccess = can(PERMISSIONS.USERS_MANAGE, getUserPermissions());
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<RoleRow | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<RoleRow | null>(null);
  const [name, setName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const rows = (await rolesAPI.list()) as RoleRow[];
      setRoles(Array.isArray(rows) ? rows : []);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canAccess) load();
  }, [canAccess]);

  const openCreate = () => {
    setEditRole(null);
    setName("");
    setModalOpen(true);
  };

  const openEdit = (role: RoleRow) => {
    setEditRole(role);
    setName(role.name);
    setModalOpen(true);
  };

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Role name is required");
    setSaving(true);
    try {
      if (editRole) {
        await rolesAPI.update(editRole.id, { name: trimmed });
        toast.success("Role updated");
      } else {
        await rolesAPI.create({ name: trimmed });
        toast.success("Role created");
      }
      setModalOpen(false);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (role: RoleRow) => {
    if (role.isSystem) return toast.error("System roles cannot be deleted");
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const confirmDelete = async () => {
    if (!roleToDelete || roleToDelete.isSystem) return;
    setDeleting(true);
    try {
      await rolesAPI.delete(roleToDelete.id);
      toast.success("Role deleted");
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
      await load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  if (!canAccess) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-600">
        You don&apos;t have permission to manage roles.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage roles. Assign permissions under Permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          Add role
        </button>
      </div>

      <div className="bg-white border rounded-xl min-w-0 max-w-full">
        {loading ? (
          <p className="p-6 text-gray-500 text-sm">Loading…</p>
        ) : roles.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">No roles found.</p>
        ) : (
          <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{role.name}</td>
                  <td className="px-4 py-3 text-gray-600">{role.isSystem ? "System" : "Custom"}</td>
                  <td className="px-4 py-3 text-right">
                    {role.isSystem ? (
                      <span className="text-gray-300">—</span>
                    ) : (
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(role)}
                          className="inline-flex items-center justify-center p-1.5 text-gray-600 hover:text-green-700 transition-colors"
                          title="Rename role"
                          aria-label={`Rename ${role.name}`}
                        >
                          <IoCreateOutline className="w-4 h-4" />
                        </button>
                        <AnimatedDeleteButton
                          size="sm"
                          title="Delete role"
                          onClick={() => openDelete(role)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => !saving && setModalOpen(false)} title={editRole ? "Rename role" : "Add role"}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving || (editRole?.isSystem ?? false)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. Sales Executive"
            />
            {editRole?.isSystem && (
              <p className="text-xs text-gray-500 mt-1">System role names cannot be changed.</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving || editRole?.isSystem}
              className="flex-1 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              disabled={saving}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        title="Delete role"
      >
        {roleToDelete && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AnimatedDeleteButton
                  size="sm"
                  title="Delete"
                  className="cursor-default pointer-events-none"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete role &quot;{roleToDelete.name}&quot;?
                </h3>
                <p className="text-sm text-gray-600">
                  Users with this role must be reassigned first. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete role"}
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
