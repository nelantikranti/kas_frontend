"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import { toast } from "@/components/Toast";
import { IoAdd, IoPerson, IoSearch, IoEye, IoShieldCheckmark, IoCheckmarkCircle, IoSettings, IoLockClosed } from "react-icons/io5";
import AnimatedDeleteButton from "@/components/AnimatedDeleteButton";
import AnimatedEditButton from "@/components/AnimatedEditButton";
import { usersAPI } from "@/lib/api";
import { useRoles } from "@/hooks/useRoles";
import EmployeeCodeBadge from "@/components/hr/EmployeeCodeBadge";
import {
  PERMISSION_GROUPS,
  can,
  getEffectivePermissions,
  getUserPermissions,
  isAdmin,
  PERMISSIONS,
  resolvePermissionSource,
  type PermissionSourceMode,
} from "@/lib/permissions";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  employeeId?: string;
  employeeCode?: string;
  status: "Active" | "Inactive" | "Pending";
  lastLogin: string;
  password?: string;
  permissions?: string[];
  permissionSource?: PermissionSourceMode;
  createdAt?: string;
}

export default function UsersPage() {
  const { roles: roleOptions } = useRoles();
  const router = useRouter();
  const currentUserPermissions = getUserPermissions();
  const canViewUsers = can(PERMISSIONS.USERS_VIEW, currentUserPermissions) || can(PERMISSIONS.USERS_MANAGE, currentUserPermissions);
  const canManageUsers = can(PERMISSIONS.USERS_MANAGE, currentUserPermissions);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [permissionsUser, setPermissionsUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToReject, setUserToReject] = useState<User | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  /** Read synchronously so first paint matches admin checks (fixes missing Permissions button for Admin). */
  const readSessionUserRoleId = (): { role: string; id: string } => {
    if (typeof window === "undefined") return { role: "", id: "" };
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return { role: "", id: "" };
      const u = JSON.parse(raw);
      return { role: String(u?.role || "").trim(), id: String(u?.id || "") };
    } catch {
      return { role: "", id: "" };
    }
  };

  const [currentUserRole, setCurrentUserRole] = useState<string>(() => readSessionUserRoleId().role);
  const [currentUserId, setCurrentUserId] = useState<string>(() => readSessionUserRoleId().id);

  const canReviewSignups =
    isAdmin() ||
    currentUserRole === "HR" ||
    can(PERMISSIONS.USERS_MANAGE, currentUserPermissions) ||
    can(PERMISSIONS.HR_VIEW, currentUserPermissions);

  useEffect(() => {
    const { role, id } = readSessionUserRoleId();
    setCurrentUserRole(role);
    setCurrentUserId(id);
  }, []);

  // Fetch users from API on component mount
  useEffect(() => {
    if (currentUserRole) {
      refreshUsers(currentUserRole);
    }
  }, [currentUserRole]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Sales Executive" as User["role"],
  });
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    password: "", // Optional password change
    role: "Sales Executive" as User["role"],
    status: "Active" as User["status"],
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showPermissionsSection, setShowPermissionsSection] = useState(false);

  const getApiUrl = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const refreshUsers = async (role: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const apiUrl = getApiUrl();
      const isAdmin = role === "Admin";
      const usersResponse = await fetch(
        isAdmin ? `${apiUrl}/users?includePasswords=true` : `${apiUrl}/users`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!usersResponse.ok) {
        throw new Error("Failed to fetch users");
      }

      const fetchedUsers: User[] = await usersResponse.json();
      setUsers(fetchedUsers.filter((u) => u.status !== "Pending"));
      setPendingUsers(fetchedUsers.filter((u) => u.status === "Pending"));

      const canFetchPending =
        role === "Admin" ||
        role === "HR" ||
        can(PERMISSIONS.USERS_MANAGE, getUserPermissions()) ||
        can(PERMISSIONS.HR_VIEW, getUserPermissions());
      if (canFetchPending) {
        const pendingResponse = await fetch(`${apiUrl}/users/pending`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (pendingResponse.ok) {
          const pendingData = await pendingResponse.json();
          setPendingUsers(pendingData);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
      setPendingUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    // Validation
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Name, email, and password are required");
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        status: "Active" as User["status"],
      };
      await usersAPI.create(userData);
      setIsModalOpen(false);
      setNewUser({ name: "", email: "", password: "", role: "Sales Executive" });
      toast.success("User created successfully");
      await refreshUsers(currentUserRole);
    } catch (error: any) {
      console.error("Failed to create user:", error);
      const errorMessage = error?.message || "Failed to create user. Please try again.";
      toast.error(errorMessage);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setSelectedPermissions(
      getEffectivePermissions({
        role: user.role,
        permissions: user.permissions ?? [],
        permissionSource: user.permissionSource,
      })
    );
    setEditErrors({});
    setShowPasswordField(false);
    setShowPermissionsSection(false);
    setIsEditModalOpen(true);
  };

  const validateEditForm = () => {
    const errors: Record<string, string> = {};
    
    if (!editUser.name.trim()) {
      errors.name = "Name is required";
    } else if (editUser.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    
    if (!editUser.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editUser.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (showPasswordField && editUser.password) {
      if (editUser.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
    }
    
    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.includes(permission)
        ? prevArray.filter((p) => p !== permission)
        : [...prevArray, permission];
    });
  };

  const handleOpenPermissions = (user: User) => {
    setPermissionsUser(user);
    const effective = getEffectivePermissions({
      role: user.role,
      permissions: user.permissions ?? [],
      permissionSource: user.permissionSource,
    });
    setSelectedPermissions(effective);
    setIsPermissionsModalOpen(true);
  };

  const handleResetPermissionsToRoleDefaults = async () => {
    if (!permissionsUser || permissionsUser.role === "Admin") return;
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = getApiUrl();
      const permissionsResponse = await fetch(`${apiUrl}/users/${permissionsUser.id}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ permissionSource: "role", permissions: [] }),
      });
      if (!permissionsResponse.ok) {
        const errorData = await permissionsResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reset permissions");
      }

      const updatedUserResponse = await fetch(`${apiUrl}/users/${permissionsUser.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!updatedUserResponse.ok) throw new Error("Failed to refresh user");
      const updatedUserData = await updatedUserResponse.json();

      const refreshed: User = {
        id: updatedUserData.id,
        name: updatedUserData.name,
        email: updatedUserData.email,
        role: updatedUserData.role,
        status: updatedUserData.status,
        lastLogin: updatedUserData.lastLogin,
        permissions: updatedUserData.permissions,
        permissionSource: updatedUserData.permissionSource,
      };

      setUsers((prev) => prev.map((u) => (u.id === refreshed.id ? refreshed : u)));
      setPermissionsUser(refreshed);
      setSelectedPermissions(
        getEffectivePermissions({
          role: refreshed.role,
          permissions: refreshed.permissions ?? [],
          permissionSource: refreshed.permissionSource,
        })
      );

      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u?.id === refreshed.id) {
            const next = {
              ...u,
              permissions: refreshed.permissions,
              permissionSource: refreshed.permissionSource,
            };
            localStorage.setItem("user", JSON.stringify(next));
            window.dispatchEvent(
              new CustomEvent("userPermissionsUpdated", {
                detail: { permissions: getEffectivePermissions(next) },
              })
            );
          }
        } catch {
          /* ignore */
        }
      }

      toast.success("User now follows role default permissions.");
    } catch (e: any) {
      toast.error(e?.message || "Failed to reset permissions");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePermissions = async () => {
    if (!permissionsUser) return;
    
    setIsUpdating(true);
    
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const permissionsResponse = await fetch(`${apiUrl}/users/${permissionsUser.id}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          permissionSource: "custom",
          permissions: selectedPermissions,
        }),
      });

      if (!permissionsResponse.ok) {
        const errorData = await permissionsResponse.json().catch(() => ({}));
        console.error("Permission update error:", {
          status: permissionsResponse.status,
          statusText: permissionsResponse.statusText,
          errorData
        });
        const errorMessage = errorData.error || errorData.message || `Failed to update permissions (${permissionsResponse.status})`;
        throw new Error(errorMessage);
      }
      
      const responseData = await permissionsResponse.json();
      console.log("Permission update success:", responseData);

      // Fetch updated user data from backend to get latest permissions
      const updatedUserResponse = await fetch(`${apiUrl}/users/${permissionsUser.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!updatedUserResponse.ok) {
        throw new Error("Failed to refresh updated permissions");
      }
      const updatedUserData = await updatedUserResponse.json();
      
      // Update user in list with new permissions from backend
      const userWithPermissions: User = {
        ...updatedUserData,
        permissions: updatedUserData.permissions || selectedPermissions,
        permissionSource: updatedUserData.permissionSource,
      };
      const updatedUsers = users.map((u) =>
        u.id === permissionsUser.id ? userWithPermissions : u
      );
      setUsers(updatedUsers);
      
      // If updating current logged-in user, update localStorage immediately
      const currentUserStr = localStorage.getItem("user");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.id === permissionsUser.id) {
            const updatedCurrentUser = {
              ...currentUser,
              role: updatedUserData.role || currentUser.role,
              permissions: updatedUserData.permissions || selectedPermissions,
              permissionSource: updatedUserData.permissionSource ?? currentUser.permissionSource,
            };
            localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
            setCurrentUserRole(updatedCurrentUser.role || currentUserRole);
            window.dispatchEvent(new CustomEvent('userPermissionsUpdated', { 
              detail: { permissions: getEffectivePermissions(updatedCurrentUser) } 
            }));
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'user',
              newValue: JSON.stringify(updatedCurrentUser),
              storageArea: localStorage
            }));
          }
        } catch (e) {
          console.error("Failed to update current user data");
        }
      }
      
      setIsPermissionsModalOpen(false);
      setPermissionsUser(null);
      setSelectedPermissions([]);
      toast.success("Permissions updated successfully. Changes are now active!");
    } catch (error: any) {
      console.error("Failed to update permissions:", error);
      const errorMessage = error?.message || "Failed to update permissions. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const canChangeUserRole = isAdmin() || currentUserRole === "HR";

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    // Admin and HR can change roles
    if (editUser.role !== editingUser.role && !canChangeUserRole) {
      toast.error("Only administrators and HR can change user roles.");
      return;
    }
    
    // Prevent users from changing their own role
    if (editingUser.id === currentUserId && editUser.role !== editingUser.role) {
      toast.error("You cannot change your own role. Please contact another administrator.");
      return;
    }
    
    // Validate form
    if (!validateEditForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    
    setIsUpdating(true);
    setEditErrors({});
    
    try {
      // Prepare update data
      const updateData: any = {
        name: editUser.name.trim(),
        email: editUser.email.trim(),
        status: editUser.status,
      };
      
      // Include role when Admin/HR changes someone else's role
      if (canChangeUserRole && editingUser.id !== currentUserId && editUser.role) {
        updateData.role = editUser.role;
      }
      
      // Only include password if it's provided
      if (showPasswordField && editUser.password) {
        updateData.password = editUser.password;
      }
      
      // Update user basic info
      await usersAPI.update(editingUser.id, updateData);

      const token = localStorage.getItem("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      if (isAdmin() && showPermissionsSection) {
        const permissionsResponse = await fetch(`${apiUrl}/users/${editingUser.id}/permissions`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            permissionSource: "custom",
            permissions: selectedPermissions,
          }),
        });

        if (!permissionsResponse.ok) {
          throw new Error("Failed to update permissions");
        }
      }

      // Fetch updated user data from backend to get latest permissions
      const updatedUserResponse = await fetch(`${apiUrl}/users/${editingUser.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!updatedUserResponse.ok) {
        throw new Error("Failed to refresh updated user data");
      }
      const updatedUserData = await updatedUserResponse.json();
      
      // Update user in list with new permissions from backend
      const userWithPermissions: User = {
        ...updatedUserData,
        permissions: updatedUserData.permissions || selectedPermissions,
        permissionSource: updatedUserData.permissionSource,
      };
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? userWithPermissions : u
      );
      setUsers(updatedUsers);
      
      // If updating current logged-in user, update localStorage immediately
      const currentUserStr = localStorage.getItem("user");
      if (currentUserStr) {
        try {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.id === editingUser.id) {
            const updatedCurrentUser = {
              ...currentUser,
              role: updatedUserData.role || currentUser.role,
              permissions: updatedUserData.permissions || selectedPermissions,
              permissionSource: updatedUserData.permissionSource ?? currentUser.permissionSource,
            };
            localStorage.setItem("user", JSON.stringify(updatedCurrentUser));
            setCurrentUserRole(updatedCurrentUser.role || currentUserRole);
            window.dispatchEvent(new CustomEvent('userPermissionsUpdated', { 
              detail: { permissions: getEffectivePermissions(updatedCurrentUser) } 
            }));
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'user',
              newValue: JSON.stringify(updatedCurrentUser),
              storageArea: localStorage
            }));
          }
        } catch (e) {
          console.error("Failed to update current user data");
        }
      }
      
      setIsEditModalOpen(false);
      setEditingUser(null);
      setEditUser({ name: "", email: "", password: "", role: "Sales Executive", status: "Active" });
      setSelectedPermissions([]);
      setShowPasswordField(false);
      setShowPermissionsSection(false);
      setEditErrors({});
      toast.success("User and permissions updated successfully. Changes are now active!");
    } catch (error: any) {
      console.error("Failed to update user:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to update user. Please try again.";
      toast.error(errorMessage);
      if (error?.response?.data?.errors) {
        setEditErrors(error.response.data.errors);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    // Prevent deletion of Admin user
    if (user.role === "Admin") {
      toast.error("Admin cannot be deleted.");
      return;
    }
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleteModalOpen(false);
      await usersAPI.delete(userToDelete.id);
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      setPendingUsers(pendingUsers.filter((u) => u.id !== userToDelete.id));
      toast.success(`User "${userToDelete.name}" deleted successfully`);
      setUserToDelete(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user. Please try again.");
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/users/${userId}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to approve user");
      }

      const data = await response.json();
      
      // Remove from pending list and add to active users
      setPendingUsers(pendingUsers.filter((u) => u.id !== userId));
      setUsers([...users, data.user]);
      
      // Trigger notification refresh
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
      
      toast.success(`User ${data.user.name} approved successfully!`);
    } catch (error: any) {
      console.error("Failed to approve user:", error);
      toast.error(error.message || "Failed to approve user. Please try again.");
    }
  };

  const handleRejectClick = (user: User) => {
    setUserToReject(user);
    setIsRejectModalOpen(true);
  };

  const handleRejectUser = async () => {
    if (!userToReject) return;

    try {
      setIsRejectModalOpen(false);
      const token = localStorage.getItem("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/users/${userToReject.id}/reject`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to reject user");
      }

      // Remove from pending list
      setPendingUsers(pendingUsers.filter((u) => u.id !== userToReject.id));
      
      // Trigger notification refresh
      window.dispatchEvent(new CustomEvent('refreshNotifications'));
      
      toast.success(`Signup request from "${userToReject.name}" rejected successfully`);
      setUserToReject(null);
    } catch (error: any) {
      console.error("Failed to reject user:", error);
      toast.error(error.message || "Failed to reject user. Please try again.");
      setUserToReject(null);
    }
  };

  const handleCancelReject = () => {
    setIsRejectModalOpen(false);
    setUserToReject(null);
  };

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return users.filter((user) => {
      if (roleFilter && user.role !== roleFilter) return false;
      if (!query) return true;
      const code = (user.employeeId || user.employeeCode || "").toLowerCase();
      return (
        code.includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.status.toLowerCase().includes(query) ||
        user.lastLogin.toLowerCase().includes(query)
      );
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">User Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage system users and their permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-40 sm:w-44">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search name or code…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-32 sm:w-36 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All roles</option>
              {roleOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm sm:text-base"
          >
            <IoAdd className="w-4 h-4 sm:w-5 sm:h-5" />
            Add User
          </button>
          {canManageUsers && (
            <>
              <button
                type="button"
                onClick={() => router.push("/dashboard/roles")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap text-sm sm:text-base"
                title="Manage roles"
              >
                <IoShieldCheckmark className="w-4 h-4 sm:w-5 sm:h-5" />
                Roles
              </button>
              <button
                type="button"
                onClick={() => router.push("/dashboard/permissions")}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap text-sm sm:text-base"
                title="Manage permissions by role"
              >
                <IoLockClosed className="w-4 h-4 sm:w-5 sm:h-5" />
                Permissions
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pending Signup Requests — Admin & HR */}
      {canReviewSignups && (
        <div className={`mb-6 ${pendingUsers.length > 0 ? "bg-yellow-50 border-2 border-yellow-200" : "bg-gray-50 border-2 border-gray-200"} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IoShieldCheckmark className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Signup Requests {pendingUsers.length > 0 && `(${pendingUsers.length})`}
              </h2>
            </div>
          </div>
          {pendingUsers.length > 0 ? (
            <div className="space-y-3">
              {pendingUsers.map((pendingUser) => (
                <div
                  key={pendingUser.id}
                  className="bg-white rounded-lg p-4 border border-yellow-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{pendingUser.name}</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{pendingUser.email}</p>
                      <p className="text-xs text-gray-500">Role: {pendingUser.role}</p>
                      {pendingUser.createdAt && (
                        <p className="text-xs text-gray-400 mt-1">
                          Requested: {new Date(pendingUser.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveUser(pendingUser.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <IoCheckmarkCircle className="w-4 h-4" />
                        Accept
                      </button>
                      <AnimatedDeleteButton
                        onClick={() => handleRejectClick(pendingUser)}
                        size="sm"
                        title="Delete User"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">No pending signup requests</p>
          )}
        </div>
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <div className={`mb-4 text-sm rounded-lg px-4 py-2 inline-block ${
          filteredUsers.length > 0
            ? "bg-green-50 border border-green-200 text-gray-600"
            : "bg-red-50 border border-red-200 text-red-600"
        }`}>
          {filteredUsers.length > 0 ? (
            <>Showing <span className="font-semibold text-green-700">{filteredUsers.length}</span> of <span className="font-semibold">{users.length}</span> users</>
          ) : (
            <>No users found for "<span className="font-semibold">{searchQuery}</span>"</>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              <span className="text-sm">Loading users...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500 text-sm">
            {users.length === 0 ? "No users yet" : "No results found"}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{user.name}</h3>
                  <EmployeeCodeBadge code={user.employeeId || user.employeeCode} />
                </div>
                <StatusBadge status={user.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900 truncate">{user.email}</p>
                  {isAdmin() && (
                    <>
                      <p className="text-xs text-gray-500 mb-1 mt-2">Password</p>
                      <p className="text-gray-900 truncate font-mono text-xs">{user.password || "Not set"}</p>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Role</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Last Login</p>
                  <p className="text-gray-900">{user.lastLogin}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {canViewUsers && (
                  <button 
                    onClick={() => {
                      setViewingUser(user);
                      setIsViewModalOpen(true);
                    }}
                    className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <IoEye className="w-4 h-4" />
                    View
                  </button>
                )}
                {canManageUsers && (
                  <AnimatedEditButton
                    onClick={() => handleEditUser(user)}
                    size="sm"
                    title="Edit User"
                    className="flex-shrink-0"
                  />
                )}
                {/* Per-user permissions removed: manage role permissions from the single dashboard page */}
                {canManageUsers && user.role !== "Admin" && (
                  <AnimatedDeleteButton
                    onClick={() => handleDeleteClick(user)}
                    size="sm"
                    title="Delete User"
                    className="flex-1"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 min-w-0 max-w-full">
        <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      <span className="text-sm">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    {users.length === 0 ? "No users yet" : "No results found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                        <EmployeeCodeBadge code={user.employeeId || user.employeeCode} className="text-xs" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[200px]">
                    <div>
                      <div className="truncate">{user.email}</div>
                      {isAdmin() && (
                        <div className="text-xs text-gray-600 font-mono mt-1 truncate">
                          {user.password || "Not set"}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      {canViewUsers && (
                        <button 
                          onClick={() => {
                            setViewingUser(user);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                          title="View User Details"
                        >
                          <IoEye className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      )}
                      {canManageUsers && (
                        <AnimatedEditButton
                          onClick={() => handleEditUser(user)}
                          size="sm"
                          title="Edit User"
                        />
                      )}
                      {/* Per-user permissions removed: manage role permissions from the single dashboard page */}
                      {canManageUsers && user.role !== "Admin" && (
                        <AnimatedDeleteButton
                          onClick={() => handleDeleteClick(user)}
                          size="sm"
                          title="Delete User"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password (min 6 characters)"
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            >
              {roleOptions
                .filter((r) => r !== "Admin")
                .map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleAddUser}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add User
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          if (!isUpdating) {
          setIsEditModalOpen(false);
          setEditingUser(null);
            setEditUser({ name: "", email: "", password: "", role: "Sales Executive", status: "Active" });
            setSelectedPermissions([]);
            setShowPasswordField(false);
            setShowPermissionsSection(false);
            setEditErrors({});
          }
        }}
        title="Edit User"
        size="lg"
      >
        {editingUser && (
          <div className="space-y-5">
            {/* User Header Card */}
            <div className="bg-gradient-to-br from-green-50 via-blue-50 to-green-50 rounded-xl p-5 border-2 border-green-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {editingUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{editingUser.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <span>📧</span> {editingUser.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-md text-xs font-semibold">
                      {editingUser.role}
                    </span>
                    <StatusBadge status={editingUser.status} />
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-lg border-2 border-gray-100 p-5">
              <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <IoPerson className="w-4 h-4 text-green-600" />
                </div>
                Basic Information
              </h4>
              <div className="space-y-4 mt-4">
          <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editUser.name}
                    onChange={(e) => {
                      setEditUser({ ...editUser, name: e.target.value });
                      if (editErrors.name) setEditErrors({ ...editErrors, name: "" });
                    }}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      editErrors.name
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    }`}
                    placeholder="Enter full name"
                    disabled={isUpdating}
                  />
                  {editErrors.name && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <span>⚠</span> {editErrors.name}
                    </p>
                  )}
          </div>

          <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={editUser.email}
                    onChange={(e) => {
                      setEditUser({ ...editUser, email: e.target.value });
                      if (editErrors.email) setEditErrors({ ...editErrors, email: "" });
                    }}
                    className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      editErrors.email
                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                    }`}
                    placeholder="user@example.com"
                    disabled={isUpdating}
                  />
                  {editErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <span>⚠</span> {editErrors.email}
                    </p>
                  )}
          </div>

                {/* Password Change Option */}
          <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordField(!showPasswordField);
                        if (showPasswordField) {
                          setEditUser({ ...editUser, password: "" });
                          setEditErrors({ ...editErrors, password: "" });
                        }
                      }}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                      disabled={isUpdating}
                    >
                      {showPasswordField ? "Cancel Change" : "Change Password"}
                    </button>
                  </div>
                  {showPasswordField && (
                    <div>
                      <input
                        type="password"
                        value={editUser.password}
                        onChange={(e) => {
                          setEditUser({ ...editUser, password: e.target.value });
                          if (editErrors.password) setEditErrors({ ...editErrors, password: "" });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          editErrors.password
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-green-500 focus:border-green-500"
                        }`}
                        placeholder="Enter new password (leave empty to keep current)"
                        disabled={isUpdating}
                      />
                      {editErrors.password && (
                        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                          <span>⚠</span> {editErrors.password}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-gray-500">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role & Status */}
            <div className="bg-white rounded-lg border-2 border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <IoSettings className="w-4 h-4 text-blue-600" />
                  </div>
                  Role & Status
                </h4>
                {/* Per-user permissions removed: use /dashboard/permissions to manage role permissions */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
            </label>
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value as User["role"] })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    disabled={isUpdating || (editingUser && editingUser.id === currentUserId) || !canChangeUserRole}
            >
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
            </select>
            {editingUser && editingUser.id === currentUserId && (
              <p className="text-sm text-red-600 mt-1">You cannot change your own role</p>
            )}
            {!canChangeUserRole && (
              <p className="text-sm text-red-600 mt-1">Only administrators and HR can change user roles</p>
            )}
          </div>
          <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
            </label>
            <select
              value={editUser.status}
              onChange={(e) => setEditUser({ ...editUser, status: e.target.value as User["status"] })}
                    className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white text-gray-900 font-medium"
                    disabled={isUpdating}
            >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
            </select>
          </div>
              </div>
            </div>

            {/* Role permissions moved to /dashboard/permissions */}

            {/* Action Buttons - Clean Design */}
            <div className="mt-6 pt-4 pb-2">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* Update Button */}
            <button
              onClick={handleUpdateUser}
                  disabled={isUpdating}
                  className="group relative flex-1 px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99]"
            >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <IoCheckmarkCircle className="w-4 h-4" />
                      <span>Update User</span>
                    </>
                  )}
            </button>
                
                {/* Cancel Button */}
            <button
              onClick={() => {
                    if (!isUpdating) {
                setIsEditModalOpen(false);
                setEditingUser(null);
                      setEditUser({ name: "", email: "", password: "", role: "Sales Executive", status: "Active" });
                      setSelectedPermissions([]);
                      setShowPasswordField(false);
                      setShowPermissionsSection(false);
                      setEditErrors({});
                    }
                  }}
                  disabled={isUpdating}
                  className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full flex items-center justify-center gap-2"
            >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
            </button>
          </div>
        </div>
          </div>
        )}
      </Modal>

      {/* Per-user permissions UI removed: use /dashboard/permissions */}

      {/* View User Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingUser(null);
        }}
        title="User Details"
        size="lg"
      >
        {viewingUser && (
          <div className="space-y-5">
            {/* User Header Card */}
            <div className="bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 rounded-xl p-6 border-2 border-blue-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {viewingUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{viewingUser.name}</h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                    <span>📧</span> {viewingUser.email}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                      {viewingUser.role}
                    </span>
                    <StatusBadge status={viewingUser.status} />
                </div>
                </div>
              </div>
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-lg border-2 border-gray-100 p-5">
              <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2 pb-3 border-b border-gray-200">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <IoPerson className="w-4 h-4 text-blue-600" />
                  </div>
                User Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email Address</label>
                  <p className="text-sm text-gray-900 font-medium break-words">{viewingUser.email}</p>
                </div>
                {isAdmin() && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Password</label>
                    <p className="text-sm text-gray-900 font-mono break-words">
                      {viewingUser.password || <span className="text-gray-400 italic">Not set</span>}
                    </p>
                  </div>
                )}
                {(viewingUser.employeeId || viewingUser.employeeCode) && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Employee Code</label>
                    <EmployeeCodeBadge code={viewingUser.employeeId || viewingUser.employeeCode} className="text-sm" />
                  </div>
                )}
                <div className="bg-gray-50 rounded-lg p-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Last Login</label>
                  <p className="text-sm text-gray-900 font-medium">{viewingUser.lastLogin || "Never"}</p>
                  </div>
                </div>
                  </div>

            {/* Permissions Section */}
            <div className="bg-white rounded-lg border-2 border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <IoShieldCheckmark className="w-4 h-4 text-purple-600" />
                </div>
                  Access Permissions
                </h4>
                <span className="px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-bold">
                  {viewingUser.permissions?.length || 0} Permissions
                    </span>
                  </div>
              {viewingUser.permissions && viewingUser.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-4">
                  {viewingUser.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-semibold"
                    >
                      ✓ {permission}
                    </span>
                  ))}
                  </div>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <p className="text-sm text-gray-500 font-medium">No permissions assigned</p>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="pt-2 pb-2">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setViewingUser(null);
                }}
                className="w-full px-5 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
        <Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} title="Delete User">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center">
                  <AnimatedDeleteButton
                    size="md"
                    title="Delete"
                    className="cursor-default pointer-events-none"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are you sure you want to delete this user?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This action cannot be undone. The user will be permanently removed from the system.
                </p>
                
                {/* User Details */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {userToDelete.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userToDelete.name}</p>
                      <p className="text-sm text-gray-600">{userToDelete.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Role</p>
                      <p className="text-sm font-medium text-gray-900">{userToDelete.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <StatusBadge status={userToDelete.status} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 39" className="w-4 h-4">
                  <path fill="white" d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
                  <path strokeWidth={4} stroke="white" d="M12 6L12 29" />
                  <path strokeWidth={4} stroke="white" d="M21 6V29" />
                </svg>
                Yes, Delete User
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Signup Request Confirmation Modal */}
      {isRejectModalOpen && userToReject && (
        <Modal isOpen={isRejectModalOpen} onClose={handleCancelReject} title="Reject Signup Request">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center">
                  <AnimatedDeleteButton
                    size="md"
                    title="Reject"
                    className="cursor-default pointer-events-none border-yellow-500 bg-yellow-500"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are you sure you want to reject this signup request?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This action cannot be undone. The signup request will be permanently deleted and the user will not be able to login.
                </p>
                
                {/* User Details */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {userToReject.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userToReject.name}</p>
                      <p className="text-sm text-gray-600">{userToReject.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Role</p>
                      <p className="text-sm font-medium text-gray-900">{userToReject.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <StatusBadge status={userToReject.status} />
                    </div>
                    {userToReject.createdAt && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 mb-1">Requested Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(userToReject.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCancelReject}
                className="flex-1 px-4 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectUser}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 33 39" className="w-4 h-4">
                  <path fill="white" d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
                  <path strokeWidth={4} stroke="white" d="M12 6L12 29" />
                  <path strokeWidth={4} stroke="white" d="M21 6V29" />
                </svg>
                Yes, Reject Request
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}

