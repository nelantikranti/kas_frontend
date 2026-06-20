// Frontend permission utilities

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  LEADS_VIEW: "leads:view",
  LEADS_VIEW_ALL: "leads:view_all",
  LEADS_CREATE: "leads:create",
  LEADS_EDIT: "leads:edit",
  LEADS_DELETE: "leads:delete",
  QUOTATIONS_VIEW: "quotations:view",
  QUOTATIONS_CREATE: "quotations:create",
  QUOTATIONS_APPROVE: "quotations:approve",
  PROJECTS_VIEW: "projects:view",
  PROJECTS_CREATE: "projects:create",
  PROJECTS_EDIT: "projects:edit",
  PROJECTS_DELETE: "projects:delete",
  PROJECTS_ASSIGN: "projects:assign",
  DOCUMENT_UPLOAD: "document:upload",
  DOCUMENT_DELETE: "document:delete",
  EXPENSE_VIEW: "expense:view",
  EXPENSE_EDIT: "expense:edit",
  EXPENSE_ADD: "expense:add",
  EXPENSE_DELETE: "expense:delete",
  AMC_VIEW: "amc:view",
  AMC_UPDATE: "amc:update",
  USERS_VIEW: "users:view",
  USERS_MANAGE: "users:manage",
  REPORTS_VIEW: "reports:view",
  SETTINGS_MANAGE: "settings:manage",
  BLOGS_VIEW: "blogs:view",
  BLOGS_CREATE: "blogs:create",
  BLOGS_EDIT: "blogs:edit",
  BLOGS_DELETE: "blogs:delete",
  FORM_SUBMISSIONS_VIEW: "form_submissions:view",
  FORM_SUBMISSIONS_DELETE: "form_submissions:delete",
  DEMO_REQUESTS_VIEW: "demo_requests:view",
  DEMO_REQUESTS_DELETE: "demo_requests:delete",
  TESTIMONIALS_VIEW: "testimonials:view",
  ACTIVITY_VIEW: "activity:view",
  GROUPS_VIEW: "groups:view",
  GROUPS_CREATE: "groups:create",
  GROUPS_EDIT: "groups:edit",
  GROUPS_DELETE: "groups:delete",
  PIPELINES_VIEW: "pipelines:view",
  PIPELINES_CREATE: "pipelines:create",
  PIPELINES_EDIT: "pipelines:edit",
  PIPELINES_DELETE: "pipelines:delete",

  // Staff Performance
  VIEW_PERFORMANCE_REPORT: "view_performance_report",
  HR_PERFORMANCE_EXPORT: "hr:performance_export",

  HR_VIEW: "hr:view",
  HR_EMPLOYEES_MANAGE: "hr:employees_manage",
  HR_LEAVE_VIEW: "hr:leave_view",
  HR_LEAVE_MANAGE: "hr:leave_manage",
  HR_LEAVE_REQUEST: "hr:leave_request",
  HR_ATTENDANCE_VIEW: "hr:attendance_view",
  HR_ATTENDANCE_MANAGE: "hr:attendance_manage",
  HR_ATTENDANCE_SELF: "hr:attendance_self",
  HR_ONBOARDING_MANAGE: "hr:onboarding_manage",
  HR_TIMESHEET_VIEW: "hr:timesheet_view",
  HR_TIMESHEET_MANAGE: "hr:timesheet_manage",
  HR_TIMESHEET_SUBMIT: "hr:timesheet_submit",
  HR_PAYROLL_VIEW: "hr:payroll_view",
  HR_PAYROLL_MANAGE: "hr:payroll_manage",
  HR_PAYROLL_GENERATE: "hr:payroll_generate",
  HR_OFFER_MANAGE: "hr:offer_manage",
  HR_PAYSLIP_SELF: "hr:payslip_self",
} as const;

// All permission values (Admin gets this list)
export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as string[];

