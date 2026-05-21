"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { toast } from "@/components/Toast";
import { isAdmin, PERMISSION_GROUPS } from "@/lib/permissions";

type RoleName =
  | "Admin"
  | "HR"
  | "Sales Executive"
  | "Service Engineer"
  | "Project Manager"
  | "Accounts"
  | "Manager"
  | "Technician"
  | "Accountant";

const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function RolePermissionsPage() {
  const [roles, setRoles] = useState<RoleName[]>([]);
  const [rolePermissionsByRole, setRolePermissionsByRole] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [mode, setMode] = useState<"view" | "edit">("edit");
  const [activeRole, setActiveRole] = useState<RoleName | "">("");

  const canAccess = isAdmin(); // route is still protected server-side by users:manage

  const grouped = useMemo(() => PERMISSION_GROUPS, []);

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  };

  const loadRoles = async () => {
    const token = localStorage.getItem("authToken");
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/role-permissions/list`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to load roles");
    const data = await res.json();
    const list = Array.isArray(data?.roles) ? (data.roles as RoleName[]) : [];
    setRoles(list);
  };

  const loadRolePermissions = async (role: RoleName) => {
    const token = localStorage.getItem("authToken");
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/role-permissions/${encodeURIComponent(role)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to load role permissions");
    const data = await res.json();
    const perms = Array.isArray(data?.permissions) ? (data.permissions as string[]) : [];
    setRolePermissionsByRole((prev) => ({ ...prev, [role]: perms }));
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await loadRoles();
      } catch (e: any) {
        toast.error(e?.message || "Failed to load roles");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (roles.length === 0) return;
    (async () => {
      try {
        setLoading(true);
        // Preload all roles for the list view (small, fixed set)
        await Promise.all(roles.map((r) => loadRolePermissions(r)));
      } catch (e: any) {
        toast.error(e?.message || "Failed to load role permissions");
        setRolePermissionsByRole({});
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles.join("|")]);

  if (!canAccess) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 text-sm text-gray-600">
        You don&apos;t have permission to view this module.
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Role Permissions</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage permissions by role (single place). Per-user custom permissions are disabled.
          </p>
        </div>
        {/* No global add button; each role has View/Edit/Delete actions below */}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">Loading…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="text-left py-3 pr-3">Role</th>
                  <th className="text-left py-3 pr-3">Enabled</th>
                  <th className="text-left py-3 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {roles.map((role) => {
                  const enabled = role === "Admin" ? "All" : String((rolePermissionsByRole[role] || []).length);
                  return (
                    <tr key={role} className="hover:bg-gray-50">
                      <td className="py-3 pr-3 font-medium text-gray-900">{role}</td>
                      <td className="py-3 pr-3 text-gray-700">{enabled}</td>
                      <td className="py-3 pr-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                            onClick={() => {
                              setMode("view");
                              setActiveRole(role);
                              setSelectedPermissions(rolePermissionsByRole[role] || []);
                              setIsModalOpen(true);
                            }}
                          >
                            View
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                            disabled={role === "Admin"}
                            onClick={() => {
                              setMode("edit");
                              setActiveRole(role);
                              setSelectedPermissions(rolePermissionsByRole[role] || []);
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                            disabled={role === "Admin"}
                            onClick={async () => {
                              if (role === "Admin") return;
                              try {
                                setSaving(true);
                                const token = localStorage.getItem("authToken");
                                const apiUrl = getApiUrl();
                                const res = await fetch(`${apiUrl}/role-permissions/${encodeURIComponent(role)}`, {
                                  method: "DELETE",
                                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                                });
                                if (!res.ok) {
                                  const err = await res.json().catch(() => ({}));
                                  throw new Error(err?.error || "Failed to delete role permissions override");
                                }
                                setRolePermissionsByRole((prev) => ({ ...prev, [role]: [] }));
                                toast.success("Role override cleared (back to default)");
                              } catch (e: any) {
                                toast.error(e?.message || "Failed to delete override");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!saving) setIsModalOpen(false);
        }}
        title="Update Permissions"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as any)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white"
                disabled={saving || mode === "view"}
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Selected: <span className="font-semibold text-gray-900">{selectedPermissions.length}</span>
            </div>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
            {grouped.map((group) => (
              <div key={group.label} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-sm font-semibold text-gray-900 mb-2">{group.label}</div>
                <div className="space-y-2">
                  {group.permissions.map((perm) => (
                    <label key={perm.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        disabled={saving || mode === "view" || activeRole === "Admin"}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-800">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50"
              disabled={saving || mode === "view" || !activeRole || activeRole === "Admin"}
              onClick={async () => {
                if (!activeRole) return;
                if (activeRole === "Admin") {
                  toast.error("Admin permissions are always full access.");
                  return;
                }
                try {
                  setSaving(true);
                  const token = localStorage.getItem("authToken");
                  const apiUrl = getApiUrl();
                  const res = await fetch(`${apiUrl}/role-permissions/${encodeURIComponent(activeRole)}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify({ permissions: selectedPermissions }),
                  });
                  if (!res.ok) {
                    const err = await res.json().catch(() => ({}));
                    throw new Error(err?.error || "Failed to update role permissions");
                  }
                  const data = await res.json();
                  const updated = Array.isArray(data?.permissions) ? data.permissions : selectedPermissions;
                  setRolePermissionsByRole((prev) => ({ ...prev, [activeRole]: updated }));
                  toast.success("Role permissions updated");
                  setIsModalOpen(false);
                } catch (e: any) {
                  toast.error(e?.message || "Failed to update role permissions");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Saving..." : "Update Permissions"}
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 disabled:opacity-50"
              disabled={saving}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

