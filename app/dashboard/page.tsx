"use client";

import { useEffect, useMemo, useState } from "react";
import StatCard from "@/components/StatCard";
import Modal from "@/components/Modal";
import { leadsAPI, projectsAPI, amcAPI, settingsAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  getEffectivePermissions,
  getDashboardHomePath,
  usesFieldOperationsDashboard,
} from "@/lib/permissions";
import FieldOperationsDashboard from "@/components/dashboard/FieldOperationsDashboard";
import {
  IoPeople,
  IoCalendar,
  IoCheckmarkCircle,
  IoTime,
  IoBarChart,
  IoCloseCircle,
  IoCall,
  IoBan,
  IoRemoveCircle,
} from "react-icons/io5";
import SalesPipelineOverview from "@/components/dashboard/SalesPipelineOverview";
import AttendanceTodayCard from "@/components/hr/AttendanceTodayCard";


export default function DashboardPage() {
  const router = useRouter();
  const [pageReady, setPageReady] = useState(false);
  const [isFieldDashboard, setIsFieldDashboard] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : {};
      const role = user.role || "";
      const perms = getEffectivePermissions(user);

      if (usesFieldOperationsDashboard(role)) {
        setIsFieldDashboard(true);
        setPageReady(true);
        return;
      }

      const home = getDashboardHomePath(role, perms);
      if (home !== "/dashboard") {
        router.replace(home);
        return;
      }
      setIsFieldDashboard(false);
      setPageReady(true);
    } catch {
      setPageReady(true);
    }
  }, [router]);

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedExecutive, setSelectedExecutive] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableExecutives, setAvailableExecutives] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadContacted: 0,
    meetingScheduled: 0,
    meetingsCompleted: 0,
    quotationSent: 0,
    managerDeliberation: 0,
    lostLeads: 0,
    askToCallBack: 0,
    dnp: 0,
    notRequired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [allLeads, setAllLeads] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [allAMC, setAllAMC] = useState<any[]>([]);
  const [selectedStatCard, setSelectedStatCard] = useState<string | null>(null);

  const computeStats = (leads: any[]) => ({
    totalLeads: leads.length,
    leadContacted: leads.filter((l) => l.stage === "Lead Contacted").length,
    meetingScheduled: leads.filter((l) => l.stage === "Meeting Scheduled").length,
    meetingsCompleted: leads.filter((l) => l.stage === "Meeting Completed").length,
    quotationSent: leads.filter((l) => l.stage === "Quotation Sent").length,
    managerDeliberation: leads.filter((l) => l.stage === "Manager Deliberation").length,
    lostLeads: leads.filter((l) => l.stage === "Order Lost").length,
    askToCallBack: leads.filter((l) => l.contactStatus === "Ask To call back").length,
    dnp: leads.filter((l) => l.contactStatus === "DNP").length,
    notRequired: leads.filter((l) => l.contactStatus === "Not required").length,
  });

  // Load available states from backend (derived from leads collection)
  useEffect(() => {
    if (!pageReady || isFieldDashboard) return;
    const loadStates = async () => {
      try {
        const res = await settingsAPI.getStates();
        const list = Array.isArray((res as any)?.states) ? (res as any).states : [];
        setAvailableStates(list);
      } catch {
        setAvailableStates([]);
      }
    };
    loadStates();
  }, [pageReady, isFieldDashboard]);

  // Helper function to parse meeting date/time from notes
  const parseMeetingDateTime = (lead: any): string | null => {
    if (!lead.notes || lead.stage !== "Meeting Scheduled") return null;

    try {
      // Look for meeting scheduled section
      const meetingMatch = lead.notes.match(/--- MEETING SCHEDULED ---([\s\S]*?)(?=---|\[|$)/i);
      if (meetingMatch) {
        const meetingSection = meetingMatch[1];

        // Look for Next Follow-up Date
        const followUpMatch = meetingSection.match(/Next Follow-up Date:\s*(.+)/i);
        if (followUpMatch) {
          const dateStr = followUpMatch[1].trim();
          if (dateStr && dateStr !== "N/A" && dateStr !== "") {
            // Try to parse and format the date
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              return date.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            }
            return dateStr; // Return as-is if parsing fails
          }
        }
      }

      // Also check in NEXT ACTION section
      const nextActionMatch = lead.notes.match(/NEXT ACTION:[\s\S]*?Next Follow-up Date:\s*(.+)/i);
      if (nextActionMatch) {
        const dateStr = nextActionMatch[1].trim();
        if (dateStr && dateStr !== "N/A" && dateStr !== "") {
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            return date.toLocaleString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
          return dateStr;
        }
      }
    } catch (error) {
      console.error("Error parsing meeting date:", error);
    }

    return null;
  };

  /** Same filters as the leads API; merges every page (max 200/req) so the dashboard is not capped at page 1. */
  const fetchAllLeadsForState = async (state: string) => {
    const limit = 200;
    const out: any[] = [];
    let total = Infinity;
    let page = 1;
    // Fetch until backend reports no more records.
    while (out.length < total) {
      const raw = await leadsAPI.getAll({ state: state || undefined, page, limit });
      const chunk = Array.isArray((raw as any)?.leads) ? (raw as any).leads : [];
      total =
        typeof (raw as any)?.total === "number"
          ? (raw as any).total
          : Math.max(chunk.length, out.length + chunk.length);
      out.push(...chunk);
      if (chunk.length < limit || chunk.length === 0) break;
      page += 1;
    }
    return out;
  };

  const loadData = async (opts?: { state?: string }) => {
    try {
      setLoading(true);
      const state = opts?.state !== undefined ? opts.state : selectedState;

      const leadsData = await fetchAllLeadsForState(state);
      setRecentLeads(leadsData.slice(0, 3));
      // Store leads with parsed meeting dates
      const leadsWithMeetingDates = leadsData.map((lead: any) => ({
        ...lead,
        meetingDateTime: lead.stage === "Meeting Scheduled" ? parseMeetingDateTime(lead) : null
      }));
      setAllLeads(leadsWithMeetingDates);
      setStats(computeStats(leadsWithMeetingDates));
      const executives = Array.from(
        new Set(
          leadsWithMeetingDates
            .map((lead: any) => String(lead.assignedTo || "").trim())
            .filter((v: string) => v.length > 0)
        )
      ).sort((a, b) => a.localeCompare(b));
      setAvailableExecutives(executives);

      // Load projects and AMC for other sections
      try {
        const [projectsData, amcData] = await Promise.all([
          projectsAPI.getAll(),
          amcAPI.getAll().catch(() => []),
        ]);
        setRecentProjects(projectsData.slice(0, 3));
        setAllProjects(projectsData);
        setAllAMC(amcData || []);
      } catch (err) {
        console.error("Failed to load projects/AMC:", err);
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reload dashboard metrics when state filter changes
  useEffect(() => {
    if (!pageReady || isFieldDashboard) return;
    loadData({ state: selectedState }).catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, pageReady, isFieldDashboard]);

  const filteredLeads = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null;
    return allLeads.filter((lead: any) => {
      const assignedTo = String(lead.assignedTo || "").trim();
      if (selectedExecutive && assignedTo !== selectedExecutive) return false;

      const created = lead.createdAt ? new Date(lead.createdAt) : null;
      if (selectedMonth) {
        if (!created || Number.isNaN(created.getTime())) return false;
        const monthKey = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
        if (monthKey !== selectedMonth) return false;
      }

      if ((from || to) && (!created || Number.isNaN(created.getTime()))) return false;
      if (from && created && created < from) return false;
      if (to && created && created > to) return false;
      return true;
    });
  }, [allLeads, selectedExecutive, selectedMonth, fromDate, toDate]);

  useEffect(() => {
    setStats(computeStats(filteredLeads));
    setRecentLeads(filteredLeads.slice(0, 3));
  }, [filteredLeads]);

  const handleCardClick = (title: string) => {
    setSelectedStatCard(title);
  };

  const handleViewMore = () => {
    router.push("/dashboard/leads");
  };


  // Compute meeting scheduled trend text
  const getMeetingScheduledTrend = () => {
    const scheduledLeads = filteredLeads.filter((l: any) => l.stage === "Meeting Scheduled");
    if (scheduledLeads.length === 0) return "Meetings planned";

    const dates = scheduledLeads
      .map((l: any) => {
        const dateTime = l.meetingDateTime || parseMeetingDateTime(l);
        return dateTime;
      })
      .filter((d: string | null) => d !== null && d !== "")
      .slice(0, 2); // Show max 2 dates

    if (dates.length === 0) return "Meetings planned";
    return dates.join(" • ");
  };

  const statCards = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      icon: <IoPeople className="w-6 h-6" />,
      trend: "All leads in pipeline",
      color: "blue" as const,
      stage: "All" as const,
    },
    {
      title: "Lead Contacted",
      value: stats.leadContacted,
      icon: <IoCheckmarkCircle className="w-6 h-6" />,
      trend: "Initial contact made",
      color: "green" as const,
      stage: "Lead Contacted" as const,
    },
    {
      title: "Lost Leads",
      value: stats.lostLeads,
      icon: <IoCloseCircle className="w-6 h-6" />,
      trend: "Lost opportunities",
      color: "red" as const,
      stage: "Order Lost" as const,
    },
    {
      title: "Meeting Scheduled",
      value: stats.meetingScheduled,
      icon: <IoCalendar className="w-6 h-6" />,
      trend: getMeetingScheduledTrend(),
      color: "purple" as const,
      stage: "Meeting Scheduled" as const,
    },
    {
      title: "Meetings Completed",
      value: stats.meetingsCompleted,
      icon: <IoCheckmarkCircle className="w-6 h-6" />,
      trend: "Meetings finished",
      color: "green" as const,
      stage: "Meeting Completed" as const,
    },
    {
      title: "Quotation Sent",
      value: stats.quotationSent,
      icon: <IoTime className="w-6 h-6" />,
      trend: "Quotations delivered",
      color: "orange" as const,
      stage: "Quotation Sent" as const,
    },
    {
      title: "Manager Deliberation",
      value: stats.managerDeliberation,
      icon: <IoBarChart className="w-6 h-6" />,
      trend: "Under review",
      color: "purple" as const,
      stage: "Manager Deliberation" as const,
    },
    {
      title: "Ask To call back",
      value: stats.askToCallBack,
      icon: <IoCall className="w-6 h-6" />,
      trend: "Callback requested",
      color: "orange" as const,
      contactStatus: "Ask To call back" as const,
    },
    {
      title: "DNP",
      value: stats.dnp,
      icon: <IoBan className="w-6 h-6" />,
      trend: "Did not pick up",
      color: "red" as const,
      contactStatus: "DNP" as const,
    },
    {
      title: "Not required",
      value: stats.notRequired,
      icon: <IoRemoveCircle className="w-6 h-6" />,
      trend: "Not interested",
      color: "blue" as const,
      contactStatus: "Not required" as const,
    },
  ];

  const currentSelectedStat = selectedStatCard ? statCards.find(s => s.title === selectedStatCard) : null;
  const filteredLeadsForModal = currentSelectedStat
    ? ("contactStatus" in currentSelectedStat && currentSelectedStat.contactStatus)
      ? filteredLeads.filter((lead: any) => lead.contactStatus === currentSelectedStat.contactStatus)
      : currentSelectedStat.stage === "All"
        ? filteredLeads
        : filteredLeads.filter((lead: any) => lead.stage === currentSelectedStat.stage)
    : [];

  if (!pageReady) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (isFieldDashboard) {
    return <FieldOperationsDashboard />;
  }

  if (loading) {
    return (
      <div>
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
        </div>
        <AttendanceTodayCard />
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const salesStages = [
    {
      stage: "New Leads",
      percentage: stats.totalLeads > 0 ? 100 : 0,
      color: "#3b82f6", // blue
    },
    {
      stage: "Meetings Completed",
      percentage:
        stats.totalLeads > 0 ? Math.round((stats.meetingsCompleted / stats.totalLeads) * 100) : 0,
      color: "#8b5cf6", // violet
    },
    {
      stage: "Quotations Sent",
      percentage:
        stats.totalLeads > 0 ? Math.round((stats.quotationSent / stats.totalLeads) * 100) : 0,
      color: "#10b981", // green
    },
    {
      stage: "Orders Confirmed",
      percentage:
        allProjects.length > 0
          ? Math.round(
            (allProjects.filter((p: any) => p.currentStage === "Order Confirmed").length /
              Math.max(1, allProjects.length)) *
            100
          )
          : 0,
      color: "#f59e0b", // orange
    },
    {
      stage: "Installations",
      percentage:
        allProjects.length > 0
          ? Math.round(
            (allProjects.filter(
              (p: any) =>
                p.currentStage === "Installed" || p.currentStage === "Installation Completed"
            ).length /
              Math.max(1, allProjects.length)) *
            100
          )
          : 0,
      color: "#ef4444", // red
    },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Dashboard Overview</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>

        <AttendanceTodayCard />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* State filter */}
          {availableStates.length > 0 && (
            <div className="w-full">
              <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All States</option>
                {availableStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">Sales Executive (BDM)</label>
            <select
              value={selectedExecutive}
              onChange={(e) => setSelectedExecutive(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Executives</option>
              {availableExecutives.map((exec) => (
                <option key={exec} value={exec}>
                  {exec}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mb-6 sm:mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            onClick={() => handleCardClick(stat.title)}
            className="cursor-pointer"
          >
            <StatCard {...stat} compact />
          </div>
        ))}
      </div>



      <div className="mb-6">
        <SalesPipelineOverview data={salesStages} showDebug={false} />
      </div>

      {/* Details Modal */}
      {currentSelectedStat && (
        <Modal
          isOpen={selectedStatCard !== null}
          onClose={() => setSelectedStatCard(null)}
          title={
            "contactStatus" in currentSelectedStat && currentSelectedStat.contactStatus
              ? `${currentSelectedStat.title} Leads`
              : currentSelectedStat.stage === "All"
                ? "All Leads"
                : `${currentSelectedStat.title} Leads`
          }
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Total: <span className="font-semibold text-gray-900">{filteredLeadsForModal.length}</span> leads
              </p>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {filteredLeadsForModal.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {"contactStatus" in currentSelectedStat && currentSelectedStat.contactStatus
                      ? `No leads with status "${currentSelectedStat.title}"`
                      : currentSelectedStat.stage === "All"
                        ? "No leads found"
                        : `No leads in ${currentSelectedStat.title} stage`}
                  </p>
                </div>
              ) : (
                filteredLeadsForModal.map((lead: any) => {
                  const meetingDateTime = lead.stage === "Meeting Scheduled"
                    ? (lead.meetingDateTime || parseMeetingDateTime(lead))
                    : null;

                  return (
                    <div key={lead.id || lead._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">{lead.name}</p>
                          <p className="text-xs text-gray-600 truncate mt-1">{lead.company || "N/A"}</p>
                          {meetingDateTime && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-purple-600 font-medium">
                              <IoCalendar className="w-3 h-3" />
                              <span>{meetingDateTime}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            {lead.email && (
                              <span className="truncate">{lead.email}</span>
                            )}
                            {lead.phone && (
                              <span>{lead.phone}</span>
                            )}
                          </div>
                          {lead.value && (
                            <p className="text-xs font-semibold text-green-600 mt-1">
                              Value: ₹{(lead.value / 100000).toFixed(1)}L
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full whitespace-nowrap">
                            {lead.stage}
                          </span>
                          {lead.contactStatus && (
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full whitespace-nowrap">
                              {lead.contactStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={handleViewMore}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                View More
              </button>
            </div>
          </div>
        </Modal>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Recent Leads</h2>
          <div className="space-y-3 sm:space-y-4">
            {recentLeads.length > 0 ? (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{lead.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{lead.company}</p>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="font-semibold text-sm sm:text-base text-gray-900">₹{(lead.value / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-gray-500">{lead.stage}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No leads found</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Project Status</h2>
          <div className="space-y-3 sm:space-y-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0">
                    <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{project.projectName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{project.currentStage}</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No projects found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}