/** Mirrors backend defaults — used when stored permissions are empty */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin: [...ALL_PERMISSIONS],
  "Sales Executive": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.AMC_VIEW,
    PERMISSIONS.GROUPS_VIEW,
    PERMISSIONS.GROUPS_CREATE,
    PERMISSIONS.GROUPS_EDIT,
    PERMISSIONS.GROUPS_DELETE,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Service Engineer": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.AMC_VIEW,
    PERMISSIONS.AMC_UPDATE,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Project Manager": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.PROJECTS_CREATE,
    PERMISSIONS.PROJECTS_EDIT,
    PERMISSIONS.PROJECTS_DELETE,
    PERMISSIONS.PROJECTS_ASSIGN,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.DOCUMENT_DELETE,
    PERMISSIONS.EXPENSE_VIEW,
    PERMISSIONS.EXPENSE_EDIT,
    PERMISSIONS.EXPENSE_ADD,
    PERMISSIONS.EXPENSE_DELETE,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_APPROVE,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  Technician: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.DOCUMENT_UPLOAD,
    PERMISSIONS.AMC_VIEW,
    PERMISSIONS.AMC_UPDATE,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  Manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_VIEW_ALL,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.GROUPS_VIEW,
    PERMISSIONS.PIPELINES_VIEW,
    PERMISSIONS.VIEW_PERFORMANCE_REPORT,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  Accounts: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.EXPENSE_VIEW,
    PERMISSIONS.EXPENSE_EDIT,
    PERMISSIONS.EXPENSE_ADD,
    PERMISSIONS.EXPENSE_DELETE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AMC_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  Accountant: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.EXPENSE_VIEW,
    PERMISSIONS.EXPENSE_EDIT,
    PERMISSIONS.EXPENSE_ADD,
    PERMISSIONS.EXPENSE_DELETE,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.AMC_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  HR: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.HR_EMPLOYEES_MANAGE,
    PERMISSIONS.HR_ONBOARDING_MANAGE,
    PERMISSIONS.HR_LEAVE_VIEW,
    PERMISSIONS.HR_LEAVE_MANAGE,
    PERMISSIONS.HR_ATTENDANCE_VIEW,
    PERMISSIONS.HR_ATTENDANCE_MANAGE,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_VIEW,
    PERMISSIONS.HR_TIMESHEET_MANAGE,
    PERMISSIONS.ACTIVITY_VIEW,
    PERMISSIONS.VIEW_PERFORMANCE_REPORT,
    PERMISSIONS.HR_PERFORMANCE_EXPORT,
    PERMISSIONS.HR_PAYROLL_VIEW,
    PERMISSIONS.HR_PAYROLL_MANAGE,
    PERMISSIONS.HR_PAYROLL_GENERATE,
    PERMISSIONS.HR_OFFER_MANAGE,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Customer Relationship Manager": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.AMC_VIEW,
    PERMISSIONS.GROUPS_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Customer Relationship Executive": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.AMC_VIEW,
    PERMISSIONS.GROUPS_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Regional Sales Manager": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_VIEW_ALL,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.GROUPS_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Associate Director Marketing": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Graphic designer": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
  "Business Development Manager": [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_VIEW_ALL,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.QUOTATIONS_VIEW,
    PERMISSIONS.QUOTATIONS_CREATE,
    PERMISSIONS.PROJECTS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.HR_LEAVE_REQUEST,
    PERMISSIONS.HR_ATTENDANCE_SELF,
    PERMISSIONS.HR_TIMESHEET_SUBMIT,
    PERMISSIONS.HR_PAYSLIP_SELF,
  ],
};

export type PermissionSourceMode = "role" | "custom";

export function resolvePermissionSource(user: {
  permissionSource?: PermissionSourceMode;
  permissions?: string[];
}): PermissionSourceMode {
  if (user.permissionSource === "role" || user.permissionSource === "custom") {
    return user.permissionSource;
  }
  // If backend provided permissions but they're not in our known list, treat them as absent.
  // This prevents users from being locked out when permission strings don't match expected keys.
  const stored = user.permissions ?? [];
  const knownStored = stored.filter((p) => ALL_PERMISSIONS.includes(p));
  return knownStored.length > 0 ? "custom" : "role";
}

/** Align with backend: `role` = defaults for that role; `custom` = explicit list only. */
export function getEffectivePermissions(user: {
  role: string;
  permissions?: string[];
  permissionSource?: PermissionSourceMode;
}): string[] {
  if (user.role === "Admin") return [...ALL_PERMISSIONS];
  const stored = (user.permissions ?? []).filter((p) => ALL_PERMISSIONS.includes(p));
  const source = resolvePermissionSource(user);
  if (source === "role") {
    if (stored.length > 0) return [...stored];
    const fromRole = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
    return [...fromRole];
  }
  // If custom mode is indicated but no valid permission keys exist, fall back to role defaults.
  // This handles cases where backend stored human-readable labels instead of permission keys.
  if (stored.length === 0) {
    const fromRole = DEFAULT_ROLE_PERMISSIONS[user.role];
    return fromRole ? [...fromRole] : [];
  }
  return [...new Set(stored)];
}

