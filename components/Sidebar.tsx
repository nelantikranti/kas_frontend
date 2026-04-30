"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoHome,
  IoPeople,
  IoPeopleCircle,
  IoDocumentText,
  IoFolder,
  IoCalendar,
  IoPerson,
  IoSettings,
  IoVideocam,
  IoMail,
  IoTime,
  IoChevronBack,
  IoChevronForward,
  IoNewspaper,
  IoChatbubbles,
  IoWallet,
  IoList,
} from "react-icons/io5";
import { PERMISSIONS, can, getEffectivePermissions } from "@/lib/permissions";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  /** User needs this permission (unless requiredAnyOf is set) */
  requiredPermission?: string;
  /** If set, user needs at least one of these permissions */
  requiredAnyOf?: string[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
}

// All navigation items with required permissions
const allNavItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: <IoHome className="w-5 h-5" />, requiredPermission: PERMISSIONS.DASHBOARD_VIEW },
  { name: "Leads", href: "/dashboard/leads", icon: <IoPeople className="w-5 h-5" />, requiredPermission: PERMISSIONS.LEADS_VIEW },
  { name: "Groups", href: "/dashboard/groups", icon: <IoPeopleCircle className="w-5 h-5" />, requiredPermission: PERMISSIONS.GROUPS_VIEW },
  { name: "Leads Pipelines", href: "/dashboard/pipelines", icon: <IoList className="w-5 h-5" />, requiredPermission: PERMISSIONS.PIPELINES_VIEW },
  { name: "Projects", href: "/dashboard/projects", icon: <IoFolder className="w-5 h-5" />, requiredPermission: PERMISSIONS.PROJECTS_VIEW },
  { name: "Expense", href: "/dashboard/expense", icon: <IoWallet className="w-5 h-5" />, requiredPermission: PERMISSIONS.EXPENSE_VIEW },
  { name: "Quotations", href: "/dashboard/quotations", icon: <IoDocumentText className="w-5 h-5" />, requiredPermission: PERMISSIONS.QUOTATIONS_VIEW },
  { name: "Reminders", href: "/dashboard/reminders", icon: <IoTime className="w-5 h-5" />, requiredPermission: PERMISSIONS.LEADS_VIEW },
  { name: "AMC & Services", href: "/dashboard/amc", icon: <IoCalendar className="w-5 h-5" />, requiredPermission: PERMISSIONS.AMC_VIEW },
  { name: "Form Submissions", href: "/dashboard/submissions", icon: <IoMail className="w-5 h-5" />, requiredPermission: PERMISSIONS.FORM_SUBMISSIONS_VIEW },
  { name: "Demo Requests", href: "/dashboard/demo", icon: <IoVideocam className="w-5 h-5" />, requiredPermission: PERMISSIONS.DEMO_REQUESTS_VIEW },
  { name: "Blogs & Reviews", href: "/dashboard/blogs", icon: <IoNewspaper className="w-5 h-5" />, requiredPermission: PERMISSIONS.BLOGS_VIEW },
  { name: "Testimonials", href: "/dashboard/testimonials", icon: <IoChatbubbles className="w-5 h-5" />, requiredPermission: PERMISSIONS.TESTIMONIALS_VIEW },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: <IoPerson className="w-5 h-5" />,
    requiredAnyOf: [PERMISSIONS.USERS_VIEW, PERMISSIONS.USERS_MANAGE],
  },
  { name: "Settings", href: "/dashboard/settings", icon: <IoSettings className="w-5 h-5" />, requiredPermission: PERMISSIONS.SETTINGS_MANAGE },
  { name: "Activity", href: "/dashboard/activity", icon: <IoDocumentText className="w-5 h-5" />, requiredPermission: PERMISSIONS.ACTIVITY_VIEW },
];

// Helper function to get filtered nav items based on user permissions
const getNavItems = (userRole: string | null, userPermissions: string[] = []): NavItem[] => {
  
  // Filter by permissions — Admin has access to all nav items
  if (userRole === "Admin") {
    return allNavItems;
  }
  return allNavItems.filter(item => {
    if (item.requiredAnyOf?.length) {
      return item.requiredAnyOf.some((p) => can(p, userPermissions));
    }
    if (!item.requiredPermission) return true;
    // Groups: show if user has GROUPS_VIEW or LEADS_VIEW (groups are lead groups)
    if (item.requiredPermission === PERMISSIONS.GROUPS_VIEW) {
      return can(PERMISSIONS.GROUPS_VIEW, userPermissions) || can(PERMISSIONS.LEADS_VIEW, userPermissions);
    }
    return can(item.requiredPermission, userPermissions);
  });
};

