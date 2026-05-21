"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { amcAPI, projectsAPI, Project } from "@/lib/api";
import { can, getUserPermissions, PERMISSIONS } from "@/lib/permissions";
import AttendanceTodayCard from "@/components/hr/AttendanceTodayCard";
import {
  IoFolder,
  IoCalendar,
  IoConstruct,
  IoCheckmarkCircle,
  IoTime,
  IoChevronForward,
} from "react-icons/io5";

type AmcRow = { id: string; status?: string; assignedTechnician?: string };

export default function FieldOperationsDashboard() {
  const perms = getUserPermissions();
  const canProjects = can(PERMISSIONS.PROJECTS_VIEW, perms);
  const canAmc = can(PERMISSIONS.AMC_VIEW, perms);
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [amcList, setAmcList] = useState<AmcRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.name || "");
        setRole(u.role || "");
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const tasks: Promise<void>[] = [];
        if (canProjects) {
          tasks.push(
            projectsAPI.getAll().then((list) => setProjects(Array.isArray(list) ? list : []))
          );
        } else {
          setProjects([]);
        }
        if (canAmc) {
          tasks.push(
            amcAPI.getAll().then((list) => setAmcList(Array.isArray(list) ? list : []))
          );
        } else {
          setAmcList([]);
        }
        await Promise.all(tasks);
      } catch (e) {
        console.error("Field dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [canProjects, canAmc]);

  const myProjects = useMemo(() => {
    if (!userName) return projects;
    const mine = projects.filter(
      (p) =>
        String(p.assignedEngineer || "").trim().toLowerCase() === userName.trim().toLowerCase() ||
        String(p.installationTechnician || "").trim().toLowerCase() === userName.trim().toLowerCase() ||
        String(p.siteEngineerName || "").trim().toLowerCase() === userName.trim().toLowerCase()
    );
    return mine.length > 0 ? mine : projects;
  }, [projects, userName]);

  const activeProjects = myProjects.filter(
    (p) => p.currentStage !== "Testing & Final Handover" && p.status !== "Completed"
  );
  const completedProjects = myProjects.filter(
    (p) => p.currentStage === "Testing & Final Handover" || p.status === "Completed"
  );
  const activeAmc = amcList.filter((a) => String(a.status || "") === "Active");

  const recentProjects = [...myProjects]
    .sort((a, b) => String(b.startDate || "").localeCompare(String(a.startDate || "")))
    .slice(0, 6);

  const roleLabel = role === "Service Engineer" ? "Service Engineer" : role === "Technician" ? "Technician" : role;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Welcome back{userName ? `, ${userName}` : ""}! Here&apos;s your {roleLabel.toLowerCase()} work at a glance.
        </p>
      </div>

      <AttendanceTodayCard />

      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
          Loading your dashboard…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {canProjects && (
              <>
                <StatTile
                  title="My projects"
                  value={myProjects.length}
                  hint="Assigned to you"
                  icon={<IoFolder className="w-6 h-6" />}
                  color="green"
                />
                <StatTile
                  title="In progress"
                  value={activeProjects.length}
                  hint="Active installations"
                  icon={<IoConstruct className="w-6 h-6" />}
                  color="blue"
                />
                <StatTile
                  title="Completed"
                  value={completedProjects.length}
                  hint="Handover done"
                  icon={<IoCheckmarkCircle className="w-6 h-6" />}
                  color="purple"
                />
              </>
            )}
            {canAmc && (
              <StatTile
                title="AMC services"
                value={activeAmc.length}
                hint="Active contracts"
                icon={<IoCalendar className="w-6 h-6" />}
                color="orange"
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {canProjects && (
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-800">Recent projects</h2>
                  <Link
                    href="/dashboard/projects"
                    className="text-sm text-green-700 font-medium hover:underline inline-flex items-center gap-1"
                  >
                    View all
                    <IoChevronForward className="w-4 h-4" />
                  </Link>
                </div>
                {recentProjects.length === 0 ? (
                  <p className="px-4 py-8 text-sm text-gray-500 text-center">No projects yet.</p>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {recentProjects.map((p) => (
                      <li key={p.id} className="px-4 py-3 hover:bg-gray-50/80">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <div>
                            <p className="font-medium text-gray-900">{p.projectName}</p>
                            <p className="text-xs text-gray-500">{p.customerName} · {p.location}</p>
                          </div>
                          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit">
                            {p.currentStage}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quick access</p>
              {canProjects && (
                <QuickLink
                  href="/dashboard/projects"
                  title="Projects & Installation"
                  desc="Track stages and upload documents"
                  icon={<IoFolder className="w-6 h-6" />}
                />
              )}
              {canAmc && (
                <QuickLink
                  href="/dashboard/amc"
                  title="AMC & Services"
                  desc="Service visits and maintenance"
                  icon={<IoCalendar className="w-6 h-6" />}
                />
              )}
              {can(PERMISSIONS.HR_LEAVE_REQUEST, perms) && (
                <QuickLink
                  href="/dashboard/hr/leave"
                  title="My leave"
                  desc="Apply for leave (My Services)"
                  icon={<IoTime className="w-6 h-6" />}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({
  title,
  value,
  hint,
  icon,
  color,
}: {
  title: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  color: "green" | "blue" | "purple" | "orange";
}) {
  const colors = {
    green: "bg-green-50 text-green-600 border-green-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
      <div className={`p-3 rounded-lg border ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-sm transition-all"
    >
      <div className="p-2 rounded-lg bg-green-600 text-white">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <IoChevronForward className="w-5 h-5 text-gray-300 shrink-0 mt-1" />
    </Link>
  );
}