// Check if user has permission (Admin always has access)
export const can = (permission: string, userPermissions: string[] = []): boolean => {
  if (isAdmin()) return true;
  if (!userPermissions || userPermissions.length === 0) return false;
  return userPermissions.includes(permission);
};

// Get user permissions from localStorage (Admin always gets all permissions)
export const getUserPermissions = (): string[] => {
  if (typeof window === "undefined") return [];

  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return getEffectivePermissions(user);
    }
  } catch (e) {
    console.error("Failed to parse user permissions");
  }

  return [];
};

function hasPermInList(permission: string, userPermissions: string[], role: string): boolean {
  if (String(role || "").trim() === "Admin") return true;
  return userPermissions.includes(permission);
}

/** Technician & field engineers use /dashboard (operations overview), not leads pipeline */
/** HR team managing people (not staff self-service only) */
export function isHrManagerRole(role?: string, userPermissions: string[] = []): boolean {
  const r = String(role || "").trim();
  if (r === "HR") return true;
  return (
    userPermissions.includes(PERMISSIONS.HR_VIEW) ||
    userPermissions.includes(PERMISSIONS.HR_EMPLOYEES_MANAGE) ||
    userPermissions.includes(PERMISSIONS.HR_ONBOARDING_MANAGE)
  );
}

export const HR_MANAGER_NAV_LABEL = "Human Resources";
export const EMPLOYEE_SERVICES_NAV_LABEL = "My Services";

export function getHrSidebarNavLabel(role?: string, userPermissions: string[] = []): string {
  return isHrManagerRole(role, userPermissions)
    ? HR_MANAGER_NAV_LABEL
    : EMPLOYEE_SERVICES_NAV_LABEL;
}

export function usesFieldOperationsDashboard(role?: string): boolean {
  const r = String(role || "").trim();
  return r === "Technician" || r === "Service Engineer";
}

/** Landing route after login */
export function getDashboardHomePath(role: string, userPermissions: string[] = []): string {
  const r = String(role || "").trim();
  if (r === "Admin") return "/dashboard";
  if (r === "HR") return "/dashboard/hr";
  if (usesFieldOperationsDashboard(r)) return "/dashboard";

  if (hasPermInList(PERMISSIONS.DASHBOARD_VIEW, userPermissions, r)) {
    return "/dashboard";
  }

  const hasLeads =
    hasPermInList(PERMISSIONS.LEADS_VIEW, userPermissions, r) ||
    hasPermInList(PERMISSIONS.LEADS_VIEW_ALL, userPermissions, r);
  const hasHrHub = hasPermInList(PERMISSIONS.HR_VIEW, userPermissions, r);

  if (hasHrHub && !hasLeads) return "/dashboard/hr";

  if (!hasLeads) {
    if (hasPermInList(PERMISSIONS.PROJECTS_VIEW, userPermissions, r)) {
      return "/dashboard/projects";
    }
    if (
      hasPermInList(PERMISSIONS.EXPENSE_VIEW, userPermissions, r) &&
      (r === "Accounts" || r === "Accountant")
    ) {
      return "/dashboard/expense";
    }
    if (
      hasPermInList(PERMISSIONS.USERS_VIEW, userPermissions, r) ||
      hasPermInList(PERMISSIONS.USERS_MANAGE, userPermissions, r)
    ) {
      return "/dashboard/users";
    }
    if (
      hasPermInList(PERMISSIONS.HR_LEAVE_REQUEST, userPermissions, r) ||
      hasPermInList(PERMISSIONS.HR_ATTENDANCE_SELF, userPermissions, r)
    ) {
      return "/dashboard/hr";
    }
  }

  return "/dashboard";
}

export function canViewAttendanceList(role?: string, userPermissions: string[] = []): boolean {
  if (String(role || "").trim() === "Admin") return true;
  return (
    userPermissions.includes(PERMISSIONS.HR_ATTENDANCE_VIEW) ||
    userPermissions.includes(PERMISSIONS.HR_ATTENDANCE_MANAGE)
  );
}

/** Admin may edit anyone; HR may edit others only (not own attendance). */
export function canEditAttendanceTimes(
  editorRole?: string,
  editorId?: string,
  targetUserId?: string
): boolean {
  const role = String(editorRole || "").trim();
  if (role !== "Admin" && role !== "HR") return false;
  if (role === "Admin") return true;
  if (!editorId || !targetUserId) return false;
  return editorId !== targetUserId;
}