function SidebarImpl({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const lastUserStrRef = useRef<string | null>(null);

  // Get logged-in user from localStorage and listen for changes
  useEffect(() => {
    const loadUserData = async () => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem("user");
        lastUserStrRef.current = userStr;
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setUserPermissions(getEffectivePermissions(userData));
            
            // Refresh user data from backend to get latest role
            if (userData.id) {
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
              const token = localStorage.getItem("authToken");
              try {
                const userResponse = await fetch(`${apiUrl}/users/${userData.id}`, {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (userResponse.ok) {
                  const updatedUser = await userResponse.json();
                  const updatedUserData = {
                    ...userData,
                    role: updatedUser.role || userData.role,
                    permissions: updatedUser.permissions || userData.permissions || [],
                  };
                  setUser(updatedUserData);
                  setUserPermissions(getEffectivePermissions(updatedUserData));
                  localStorage.setItem("user", JSON.stringify(updatedUserData));
                }
              } catch (error) {
                console.error("Failed to refresh user data:", error);
              }
            }
          } catch (e) {
            console.error("Failed to parse user data");
          }
        }
      }
    };

    // Load initially
    loadUserData();

    // Listen for storage changes (when user data is updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        loadUserData();
      }
    };

    // Listen for custom event when permissions are updated (same tab)
    const handlePermissionsUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.permissions) {
        // Update permissions immediately from event
        setUserPermissions(customEvent.detail.permissions);
        // Also reload full user data
        loadUserData();
      } else {
        loadUserData();
      }
    };

    // Also listen for direct localStorage changes (same tab)
    const handleLocalStorageChange = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userPermissionsUpdated', handlePermissionsUpdate);
    
    // Poll for localStorage changes (for same-tab updates)
    const interval = setInterval(() => {
      const currentUserStr = localStorage.getItem("user");
      // Fast path: avoid JSON parsing and comparisons when unchanged.
      if (currentUserStr === lastUserStrRef.current) return;
      lastUserStrRef.current = currentUserStr;
      loadUserData();
    }, 1000); // Check every second

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userPermissionsUpdated', handlePermissionsUpdate);
      clearInterval(interval);
    };
  }, [user?.id]);

  const navItems = useMemo(
    () => getNavItems(user?.role || null, userPermissions),
    [user?.role, userPermissions]
  );

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay - Full screen backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[45] lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - Single component that handles both open and closed states */}
      <div
        className={`fixed lg:sticky top-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen flex flex-col shadow-2xl transition-all duration-300 ease-in-out z-[50] ${
          isOpen 
            ? "w-[280px] sm:w-[300px] translate-x-0" 
            : "w-0 lg:w-16 -translate-x-full lg:translate-x-0 overflow-hidden lg:overflow-visible"
        }`}
      >
        <div className={`p-4 sm:p-6 border-b border-gray-700/50 bg-gradient-to-r from-green-600/20 to-transparent ${!isOpen ? "lg:p-2" : ""}`}>
          <div className={`flex items-center ${isOpen ? "justify-between gap-2" : "lg:justify-center"}`}>
            {isOpen && (
              <div className="block flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent truncate">
                KAS CRM
              </h1>
              <p className="text-xs text-gray-400 mt-1 truncate">Elevator Management</p>
            </div>
            )}
            <button
              onClick={onToggle}
              className={`p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0 ${!isOpen ? "lg:w-full" : ""}`}
              aria-label="Toggle sidebar"
            >
              {isOpen ? (
                <IoChevronBack className="w-5 h-5 text-gray-300" />
              ) : (
                <IoChevronForward className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>
        <nav className={`flex-1 ${isOpen ? "p-3 sm:p-4" : "lg:p-2"} space-y-1 overflow-y-auto overflow-x-hidden`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${isOpen ? "gap-2 sm:gap-3 px-3 sm:px-4" : "lg:justify-center lg:px-2"} py-2.5 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
                  isActive
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/50"
                    : "text-gray-300 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white"
                }`}
                title={!isOpen ? item.name : undefined}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isOpen && (
                  <span className="font-medium transition-all truncate block flex-1">
                  {item.name}
                </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className={`${isOpen ? "p-3 sm:p-4" : "lg:p-2"} border-t border-gray-700/50 bg-gradient-to-r from-green-600/10 to-transparent`}>
          {isOpen ? (
          <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                {user ? getInitials(user.name) : "U"}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-white font-medium truncate">{user?.name || "User"}</p>
                <p className="text-xs truncate">{user?.email || ""}</p>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center text-white font-semibold shadow-lg">
                {user ? getInitials(user.name) : "U"}
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(SidebarImpl);