/** Roles that clock in/out (everyone except Admin) */
export const EMPLOYEE_ATTENDANCE_ROLES = [
  "Sales Executive",
  "HR",
  "Service Engineer",
  "Project Manager",
  "Technician",
  "Manager",
  "Accounts",
  "Accountant",
] as const;

export function shouldShowEmployeeAttendanceCheckIn(
  role?: string,
  userPermissions: string[] = []
): boolean {
  return canEmployeeCheckInOut(role, userPermissions);
}

export function canEmployeeCheckInOut(role?: string, userPermissions: string[] = []): boolean {
  const r = String(role || "").trim();
  if (!r || r === "Admin") return false;
  if (userPermissions.includes(PERMISSIONS.HR_ATTENDANCE_SELF)) return true;
  return (EMPLOYEE_ATTENDANCE_ROLES as readonly string[]).includes(r);
}

export function usesSalesLeadsDashboard(role: string, userPermissions: string[] = []): boolean {
  if (usesFieldOperationsDashboard(role)) return false;
  return getDashboardHomePath(role, userPermissions) === "/dashboard";
}

// Check if user is Admin (trimmed; backend enum is "Admin")
export const isAdmin = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return String(user?.role || "").trim() === "Admin";
    }
  } catch (e) {
    console.error("Failed to parse user role");
  }
  return false;
};

// Permission groups for UI
export const PERMISSION_GROUPS = [
  {
    label: "Dashboard",
    permissions: [
      { key: PERMISSIONS.DASHBOARD_VIEW, label: "Dashboard View" },
    ],
  },
  {
    label: "Leads",
    permissions: [
      { key: PERMISSIONS.LEADS_VIEW, label: "Leads View" },
      { key: PERMISSIONS.LEADS_VIEW_ALL, label: "View All Leads" },
      { key: PERMISSIONS.LEADS_CREATE, label: "Leads Create" },
      { key: PERMISSIONS.LEADS_EDIT, label: "Leads Edit" },
      { key: PERMISSIONS.LEADS_DELETE, label: "Leads Delete" },
    ],
  },
  {
    label: "Quotations",
    permissions: [
      { key: PERMISSIONS.QUOTATIONS_VIEW, label: "Quotations View" },
      { key: PERMISSIONS.QUOTATIONS_CREATE, label: "Quotations Create" },
      { key: PERMISSIONS.QUOTATIONS_APPROVE, label: "Quotations Approve" },
    ],
  },
  {
    label: "Projects",
    permissions: [
      { key: PERMISSIONS.PROJECTS_VIEW, label: "Projects View" },
      { key: PERMISSIONS.PROJECTS_CREATE, label: "Projects Create" },
      { key: PERMISSIONS.PROJECTS_EDIT, label: "Projects Edit" },
      { key: PERMISSIONS.PROJECTS_DELETE, label: "Projects Delete" },
      { key: PERMISSIONS.PROJECTS_ASSIGN, label: "Projects Assign" },
      { key: PERMISSIONS.DOCUMENT_UPLOAD, label: "Document Upload" },
      { key: PERMISSIONS.DOCUMENT_DELETE, label: "Document Delete" },
      { key: PERMISSIONS.EXPENSE_VIEW, label: "Expense View" },
      { key: PERMISSIONS.EXPENSE_EDIT, label: "Expense Edit" },
      { key: PERMISSIONS.EXPENSE_ADD, label: "Add Expense" },
      { key: PERMISSIONS.EXPENSE_DELETE, label: "Expense Delete" },
    ],
  },
  {
    label: "AMC & Services",
    permissions: [
      { key: PERMISSIONS.AMC_VIEW, label: "AMC View" },
      { key: PERMISSIONS.AMC_UPDATE, label: "AMC Update" },
    ],
  },
  {
    label: "Users",
    permissions: [
      { key: PERMISSIONS.USERS_VIEW, label: "Users View" },
      { key: PERMISSIONS.USERS_MANAGE, label: "Users Manage" },
    ],
  },
  {
    label: "Reports",
    permissions: [
      { key: PERMISSIONS.REPORTS_VIEW, label: "Reports View" },
    ],
  },
  {
    label: "Settings",
    permissions: [
      { key: PERMISSIONS.SETTINGS_MANAGE, label: "Settings Manage" },
    ],
  },
  {
    label: "Blogs",
    permissions: [
      { key: PERMISSIONS.BLOGS_VIEW, label: "Blogs View" },
      { key: PERMISSIONS.BLOGS_CREATE, label: "Blogs Create" },
      { key: PERMISSIONS.BLOGS_EDIT, label: "Blogs Edit" },
      { key: PERMISSIONS.BLOGS_DELETE, label: "Blogs Delete" },
    ],
  },
  {
    label: "Testimonials",
    permissions: [
      { key: PERMISSIONS.TESTIMONIALS_VIEW, label: "Testimonials View" },
    ],
  },
  {
    label: "Form Submissions",
    permissions: [
      { key: PERMISSIONS.FORM_SUBMISSIONS_VIEW, label: "Form Submissions View" },
      { key: PERMISSIONS.FORM_SUBMISSIONS_DELETE, label: "Form Submissions Delete" },
    ],
  },
  {
    label: "Demo Requests",
    permissions: [
      { key: PERMISSIONS.DEMO_REQUESTS_VIEW, label: "Demo Requests View" },
      { key: PERMISSIONS.DEMO_REQUESTS_DELETE, label: "Demo Requests Delete" },
    ],
  },
  {
    label: "Groups",
    permissions: [
      { key: PERMISSIONS.GROUPS_VIEW, label: "Groups View" },
      { key: PERMISSIONS.GROUPS_CREATE, label: "Groups Create" },
      { key: PERMISSIONS.GROUPS_EDIT, label: "Groups Edit" },
      { key: PERMISSIONS.GROUPS_DELETE, label: "Groups Delete" },
    ],
  },
  {
    label: "Leads Pipelines",
    permissions: [
      { key: PERMISSIONS.PIPELINES_VIEW, label: "Pipelines View" },
      { key: PERMISSIONS.PIPELINES_CREATE, label: "Pipelines Create" },
      { key: PERMISSIONS.PIPELINES_EDIT, label: "Pipelines Edit" },
      { key: PERMISSIONS.PIPELINES_DELETE, label: "Pipelines Delete" },
    ],
  },
  {
    label: "Performance",
    permissions: [
      { key: PERMISSIONS.VIEW_PERFORMANCE_REPORT, label: "View Performance Report" },
      { key: PERMISSIONS.HR_PERFORMANCE_EXPORT, label: "Export Performance (CSV/PDF)" },
    ],
  },
  {
    label: "Activity",
    permissions: [{ key: PERMISSIONS.ACTIVITY_VIEW, label: "Activity View" }],
  },
  {
    label: "HR",
    permissions: [
      { key: PERMISSIONS.HR_VIEW, label: "HR Hub Access" },
      { key: PERMISSIONS.HR_EMPLOYEES_MANAGE, label: "Manage Employee Profiles" },
      { key: PERMISSIONS.HR_ONBOARDING_MANAGE, label: "Manage Onboarding" },
      { key: PERMISSIONS.HR_LEAVE_VIEW, label: "View All Leave" },
      { key: PERMISSIONS.HR_LEAVE_MANAGE, label: "Approve/Reject Leave" },
      { key: PERMISSIONS.HR_LEAVE_REQUEST, label: "Request Own Leave" },
      { key: PERMISSIONS.HR_ATTENDANCE_VIEW, label: "View Attendance" },
      { key: PERMISSIONS.HR_ATTENDANCE_MANAGE, label: "Manage Attendance" },
      { key: PERMISSIONS.HR_ATTENDANCE_SELF, label: "Self Check-in/out" },
      { key: PERMISSIONS.HR_TIMESHEET_VIEW, label: "View All Timesheets" },
      { key: PERMISSIONS.HR_TIMESHEET_MANAGE, label: "Manage Timesheets" },
      { key: PERMISSIONS.HR_TIMESHEET_SUBMIT, label: "Submit Own Timesheets" },
      { key: PERMISSIONS.HR_PAYROLL_VIEW, label: "View Payroll" },
      { key: PERMISSIONS.HR_PAYROLL_MANAGE, label: "Manage Salaries" },
      { key: PERMISSIONS.HR_PAYROLL_GENERATE, label: "Generate Payroll" },
      { key: PERMISSIONS.HR_OFFER_MANAGE, label: "Offer Letters" },
      { key: PERMISSIONS.HR_PAYSLIP_SELF, label: "View Own Payslip" },
    ],
  },
];

