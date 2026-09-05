"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { leadsAPI, projectsAPI, healthAPI, usersAPI, groupsAPI, settingsAPI, type Lead } from "@/lib/api";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import ContactReportModal from "@/components/ContactReportModal";
import { toast } from "@/components/Toast";
import { IoAdd, IoSearch, IoDocumentText, IoCalendar, IoTime, IoClose, IoCamera, IoCloudUpload, IoPerson, IoPersonRemove, IoCall, IoCheckmarkCircle, IoCheckmarkDone, IoMail, IoShieldCheckmark, IoLockClosed, IoCloseCircle, IoChevronDown, IoEye, IoDownload, IoRefresh } from "react-icons/io5";
import AnimatedDeleteButton from "@/components/AnimatedDeleteButton";
import AnimatedEditButton from "@/components/AnimatedEditButton";
import { useRouter } from "next/navigation";
import { isAdmin, getUserPermissions, can, canViewAllLeads, canManageLeadAssignments, PERMISSIONS } from "@/lib/permissions";
import { LEAD_FUNNEL_STAGES } from "@/lib/leadStages";
import { LEAD_CONTACT_STATUSES } from "@/lib/leadContactStatuses";

const stages: Lead["stage"][] = [...LEAD_FUNNEL_STAGES];

const LEADS_FILTERS_STORAGE_KEY = "kas_leads_list_filters";

type StoredLeadsFilters = {
  groupId?: string;
  source?: string;
  state?: string;
  bdmUserId?: string;
  stage?: string;
  contactStatus?: string;
  search?: string;
  page?: number;
  perPage?: number;
};

function readStoredLeadsFilters(): StoredLeadsFilters {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(LEADS_FILTERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredLeadsFilters) : {};
  } catch {
    return {};
  }
}

function writeStoredLeadsFilters(filters: StoredLeadsFilters) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(LEADS_FILTERS_STORAGE_KEY, JSON.stringify(filters));
  } catch {
    /* ignore quota / private mode */
  }
}

function buildContactReportNotes(lead: Lead, data: any): string {
  return `
BASIC LEAD DETAILS:
- Lead Name: ${lead.name}
- Mobile Number: ${lead.phone}
- Email ID: ${lead.email}
- Project Location: ${lead.company || "N/A"}
- Lead Source: ${lead.source || "N/A"}

CONTACT CONFIRMATION:
- Contact Successful: ${data.contactSuccessful || "N/A"}

CONTACT DETAILS:
- Contact Mode: ${data.contactMode || "N/A"}
- Date & Time: ${data.contactDateTime || "N/A"}
- Spoken To: ${data.spokenTo || "N/A"}

PROPERTY & REQUIREMENT:
- Property Type: ${data.propertyType || "N/A"}
- Total Floors: ${data.totalFloors || "N/A"}
- Primary Usage: ${data.primaryUsage || "N/A"}

SITE READINESS - PIT:
- Pit Available: ${data.pitAvailable || "N/A"}
- Pit Depth: ${data.pitDepth || "N/A"}

SITE READINESS - SHAFT:
- Shaft Available: ${data.shaftAvailable || "N/A"}
- Shaft Type: ${data.shaftType || "N/A"}
- Shaft Size: ${data.shaftSize || "N/A"}

SITE READINESS - MACHINE ROOM:
- Machine Room Available: ${data.machineRoom || "N/A"}

ELEVATOR PREFERENCE:
- Preferred Type: ${data.elevatorType || "N/A"}
- Brand Expectation: ${data.brandExpectation || "N/A"}

CLIENT INTENT & COMMERCIAL:
- Interest Level: ${data.interestLevel || "N/A"}
- Budget Discussion: ${data.budgetDiscussion || "N/A"}
- Decision Timeline: ${data.decisionTimeline || "N/A"}

NEXT ACTION:
- Next Step: ${data.nextStep || "N/A"}
- Expected Timeline: ${data.expectedMeetingTimeline || "N/A"}
- Next Follow-up: ${data.nextFollowUpDate || "N/A"}

SALES OWNER:
- Sales Executive: ${data.salesExecutiveName || "N/A"}
- Remarks: ${data.remarks || "N/A"}
`.trim();
}

function mergeContactReportSections(
  parsed: Record<string, Record<string, string>>,
  contactReport?: Lead["contactReport"]
) {
  if (!contactReport) return parsed;

  const cr = contactReport;
  const setIfEmpty = (section: string, key: string, value?: string | boolean) => {
    if (!value && value !== false) return;
    const strValue = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
    if (!strValue.trim()) return;
    if (!parsed[section]) parsed[section] = {};
    if (!parsed[section][key]) parsed[section][key] = strValue;
  };

  setIfEmpty("contactConfirmation", "Contact Successful", cr.contactConfirmation?.successful);
  setIfEmpty("contactDetails", "Contact Mode", cr.contactDetails?.mode);
  setIfEmpty("contactDetails", "Date & Time", cr.contactDetails?.dateTime
    ? new Date(cr.contactDetails.dateTime).toLocaleString()
    : undefined);
  setIfEmpty("contactDetails", "Spoken To", cr.contactDetails?.spokenTo);
  setIfEmpty("propertyRequirement", "Property Type", cr.propertyDetails?.type);
  setIfEmpty("propertyRequirement", "Total Floors", cr.propertyDetails?.floors);
  setIfEmpty("propertyRequirement", "Primary Usage", cr.propertyDetails?.usage);
  setIfEmpty("sitePit", "Pit Available", cr.siteReadiness?.pitAvailable);
  setIfEmpty("sitePit", "Pit Depth", cr.siteReadiness?.pitDepth);
  setIfEmpty("siteShaft", "Shaft Available", cr.siteReadiness?.shaftAvailable);
  setIfEmpty("siteShaft", "Shaft Type", cr.siteReadiness?.shaftType);
  setIfEmpty("siteShaft", "Shaft Size", cr.siteReadiness?.shaftSize);
  setIfEmpty("siteMachineRoom", "Machine Room Available", cr.siteReadiness?.machineRoom);
  setIfEmpty("elevatorPreference", "Preferred Type", cr.elevatorPreference?.type);
  setIfEmpty("elevatorPreference", "Brand Expectation", cr.elevatorPreference?.brand);
  setIfEmpty("clientIntent", "Interest Level", cr.clientIntent?.interestLevel);
  setIfEmpty("clientIntent", "Budget Discussion", cr.clientIntent?.budget);
  setIfEmpty("clientIntent", "Decision Timeline", cr.clientIntent?.timeline);
  setIfEmpty("nextAction", "Next Step", cr.nextAction?.type);
  setIfEmpty("nextAction", "Expected Timeline", cr.nextAction?.meetingTime);
  setIfEmpty("nextAction", "Next Follow-up", cr.nextAction?.followUpDate);
  setIfEmpty("salesOwner", "Sales Executive", cr.salesOwner?.name);
  setIfEmpty("salesOwner", "Remarks", cr.salesOwner?.remarks);

  return parsed;
}

const LEAD_GROUP_OPTIONS = ["Tamil Nadu", "Andhra Pradesh"] as const;

// All Indian States and Union Territories
const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Stage icons mapping
const getStageIcon = (stage: Lead["stage"]) => {
  const iconClass = "w-5 h-5";
  switch (stage) {
    case "New Lead":
      return <IoPerson className={iconClass} />;
    case "Lead Contacted":
      return <IoCall className={iconClass} />;
    case "Not Contacted":
      return <IoTime className={iconClass} />;
    case "Not Interested":
      return <IoPersonRemove className={iconClass} />;
    case "Meeting Scheduled":
      return <IoCalendar className={iconClass} />;
    case "Meeting Completed":
      return <IoCheckmarkCircle className={iconClass} />;
    case "Quotation Sent":
      return <IoDocumentText className={iconClass} />;
    case "Manager Deliberation":
      return <IoShieldCheckmark className={iconClass} />;
    case "Order Closed":
      return <IoLockClosed className={iconClass} />;
    case "Order Lost":
      return <IoCloseCircle className={iconClass} />;
    default:
      return <IoPerson className={iconClass} />;
  }
};

// Stage colors mapping
const getStageColor = (stage: Lead["stage"]) => {
  switch (stage) {
    case "New Lead":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "Lead Contacted":
      return "bg-cyan-100 text-cyan-700 border-cyan-300";
    case "Not Contacted":
      return "bg-amber-100 text-amber-700 border-amber-300";
    case "Not Interested":
      return "bg-slate-100 text-slate-700 border-slate-300";
    case "Meeting Scheduled":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "Meeting Completed":
      return "bg-indigo-100 text-indigo-700 border-indigo-300";
    case "Quotation Sent":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "Manager Deliberation":
      return "bg-orange-100 text-orange-700 border-orange-300";
    case "Order Closed":
      return "bg-green-100 text-green-700 border-green-300";
    case "Order Lost":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export default function LeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userPermissions = getUserPermissions();
  const canViewAllLeadsFilter = canViewAllLeads(userPermissions);
  const canManageAssignments = canManageLeadAssignments(userPermissions);
  const canViewLeadActions = can(PERMISSIONS.LEADS_VIEW, userPermissions);
  const canEditLeadActions = can(PERMISSIONS.LEADS_EDIT, userPermissions);
  const canDeleteLeadActions = can(PERMISSIONS.LEADS_DELETE, userPermissions);
  const [leadList, setLeadList] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);
  const [isManagerDeliberationModalOpen, setIsManagerDeliberationModalOpen] = useState(false);
  const [isOrderLostModalOpen, setIsOrderLostModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [leadForContact, setLeadForContact] = useState<Lead | null>(null);
  const [leadForMeeting, setLeadForMeeting] = useState<Lead | null>(null);
  const [leadForQuotation, setLeadForQuotation] = useState<Lead | null>(null);
  const [leadForDeliberation, setLeadForDeliberation] = useState<Lead | null>(null);
  const [leadForOrderLost, setLeadForOrderLost] = useState<Lead | null>(null);
  const [orderLostReason, setOrderLostReason] = useState<string>("");
  const [orderLostReasonOther, setOrderLostReasonOther] = useState<string>("");
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => readStoredLeadsFilters().search || "");
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [syncingFacebook, setSyncingFacebook] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fbSyncParamsRef = useRef<{ assignedTo: string; assignedToUserId?: string; groupId: string | null }>({
    assignedTo: "Sales Executive 1",
    groupId: null,
  });
  // Auto-disable the background Facebook sync after repeated failures so a broken/expired
  // token doesn't keep firing (and logging errors) every few minutes.
  const fbSyncFailuresRef = useRef(0);
  const [fbSyncDisabled, setFbSyncDisabled] = useState(false);
  const isInitialMount = useRef(true);
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    role: string;
    permissions: string[];
  } | null>(null);
  const [stageChangeError, setStageChangeError] = useState<{ [key: string]: string }>({});
  const [groups, setGroups] = useState<{ id: string; groupName: string }[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(() => readStoredLeadsFilters().groupId || "");
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>(() => readStoredLeadsFilters().source || "");
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>(() => readStoredLeadsFilters().state || "");
  const [selectedBdmUserId, setSelectedBdmUserId] = useState<string>(() => readStoredLeadsFilters().bdmUserId || "");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>(() => readStoredLeadsFilters().stage || "");
  const [selectedContactStatusFilter, setSelectedContactStatusFilter] = useState<string>(() => readStoredLeadsFilters().contactStatus || "");
  const [currentPage, setCurrentPage] = useState(() => {
    const p = readStoredLeadsFilters().page;
    return typeof p === "number" && p > 0 ? p : 1;
  });
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [leadsPerPage, setLeadsPerPage] = useState(() => {
    const n = readStoredLeadsFilters().perPage;
    return typeof n === "number" && n > 0 ? n : 20;
  });
  const [facebookConfigured, setFacebookConfigured] = useState(false);
  const [isBulkReassignModalOpen, setIsBulkReassignModalOpen] = useState(false);
  const [bulkReassignFromUserId, setBulkReassignFromUserId] = useState("");
  const [bulkReassignToUserId, setBulkReassignToUserId] = useState("");
  const [bulkReassigning, setBulkReassigning] = useState(false);
  const [meetingData, setMeetingData] = useState({
    // 1. Actual Meeting Details
    meetingDuration: "",
    attendeesPresent: [] as string[],

    // 2. Site & Technical Confirmation
    pitAvailable: "",
    pitDepthConfirmed: "",
    shaftStatus: "",
    shaftType: "",
    shaftSize: "",
    machineRoom: "",

    // 3. Solution & Product Finalization
    proposedElevatorType: "",
    floorsFinalized: [] as string[],
    capacityDiscussed: "",
    specialRequirements: [] as string[],

    // 4. Commercial Discussion Summary
    budgetAlignment: "",
    approxBudgetIndicated: "",

    // 5. Client Response & Quality
    clientInterestLevel: "",
    decisionMakerIdentified: "",
    expectedDecisionTimeline: "",

    // 6. Next Action
    nextStep: "",
    expectedQuotationDate: "",
    nextFollowUpDate: "",

    // 7. Meeting Notes
    meetingNotes: "",

    // 8. Meeting Scheduled Details (New)
    nextStepIdentified: "",
    meetingDateTime: "",
    expectedTimeline: "",
    salesExecutive: "",
  });
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [documentPreviews, setDocumentPreviews] = useState<{ [key: number]: string }>({});
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [viewerItem, setViewerItem] = useState<{ type: 'image' | 'pdf'; src: string; name: string } | null>(null);
  const [quotationData, setQuotationData] = useState({
    quotationPrepared: "",
    quotationNumber: "",
    quotationDate: "",
    quotationValidity: "",
    totalQuotationValue: "",
    paymentTerms: "",
    paymentTermsCustom: "",
    elevatorTypeQuoted: "",
    numberOfFloors: [] as string[],
    ratedCapacity: "",
    speed: "",
    scopeOfSupply: [] as string[],
    manufacturingLeadTime: "",
    installationDuration: "",
    quotationSentVia: [] as string[],
    clientAcknowledgement: "",
    clientInitialFeedback: "",
    pricingStatus: "",
    discountApplied: "",
    discountAmount: "",
    managerApprovalReference: "",
    nextStep: "",
    nextFollowUpDate: "",
    salesExecutiveName: "",
    remarks: "",
  });
  const [deliberationData, setDeliberationData] = useState({
    deliberationReasons: [] as string[],
    quotationNumber: "",
    quotationDate: "",
    quotationValue: "",
    quotationValidity: "",
    clientName: "",
    projectLocation: "",
    elevatorType: "",
    floors: [] as string[],
    capacity: "",
    pitShaftStatus: "",
    standardPrice: "",
    quotedPrice: "",
    discountRequested: "",
    discountAmount: "",
    discountPercent: "",
    expectedGrossMargin: "",
    clientFeedback: "",
    competitorPresence: "",
    competitorBrand: "",
    salesJustification: "",
    approvalStatus: "",
    approvedFinalValue: "",
    specialConditions: "",
    nextActionIfApproved: "",
    nextActionIfRejected: "",
    nextFollowUpDate: "",
  });
  const [newLead, setNewLead] = useState({
    // Basic Lead Details
    name: "",
    phone: "",
    email: "",
    state: "",
    source: "Website",


    remarks: "",

    // Legacy fields (for compatibility)
    company: "",
    value: "",
    assignedTo: "",
    notes: "",
    groupId: "",
  });
  const [isCreatingLead, setIsCreatingLead] = useState(false);

  useEffect(() => {
    // Load current user from localStorage
    const loadUser = () => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const userData = JSON.parse(userStr);
            setCurrentUser({
              id: userData.id || "",
              name: userData.name,
              role: userData.role,
              permissions: userData.permissions || [],
            });
          } catch (e) {
            console.error("Failed to parse user data");
          }
        }
      }
    };

    loadUser();
    // URL params (e.g. from Groups/dashboard) override stored filters
    const initialGroupId = searchParams.get("groupId") || selectedGroupId || "";
    const initialStage = searchParams.get("stage") || selectedStageFilter || "";
    if (searchParams.get("groupId")) {
      setSelectedGroupId(initialGroupId);
    }
    if (searchParams.get("stage")) {
      setSelectedStageFilter(initialStage);
    }
    loadLeads({
      groupId: initialGroupId || undefined,
      stage: initialStage || undefined,
      state: selectedState || undefined,
      source: selectedSourceFilter || undefined,
      contactStatus: selectedContactStatusFilter || undefined,
      assignedToUserId: selectedBdmUserId || undefined,
      search: searchTerm || undefined,
      page: currentPage,
    });

    const loadGroups = async () => {
      try {
        const data = await groupsAPI.getAll();
        const list = Array.isArray(data) ? data : [];
        setGroups(list.map((g: any) => ({ id: g.id, groupName: g.groupName })));
      } catch (error) {
        console.error("Failed to load groups:", error);
        setGroups([]);
      }
    };

    loadGroups();

    const loadUsers = async () => {
      try {
        const fetchedUsers = await usersAPI.getAll();
        setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      } catch (error) {
        console.error("Failed to load users:", error);
      }
    };

    loadUsers();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUser();
        loadLeads({ page: 1 }); // Reload leads when user changes
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Reload list after returning from edit lead page (keep filters; strip refresh only)
  useEffect(() => {
    if (searchParams.get("refresh") === "1") {
      loadLeads({ page: currentPage });
      router.replace("/dashboard/leads", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Persist filters so they survive edit/detail navigation
  useEffect(() => {
    writeStoredLeadsFilters({
      groupId: selectedGroupId,
      source: selectedSourceFilter,
      state: selectedState,
      bdmUserId: selectedBdmUserId,
      stage: selectedStageFilter,
      contactStatus: selectedContactStatusFilter,
      search: searchTerm,
      page: currentPage,
      perPage: leadsPerPage,
    });
  }, [
    selectedGroupId,
    selectedSourceFilter,
    selectedState,
    selectedBdmUserId,
    selectedStageFilter,
    selectedContactStatusFilter,
    searchTerm,
    currentPage,
    leadsPerPage,
  ]);

  useEffect(() => {
    if (!isAssignModalOpen && !isModalOpen) return;
    if (users.length > 0) return;

    const loadUsers = async () => {
      try {
        const fetchedUsers = await usersAPI.getAll();
        setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to load users");
      }
    };

    loadUsers();
  }, [isAssignModalOpen, isModalOpen, users.length]);

  const handleSelectLead = (leadId: string) => {
    setSelectedLeadIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedLeadIds.size === filteredLeads.length) {
      setSelectedLeadIds(new Set());
    } else {
      setSelectedLeadIds(new Set(filteredLeads.map(lead => lead.id || (lead as any)._id)));
    }
  };

  const handleAssignLeads = async (userId: string, userName: string) => {
    if (!canManageAssignments) {
      toast.error("You do not have permission to reassign leads.");
      return;
    }

    if (selectedLeadIds.size === 0) return;

    setAssigning(true);
    try {
      const updates = Array.from(selectedLeadIds).map(async (leadId) => {
        const lead = leadList.find(l => (l.id === leadId) || ((l as any)._id === leadId));
        if (lead) {
          await leadsAPI.update(leadId, { assignedTo: userName, assignedToUserId: userId });
        }
      });

      await Promise.all(updates);
      await loadLeads({ page: currentPage });
      setSelectedLeadIds(new Set());
      setIsAssignModalOpen(false);
      setUserSearchTerm("");
      toast.success(`Successfully assigned ${selectedLeadIds.size} lead(s) to ${userName}`);
    } catch (error) {
      console.error("Failed to assign leads:", error);
      toast.error("Failed to assign leads. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassignLeads = async () => {
    if (!canManageAssignments) {
      toast.error("You do not have permission to reassign leads.");
      return;
    }

    if (selectedLeadIds.size === 0) return;

    setAssigning(true);
    try {
      const updates = Array.from(selectedLeadIds).map(async (leadId) => {
        const lead = leadList.find(l => (l.id === leadId) || ((l as any)._id === leadId));
        if (lead) {
          await leadsAPI.update(leadId, { assignedTo: "Unassigned" });
        }
      });

      await Promise.all(updates);
      await loadLeads({ page: currentPage });
      setSelectedLeadIds(new Set());
      setIsAssignModalOpen(false);
      setUserSearchTerm("");
      toast.success(`Successfully unassigned ${selectedLeadIds.size} lead(s).`);
    } catch (error) {
      console.error("Failed to unassign leads:", error);
      toast.error("Failed to unassign leads. Please try again.");
    } finally {
      setAssigning(false);
    }
  };

  const handleBulkReassign = async () => {
    if (!canManageAssignments) {
      toast.error("You do not have permission to reassign leads.");
      return;
    }
    if (!bulkReassignFromUserId || !bulkReassignToUserId) {
      toast.error("Please select both source and target users.");
      return;
    }
    if (bulkReassignFromUserId === bulkReassignToUserId) {
      toast.error("Source and target user must be different.");
      return;
    }

    setBulkReassigning(true);
    try {
      const result = await leadsAPI.bulkReassign({
        fromUserId: bulkReassignFromUserId,
        toUserId: bulkReassignToUserId,
      });
      await loadLeads({ page: currentPage });
      setIsBulkReassignModalOpen(false);
      setBulkReassignFromUserId("");
      setBulkReassignToUserId("");
      toast.success(result.message || `Reassigned ${result.modifiedCount} lead(s).`);
    } catch (error: any) {
      console.error("Bulk reassign failed:", error);
      toast.error(error?.message || "Failed to bulk reassign leads.");
    } finally {
      setBulkReassigning(false);
    }
  };


  // Validation helper functions
  const handlePhoneChange = (value: string, setState: (val: any) => void, stateObj: any, field: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Allow only up to 10 digits
    if (cleaned.length <= 10) {
      setState({ ...stateObj, [field]: cleaned });
    }
  };

  const handleTextChange = (value: string, setState: (val: any) => void, stateObj: any, field: string) => {
    // Allow only letters, spaces, and common punctuation for names
    const cleaned = value.replace(/[^a-zA-Z\s\.\-'']/g, '');
    setState({ ...stateObj, [field]: cleaned });
  };

  const validatePhone = (phone: string): boolean => {
    // Must be exactly 10 digits
    return /^\d{10}$/.test(phone);
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Lock body scroll when delete modal is open
  useEffect(() => {
    if (isDeleteModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDeleteModalOpen]);

  // Check backend connection on mount
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const isConnected = await healthAPI.check();
        setBackendConnected(isConnected);
      } catch (error) {
        setBackendConnected(false);
      }
    };
    checkBackendConnection();
  }, []);

  // Load whether Facebook Lead Ads is usable. "configured" (from settings) only means a
  // token + page ID are stored — not that they work. We verify with a real Graph API check
  // so we only enable/auto-run sync when it will actually succeed.
  const refreshFacebookConfigured = async () => {
    try {
      const res = await settingsAPI.getFacebookLeadAds();
      if (!res?.configured) {
        setFacebookConfigured(false);
        return;
      }
      try {
        const v = await leadsAPI.validateFacebook();
        setFacebookConfigured(!!v?.valid);
        if (!v?.valid && v?.reason) {
          console.warn("[Leads] Facebook credentials present but not usable:", v.reason);
        }
      } catch {
        setFacebookConfigured(false);
      }
    } catch {
      setFacebookConfigured(false);
    }
  };

  useEffect(() => {
    refreshFacebookConfigured();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await settingsAPI.getStates();
        const list = Array.isArray(res?.states) ? res.states : [];
        setAvailableStates(list.length > 0 ? list : indianStates);
      } catch {
        setAvailableStates(indianStates);
      }
    };
    loadStates();
  }, []);

  const loadLeads = async (opts?: { groupId?: string; state?: string; stage?: string; contactStatus?: string; assignedToUserId?: string; page?: number; search?: string; source?: string }) => {
    try {
      setLoading(true);
      const filterGroupId = opts?.groupId !== undefined ? opts.groupId : selectedGroupId;
      const page = opts?.page !== undefined ? opts.page : currentPage;
      const search = opts?.search !== undefined ? opts.search : searchTerm;
      const source = opts?.source !== undefined ? opts.source : selectedSourceFilter;
      const state = opts?.state !== undefined ? opts.state : selectedState;
      const stage = opts?.stage !== undefined ? opts.stage : selectedStageFilter;
      const contactStatus = opts?.contactStatus !== undefined ? opts.contactStatus : selectedContactStatusFilter;
      const assignedToUserId = opts?.assignedToUserId !== undefined ? opts.assignedToUserId : selectedBdmUserId;

      const response = await leadsAPI.getAll({
        groupId: filterGroupId || null,
        state: state || undefined,
        stage: stage || undefined,
        contactStatus: contactStatus || undefined,
        assignedToUserId: assignedToUserId || undefined,
        page,
        limit: leadsPerPage,
        search: search || undefined,
        source: source || undefined,
      });

      const { leads: rawLeads, total, totalPages: tp } = response as any;
      const leadsArray = Array.isArray(rawLeads) ? rawLeads : [];

      const normalizedLeads = leadsArray.map((lead: any) => {
        const leadId = lead._id?.toString() || lead.id || "";
        if (!leadId) {
          console.warn("Lead missing ID:", lead);
        }
        return {
          ...lead,
          id: leadId,
          _id: lead._id,
        };
      });
      setLeadList(normalizedLeads);
      setTotalLeads(typeof total === "number" ? total : 0);
      setTotalPages(typeof tp === "number" ? tp : 1);
      setBackendConnected(true);
      setAccessDenied(false);
      setHasLoadedOnce(true);
    } catch (error: any) {
      console.error("Failed to load leads:", error);
      const status = error?.status;
      const errorMessage = error?.message || "";

      if (status === 401 || status === 403) {
        setAccessDenied(true);
        toast.error("You don't have access.");
        setLeadList([]);
        setTotalLeads(0);
        setTotalPages(1);
        setHasLoadedOnce(true);
        // Do not set backendConnected = false so we don't show connection banner
      } else {
        setAccessDenied(false);
        setBackendConnected(false);
        setHasLoadedOnce(true);
        if (errorMessage.includes("Unable to connect") || errorMessage.includes("Failed to fetch") || errorMessage.includes("ERR_CONNECTION_REFUSED")) {
          toast.error("Unable to connect. Please try again later.");
        } else {
          toast.error(errorMessage || "Failed to load leads.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Reload leads when page changes (skip initial mount — handled by the main useEffect)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    loadLeads({ page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Debounced reload when search term changes (reset to page 1)
  const searchInitialMount = useRef(true);
  useEffect(() => {
    if (searchInitialMount.current) {
      searchInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadLeads({ page: 1, search: searchTerm });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // Reload when source filter changes (reset to page 1)
  const sourceInitialMount = useRef(true);
  useEffect(() => {
    if (sourceInitialMount.current) {
      sourceInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    loadLeads({ page: 1, source: selectedSourceFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSourceFilter]);

  // Reload when state filter changes (reset to page 1)
  const stateInitialMount = useRef(true);
  useEffect(() => {
    if (stateInitialMount.current) {
      stateInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    loadLeads({ page: 1, state: selectedState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState]);

  // Reload when BDM filter changes (reset to page 1)
  const bdmInitialMount = useRef(true);
  useEffect(() => {
    if (bdmInitialMount.current) {
      bdmInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    loadLeads({ page: 1, assignedToUserId: selectedBdmUserId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBdmUserId]);

  // Reload when stage filter changes (reset to page 1)
  const stageInitialMount = useRef(true);
  useEffect(() => {
    if (stageInitialMount.current) {
      stageInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    loadLeads({ page: 1, stage: selectedStageFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStageFilter]);

  // Reload when contact status filter changes (reset to page 1)
  const contactStatusInitialMount = useRef(true);
  useEffect(() => {
    if (contactStatusInitialMount.current) {
      contactStatusInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    loadLeads({ page: 1, contactStatus: selectedContactStatusFilter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContactStatusFilter]);

  // Reload when page size changes (reset to page 1)
  const pageSizeInitialMount = useRef(true);
  useEffect(() => {
    if (pageSizeInitialMount.current) {
      pageSizeInitialMount.current = false;
      return;
    }
    setCurrentPage(1);
    loadLeads({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadsPerPage]);

  // Define stage progression rules - Progressive unlock system
  const getAvailableStages = (currentStage: Lead["stage"]): Lead["stage"][] => {
    const stageIndex = stages.indexOf(currentStage);

    // Progressive unlock: only show current stage and next available stage(s)
    if (currentStage === "New Lead") {
      return ["New Lead", "Lead Contacted", "Not Contacted", "Not Interested"];
    } else if (currentStage === "Not Contacted") {
      return ["New Lead", "Not Contacted", "Lead Contacted", "Not Interested"];
    } else if (currentStage === "Not Interested") {
      return ["New Lead", "Not Interested"];
    } else if (currentStage === "Lead Contacted") {
      return ["Lead Contacted", "Meeting Scheduled"];
    } else if (currentStage === "Meeting Scheduled") {
      return ["Meeting Scheduled", "Meeting Completed"];
    } else if (currentStage === "Meeting Completed") {
      return ["Meeting Completed", "Quotation Sent"];
    } else if (currentStage === "Quotation Sent") {
      return ["Quotation Sent", "Manager Deliberation"];
    } else if (currentStage === "Manager Deliberation") {
      return ["Manager Deliberation", "Order Closed", "Order Lost"];
    } else if (currentStage === "Order Closed" || currentStage === "Order Lost") {
      // Final stages - can only stay at current stage
      return [currentStage];
    }

    return [currentStage];
  };

  const handleContactReportSubmit = async (data: any) => {
    if (!leadForContact) return;

    try {
      // If contact was not successful, keep stage as New Lead but save update
      const newStage: Lead["stage"] = data.contactSuccessful === "No" ? "New Lead" : "Lead Contacted";

      const contactReport = {
          contactConfirmation: {
            successful: data.contactSuccessful === "Yes"
          },
          contactDetails: {
            mode: data.contactMode,
            dateTime: data.contactDateTime,
            spokenTo: data.spokenTo
          },
          propertyDetails: {
            type: data.propertyType,
            floors: data.totalFloors,
            usage: data.primaryUsage
          },
          siteReadiness: {
            pitAvailable: data.pitAvailable,
            pitDepth: data.pitDepth,
            shaftAvailable: data.shaftAvailable,
            shaftType: data.shaftType,
            shaftSize: data.shaftSize,
            machineRoom: data.machineRoom
          },
          elevatorPreference: {
            type: data.elevatorType,
            brand: data.brandExpectation
          },
          clientIntent: {
            interestLevel: data.interestLevel,
            budget: data.budgetDiscussion,
            timeline: data.decisionTimeline
          },
          nextAction: {
            type: data.nextStep,
            meetingTime: data.expectedMeetingTimeline,
            followUpDate: data.nextFollowUpDate
          },
          salesOwner: {
            name: data.salesExecutiveName,
            remarks: data.remarks
          }
        };

      const structuredNotes = buildContactReportNotes(leadForContact, data);
      const updatedNotes = leadForContact.notes
        ? `${leadForContact.notes}\n\n${structuredNotes}`
        : structuredNotes;

      const updateData: Partial<Lead> & { stage: Lead["stage"] } = {
        stage: newStage,
        contactReport,
        notes: updatedNotes,
        // Also update legacy fields for compatibility/display if needed
        lastContact: new Date().toISOString()
      };

      const validLeadId = leadForContact.id;
      await leadsAPI.update(validLeadId, updateData);

      // Update local state
      setLeadList(leadList.map(lead => {
        const currentId = lead.id || (lead as any)._id;
        return currentId === validLeadId ? { ...lead, ...updateData, id: validLeadId } as Lead : lead;
      }));

      toast.success(newStage === "New Lead" ? "Contact attempt recorded, stage remains New Lead" : "Lead updated to Lead Contacted!");
      setIsContactModalOpen(false);
      setLeadForContact(null);
    } catch (error) {
      console.error("Failed to submit contact report:", error);
      toast.error("Failed to submit contact report");
    }
  };

  const isStageAllowed = (leadStage: Lead["stage"], targetStage: Lead["stage"]): boolean => {
    const availableStages = getAvailableStages(leadStage);
    return availableStages.includes(targetStage);
  };

  const handleStageChange = async (leadId: string, newStage: Lead["stage"]) => {
    if (!leadId || leadId === "undefined") {
      console.error("Invalid lead ID:", leadId);
      toast.error("Invalid lead ID. Please refresh the page.");
      return;
    }

    const lead = leadList.find(l => (l.id === leadId) || (l as any)._id === leadId);
    if (!lead) {
      console.error("Lead not found with ID:", leadId);
      toast.error("Lead not found. Please refresh the page.");
      return;
    }

    // Ensure we have a valid ID to use
    const validLeadId = lead.id || (lead as any)._id;
    if (!validLeadId) {
      console.error("Lead has no valid ID:", lead);
      toast.error("Lead has no valid ID. Please refresh the page.");
      return;
    }

    // If changing to "Lead Contacted" from "New Lead", open contact report form
    if (newStage === "Lead Contacted") {
      setLeadForContact(lead);
      setIsContactModalOpen(true);
      return;
    }

    // If changing to "Lead Contacted" from "New Lead", open meeting verification form

    // If changing to "Meeting Scheduled" from "Lead Contacted", open meeting form
    if (lead.stage === "Lead Contacted" && newStage === "Meeting Scheduled") {
      setLeadForMeeting(lead);
      setIsMeetingModalOpen(true);
      return;
    }

    // If changing to "Meeting Completed" from "Meeting Scheduled", open meeting verification form
    if (lead.stage === "Meeting Scheduled" && newStage === "Meeting Completed") {
      setLeadForMeeting(lead);
      setIsMeetingModalOpen(true);
      return;
    }

    // If changing to "Quotation Sent", open quotation confirmation form
    if (newStage === "Quotation Sent") {
      setLeadForQuotation(lead);
      setIsQuotationModalOpen(true);
      return;
    }

    // If changing to "Manager Deliberation", open deliberation form
    if (newStage === "Manager Deliberation") {
      setLeadForDeliberation(lead);
      setIsManagerDeliberationModalOpen(true);
      return;
    }

    // Validate stage change
    if (!isStageAllowed(lead.stage, newStage)) {
      const errorMsg = lead.stage === "New Lead"
        ? "Please select 'Lead Contacted', 'Not Contacted', or 'Not Interested' to proceed"
        : `Invalid stage progression. Current stage: ${lead.stage}. You can only move to the next stage or go back one step.`;

      setStageChangeError({ [leadId]: errorMsg });
      toast.error(errorMsg);

      // Clear error after 5 seconds
      setTimeout(() => {
        setStageChangeError(prev => {
          const updated = { ...prev };
          delete updated[leadId];
          return updated;
        });
      }, 5000);
      return;
    }

    // Clear any previous error
    setStageChangeError(prev => {
      const updated = { ...prev };
      delete updated[validLeadId];
      return updated;
    });

    // If changing to "Order Lost", ask for reason before saving.
    if (newStage === "Order Lost") {
      setLeadForOrderLost(lead);
      setOrderLostReason("");
      setOrderLostReasonOther("");
      setIsOrderLostModalOpen(true);
      return;
    }

    try {
      await leadsAPI.update(validLeadId, { stage: newStage });
      setLeadList(leadList.map(lead => {
        const currentId = lead.id || (lead as any)._id;
        return currentId === validLeadId ? { ...lead, id: validLeadId, stage: newStage } : lead;
      }));

      // If stage is changed to "Order Closed", create a project
      if (newStage === "Order Closed") {
        try {
          // Check if project already exists for this lead
          const existingProjects = await projectsAPI.getAll();
          const projectExists = existingProjects.some((p: any) => p.quotationId === validLeadId);

          if (projectExists) {
            toast.success(`Lead stage updated to ${newStage}. Project already exists for this lead.`);
            return;
          }

          // Parse lead data from notes to extract project information
          const notes = lead.notes || '';
          const parseSection = (sectionName: string) => {
            const regex = new RegExp(`${sectionName}:([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i');
            const match = notes.match(regex);
            if (!match) return null;

            const lines = match[1].trim().split('\n').filter(line => line.trim());
            const data: { [key: string]: string } = {};
            lines.forEach(line => {
              const match = line.match(/^-\s*(.+?):\s*(.+)$/);
              if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                data[key] = value === 'N/A' ? '' : value;
              }
            });
            return Object.keys(data).length > 0 ? data : null;
          };

          const basicDetails = parseSection('BASIC LEAD DETAILS') || {};
          const propertyRequirement = parseSection('PROPERTY & REQUIREMENT') || {};
          const elevatorPreference = parseSection('ELEVATOR PREFERENCE') || {};

          // Try to extract quotation data from notes
          const quotationMatch = notes.match(/Elevator Type Quoted:\s*(.+)/i);
          const elevatorTypeFromQuotation = quotationMatch ? quotationMatch[1].trim() : null;

          // Extract project data - use lead data directly, fallback to parsed notes
          const projectName = `${lead.name} - ${basicDetails['Project Location'] || lead.company || 'Project'}`;
          const customerName = lead.name;
          const location = basicDetails['Project Location'] || lead.company || 'N/A';
          const elevatorType = elevatorTypeFromQuotation || elevatorPreference['Preferred Type'] || propertyRequirement['Property Type'] || 'Standard';

          // Create project with proper date formatting
          const today = new Date();
          const futureDate = new Date(today);
          futureDate.setDate(futureDate.getDate() + 90); // 90 days from now

          // Ensure dates are valid and formatted correctly
          const startDateStr = today.toISOString().split('T')[0];
          const expectedCompletionStr = futureDate.toISOString().split('T')[0];

          // Create project - starts from First Technical Visit stage
          // Note: progress will be calculated automatically by backend pre-save hook
          const projectData = {
            quotationId: validLeadId || `LEAD-${validLeadId}`, // Using lead ID as quotation ID reference
            customerName: customerName || lead.name || "Unknown Customer",
            projectName: projectName || `${lead.name} - Project`,
            location: location || lead.company || "N/A",
            elevatorType: elevatorType || "Standard",
            currentStage: "First Technical Visit" as const, // Project starts from First Technical Visit
            startDate: startDateStr,
            expectedCompletion: expectedCompletionStr,
            assignedEngineer: lead.assignedTo || 'TBD',
            status: "On Track" as const,
            // progress will be auto-calculated by backend based on currentStage
          };

          console.log("Creating project with data:", projectData);

          // Ensure all numeric fields are properly formatted
          const sanitizedProjectData = {
            ...projectData,
            // Ensure no undefined or invalid values
            quotationId: String(projectData.quotationId || validLeadId || ''),
            customerName: String(projectData.customerName || 'Unknown Customer'),
            projectName: String(projectData.projectName || `${lead.name} - Project`),
            location: String(projectData.location || 'N/A'),
            elevatorType: String(projectData.elevatorType || 'Standard'),
            assignedEngineer: String(projectData.assignedEngineer || 'TBD'),
          };

          await projectsAPI.create(sanitizedProjectData);
          toast.success(`Lead stage updated to ${newStage} and project created successfully!`);
        } catch (projectError: any) {
          console.error("Failed to create project:", projectError);
          const errorMessage = projectError?.response?.data?.error || projectError?.response?.data?.details || projectError?.message || "Unknown error";
          console.error("Project creation error details:", errorMessage);
          toast.error(`Lead stage updated to ${newStage}, but failed to create project: ${errorMessage}. Please create it manually.`);
        }
      } else {
        toast.success(`Lead stage updated to ${newStage}`);
      }
    } catch (error) {
      console.error("Failed to update lead stage:", error);
      toast.error("Failed to update lead stage. Please try again.");
    }
  };

  const handleContactStatusChange = async (leadId: string, contactStatus: string) => {
    if (!canEditLeadActions) {
      toast.error("You don't have permission to edit leads.");
      return;
    }

    const validLeadId = leadId?.toString().trim();
    if (!validLeadId) {
      toast.error("Lead ID is missing. Please refresh the page.");
      return;
    }

    try {
      await leadsAPI.update(validLeadId, { contactStatus });
      setLeadList((prev) =>
        prev.map((lead) => {
          const currentId = lead.id || (lead as any)._id?.toString?.() || "";
          return currentId === validLeadId ? { ...lead, contactStatus } : lead;
        })
      );
      toast.success(contactStatus ? "Status updated" : "Status cleared");
    } catch (error) {
      console.error("Failed to update lead status:", error);
      toast.error("Failed to update status. Please try again.");
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setSelfieImage(imageData);
        stopCamera();
        toast.success("Selfie captured successfully!");
      }
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newPreviews: { [key: number]: string } = {};

      files.forEach((file, fileIndex) => {
        const currentIndex = uploadedDocuments.length + fileIndex;
        // Check if file is an image
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result;
            if (result) {
              setDocumentPreviews(prev => ({
                ...prev,
                [currentIndex]: result as string
              }));
            }
          };
          reader.readAsDataURL(file);
        }
      });

      setUploadedDocuments(prev => [...prev, ...files]);
      toast.success(`${files.length} document(s) added`);
    }
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
    setDocumentPreviews(prev => {
      const newPreviews: { [key: number]: string } = {};
      Object.keys(prev).forEach(key => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newPreviews[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newPreviews[keyNum - 1] = prev[keyNum];
        }
      });
      return newPreviews;
    });
  };

  const handleMeetingSubmit = async () => {
    if (!leadForMeeting) return;

    // Determine the new stage based on current stage
    const isMovingToMeetingScheduled = leadForMeeting.stage === "New Lead" || leadForMeeting.stage === "Lead Contacted";
    const isMovingToMeetingCompleted = leadForMeeting.stage === "Meeting Scheduled";

    // Validation
    if (isMovingToMeetingScheduled) {
      if (!meetingData.nextStepIdentified) {
        toast.error("Please select Next Step Identified.");
        return;
      }
      if (!meetingData.meetingDateTime) {
        toast.error("Please select Meeting Date & Time.");
        return;
      }
      if (!meetingData.salesExecutive) {
        toast.error("Please enter Sales Executive Name.");
        return;
      }
    } else {
      // Validation for Meeting Completion (Existing logic)
      if (!meetingData.meetingDuration) {
        toast.error("Please select Meeting Duration.");
        return;
      }

      if (meetingData.attendeesPresent.length === 0) {
        toast.error("Please select at least one Attendee Present.");
        return;
      }

      if (!meetingData.nextStep) {
        toast.error("Please select Next Step.");
        return;
      }

      if (!meetingData.nextFollowUpDate) {
        toast.error("Please select Next Follow-up Date.");
        return;
      }
    }

    try {
      // Convert documents to base64
      const documentDataPromises = uploadedDocuments.map((file) => {
        return new Promise<{ name: string; type: string; data: string }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              type: file.type,
              data: e.target?.result as string
            });
          };
          reader.onerror = () => resolve({ name: file.name, type: file.type, data: '' });
          reader.readAsDataURL(file);
        });
      });

      const documentData = await Promise.all(documentDataPromises);

      // Create attachments data
      const attachmentsData = {
        selfie: selfieImage || null,
        documents: documentData.map(doc => ({
          name: doc.name,
          type: doc.type,
          data: doc.data
        }))
      };

      const attachmentsJson = JSON.stringify(attachmentsData);

      let newStage: Lead["stage"];
      let notesPrefix = "";
      let meetingNotesContent = "";

      if (isMovingToMeetingScheduled) {
        newStage = "Meeting Scheduled" as Lead["stage"];
        notesPrefix = "--- MEETING SCHEDULED ---";

        meetingNotesContent = `
MEETING SCHEDULED - DETAILS:

1. NEXT STEP IDENTIFIED:
- Action: ${meetingData.nextStepIdentified || "N/A"}

2. DATE & TIME:
- Scheduled For: ${meetingData.meetingDateTime ? new Date(meetingData.meetingDateTime).toLocaleString() : "N/A"}

3. TIMELINE & FOLLOW-UP:
- Expected Timeline: ${meetingData.expectedTimeline || "N/A"}
- Next Follow-up: ${meetingData.nextFollowUpDate || "N/A"}

4. SALES OWNER:
- Executive: ${meetingData.salesExecutive || "N/A"}
- Remarks: ${meetingData.meetingNotes || "N/A"}
        `.trim();

      } else if (isMovingToMeetingCompleted) {
        newStage = "Meeting Completed" as Lead["stage"];
        notesPrefix = "--- MEETING COMPLETED ---";

        meetingNotesContent = `
MEETING COMPLETED - DETAILS:

1. ACTUAL MEETING DETAILS:
- Meeting Duration: ${meetingData.meetingDuration}
- Attendees Present: ${meetingData.attendeesPresent.join(", ") || "N/A"}

2. SITE & TECHNICAL CONFIRMATION:
- Pit Available: ${meetingData.pitAvailable || "N/A"}
- Pit Depth Confirmed: ${meetingData.pitDepthConfirmed || "N/A"}
- Shaft Status: ${meetingData.shaftStatus || "N/A"}
- Shaft Type: ${meetingData.shaftType || "N/A"}
- Shaft Size: ${meetingData.shaftSize || "N/A"}
- Machine Room: ${meetingData.machineRoom || "N/A"}

3. SOLUTION & PRODUCT FINALIZATION:
- Proposed Elevator Type: ${meetingData.proposedElevatorType || "N/A"}
- Floors Finalized: ${meetingData.floorsFinalized.join(", ") || "N/A"}
- Capacity Discussed: ${meetingData.capacityDiscussed || "N/A"}
- Special Requirements: ${meetingData.specialRequirements.join(", ") || "N/A"}

4. COMMERCIAL DISCUSSION SUMMARY:
- Budget Alignment: ${meetingData.budgetAlignment || "N/A"}
- Approx Budget Indicated: ${meetingData.approxBudgetIndicated || "N/A"}

5. CLIENT RESPONSE & QUALITY:
- Client Interest Level: ${meetingData.clientInterestLevel || "N/A"}
- Decision Maker Identified: ${meetingData.decisionMakerIdentified || "N/A"}
- Expected Decision Timeline: ${meetingData.expectedDecisionTimeline || "N/A"}

6. NEXT ACTION:
- Next Step: ${meetingData.nextStep}
- Expected Quotation Date: ${meetingData.expectedQuotationDate || "N/A"}
- Next Follow-up Date: ${meetingData.nextFollowUpDate}

7. MEETING NOTES:
${meetingData.meetingNotes || "N/A"}
        `.trim();
      } else {
        newStage = leadForMeeting.stage; // Keep current stage
        notesPrefix = "--- MEETING UPDATED ---";
        meetingNotesContent = meetingData.meetingNotes;
      }

      const fullNote = `
${meetingNotesContent}

ATTACHMENTS:
- Selfie: ${selfieImage ? "Captured" : "Not captured"}
- Documents: ${uploadedDocuments.length} file(s) uploaded

[ATTACHMENTS_DATA]
${attachmentsJson}
[END_ATTACHMENTS_DATA]
      `.trim();

      const updatedNotes = leadForMeeting.notes
        ? `${leadForMeeting.notes}\n\n${notesPrefix}\n${fullNote}`
        : `${notesPrefix}\n${fullNote}`;

      const validLeadId = leadForMeeting.id || (leadForMeeting as any)._id;
      if (!validLeadId) {
        toast.error("Lead ID is missing. Please refresh the page.");
        return;
      }

      await leadsAPI.update(validLeadId, {
        stage: newStage,
        notes: updatedNotes
      });

      setLeadList(leadList.map(lead => {
        const currentId = lead.id || (lead as any)._id;
        return currentId === validLeadId
          ? { ...lead, id: validLeadId, stage: newStage, notes: updatedNotes }
          : lead;
      }));

      setIsMeetingModalOpen(false);
      setLeadForMeeting(null);
      setMeetingData({
        meetingDuration: "",
        attendeesPresent: [],
        pitAvailable: "",
        pitDepthConfirmed: "",
        shaftStatus: "",
        shaftType: "",
        shaftSize: "",
        machineRoom: "",
        proposedElevatorType: "",
        floorsFinalized: [],
        capacityDiscussed: "",
        specialRequirements: [],
        budgetAlignment: "",
        approxBudgetIndicated: "",
        clientInterestLevel: "",
        decisionMakerIdentified: "",
        expectedDecisionTimeline: "",
        nextStep: "",
        expectedQuotationDate: "",
        nextFollowUpDate: "",
        meetingNotes: "",
        // Reset new fields
        nextStepIdentified: "",
        meetingDateTime: "",
        expectedTimeline: "",
        salesExecutive: "",
      });
      setSelfieImage(null);
      setUploadedDocuments([]);
      setDocumentPreviews({});
      stopCamera();

      const successMessage = isMovingToMeetingScheduled
        ? "Meeting details saved successfully! Lead moved to Meeting Scheduled stage."
        : "Meeting details saved successfully! Lead moved to Meeting Completed stage.";
      toast.success(successMessage);
    } catch (error) {
      console.error("Failed to save meeting details:", error);
      toast.error("Failed to save meeting details. Please try again.");
    }
  };

  const handleQuotationSubmit = async () => {
    if (!leadForQuotation) return;

    // Validation
    if (!quotationData.quotationPrepared) {
      toast.error("Please confirm if the quotation has been prepared and sent.");
      return;
    }

    if (quotationData.quotationPrepared !== "Yes") {
      toast.error("❗ Only 'Yes' allows movement to 'Quotation Sent'. Please select 'Yes' to proceed.");
      return;
    }

    if (!quotationData.salesExecutiveName) {
      toast.error("Please enter Sales Executive Name.");
      return;
    }

    try {
      const quotationNotes = `
QUOTATION CONFIRMATION:
- Quotation Prepared & Sent: ${quotationData.quotationPrepared}

QUOTATION DETAILS:
- Quotation Number: ${quotationData.quotationNumber || "N/A"}
- Quotation Date: ${quotationData.quotationDate || "N/A"}
- Quotation Validity: ${quotationData.quotationValidity || "N/A"}
- Total Quotation Value: ₹${quotationData.totalQuotationValue || "N/A"}
- Payment Terms: ${quotationData.paymentTerms || "N/A"}${quotationData.paymentTermsCustom ? ` (${quotationData.paymentTermsCustom})` : ""}

PRODUCT & TECHNICAL SUMMARY:
- Elevator Type Quoted: ${quotationData.elevatorTypeQuoted || "N/A"}
- Number of Floors: ${quotationData.numberOfFloors.join(", ") || "N/A"}
- Rated Capacity: ${quotationData.ratedCapacity || "N/A"}
- Speed: ${quotationData.speed || "N/A"}

SCOPE OF SUPPLY:
${quotationData.scopeOfSupply.length > 0 ? quotationData.scopeOfSupply.map(item => `- ${item}`).join("\n") : "- None"}

DELIVERY & TIMELINES:
- Manufacturing Lead Time: ${quotationData.manufacturingLeadTime || "N/A"}
- Installation Duration: ${quotationData.installationDuration || "N/A"}

CLIENT COMMUNICATION:
- Quotation Sent Via: ${quotationData.quotationSentVia.join(", ") || "N/A"}
- Client Acknowledgement: ${quotationData.clientAcknowledgement || "N/A"}
- Client Initial Feedback: ${quotationData.clientInitialFeedback || "N/A"}

COMMERCIAL POSITIONING:
- Pricing Status: ${quotationData.pricingStatus || "N/A"}
- Discount Applied: ${quotationData.discountApplied || "N/A"}${quotationData.discountAmount ? ` - ₹${quotationData.discountAmount}` : ""}
- Manager Approval Reference: ${quotationData.managerApprovalReference || "N/A"}

NEXT ACTION:
- Next Step: ${quotationData.nextStep || "N/A"}
- Next Follow-up Date: ${quotationData.nextFollowUpDate || "N/A"}

SALES OWNER:
- Sales Executive: ${quotationData.salesExecutiveName}
- Remarks: ${quotationData.remarks || "N/A"}
      `.trim();

      const updatedNotes = leadForQuotation.notes
        ? `${leadForQuotation.notes}\n\n--- QUOTATION SENT ---\n${quotationNotes}`
        : quotationNotes;

      await leadsAPI.update(leadForQuotation.id, {
        stage: "Quotation Sent" as Lead["stage"],
        notes: updatedNotes
      });

      setLeadList(leadList.map(lead =>
        lead.id === leadForQuotation.id
          ? { ...lead, stage: "Quotation Sent" as Lead["stage"], notes: updatedNotes }
          : lead
      ));

      setIsQuotationModalOpen(false);
      setLeadForQuotation(null);
      setQuotationData({
        quotationPrepared: "",
        quotationNumber: "",
        quotationDate: "",
        quotationValidity: "",
        totalQuotationValue: "",
        paymentTerms: "",
        paymentTermsCustom: "",
        elevatorTypeQuoted: "",
        numberOfFloors: [],
        ratedCapacity: "",
        speed: "",
        scopeOfSupply: [],
        manufacturingLeadTime: "",
        installationDuration: "",
        quotationSentVia: [],
        clientAcknowledgement: "",
        clientInitialFeedback: "",
        pricingStatus: "",
        discountApplied: "",
        discountAmount: "",
        managerApprovalReference: "",
        nextStep: "",
        nextFollowUpDate: "",
        salesExecutiveName: "",
        remarks: "",
      });

      toast.success("Quotation details submitted successfully!");
    } catch (error) {
      console.error("Failed to submit quotation details:", error);
      toast.error("Failed to submit quotation details. Please try again.");
    }
  };

  const handleDeliberationSubmit = async () => {
    if (!leadForDeliberation) return;

    // Validation
    if (deliberationData.deliberationReasons.length === 0) {
      toast.error("Please select at least one reason for Manager Deliberation.");
      return;
    }

    if (!deliberationData.salesJustification) {
      toast.error("Please provide sales justification (mandatory).");
      return;
    }

    try {
      const deliberationNotes = `
MANAGER DELIBERATION DETAILS:

DELIBERATION TRIGGER:
- Reasons: ${deliberationData.deliberationReasons.join(", ") || "N/A"}

QUOTATION SUMMARY:
- Quotation Number: ${deliberationData.quotationNumber || "N/A"}
- Quotation Date: ${deliberationData.quotationDate || "N/A"}
- Quotation Value: ₹${deliberationData.quotationValue || "N/A"}
- Quotation Validity: ${deliberationData.quotationValidity || "N/A"} Days
- Client Name: ${deliberationData.clientName || "N/A"}
- Project Location: ${deliberationData.projectLocation || "N/A"}

TECHNICAL OVERVIEW:
- Elevator Type: ${deliberationData.elevatorType || "N/A"}
- Floors: ${deliberationData.floors.join(", ") || "N/A"}
- Capacity: ${deliberationData.capacity || "N/A"}
- Pit / Shaft / Machine Room Status: ${deliberationData.pitShaftStatus || "N/A"}

COMMERCIAL DETAILS:
- Standard Price: ₹${deliberationData.standardPrice || "N/A"}
- Quoted Price: ₹${deliberationData.quotedPrice || "N/A"}
- Discount Requested: ${deliberationData.discountRequested || "N/A"}${deliberationData.discountAmount ? ` - ₹${deliberationData.discountAmount}` : ""}${deliberationData.discountPercent ? ` / ${deliberationData.discountPercent}%` : ""}
- Expected Gross Margin: ${deliberationData.expectedGrossMargin || "N/A"}

CLIENT POSITION:
- Client Feedback: ${deliberationData.clientFeedback || "N/A"}
- Competitor Presence: ${deliberationData.competitorPresence || "N/A"}${deliberationData.competitorBrand ? ` - ${deliberationData.competitorBrand}` : ""}

SALES JUSTIFICATION:
${deliberationData.salesJustification}

MANAGER DECISION:
- Approval Status: ${deliberationData.approvalStatus || "Pending"}
- Approved Final Value: ₹${deliberationData.approvedFinalValue || "N/A"}
- Special Conditions: ${deliberationData.specialConditions || "N/A"}

NEXT ACTION:
- If Approved: ${deliberationData.nextActionIfApproved || "N/A"}
- If Rejected: ${deliberationData.nextActionIfRejected || "N/A"}
- Next Follow-up Date: ${deliberationData.nextFollowUpDate || "N/A"}
      `.trim();

      const updatedNotes = leadForDeliberation.notes
        ? `${leadForDeliberation.notes}\n\n--- MANAGER DELIBERATION ---\n${deliberationNotes}`
        : deliberationNotes;

      await leadsAPI.update(leadForDeliberation.id, {
        stage: "Manager Deliberation" as Lead["stage"],
        notes: updatedNotes
      });

      setLeadList(leadList.map(lead =>
        lead.id === leadForDeliberation.id
          ? { ...lead, stage: "Manager Deliberation" as Lead["stage"], notes: updatedNotes }
          : lead
      ));

      setIsManagerDeliberationModalOpen(false);
      setLeadForDeliberation(null);
      setDeliberationData({
        deliberationReasons: [],
        quotationNumber: "",
        quotationDate: "",
        quotationValue: "",
        quotationValidity: "",
        clientName: "",
        projectLocation: "",
        elevatorType: "",
        floors: [],
        capacity: "",
        pitShaftStatus: "",
        standardPrice: "",
        quotedPrice: "",
        discountRequested: "",
        discountAmount: "",
        discountPercent: "",
        expectedGrossMargin: "",
        clientFeedback: "",
        competitorPresence: "",
        competitorBrand: "",
        salesJustification: "",
        approvalStatus: "",
        approvedFinalValue: "",
        specialConditions: "",
        nextActionIfApproved: "",
        nextActionIfRejected: "",
        nextFollowUpDate: "",
      });

      toast.success("Manager deliberation details submitted successfully!");
    } catch (error) {
      console.error("Failed to submit deliberation details:", error);
      toast.error("Failed to submit deliberation details. Please try again.");
    }
  };

  const handleViewDetails = async (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
    try {
      const leadId = lead.id || (lead as any)._id;
      if (leadId) {
        const fullLead = await leadsAPI.getById(leadId) as Lead;
        setSelectedLead(fullLead);
      }
    } catch (error) {
      console.error("Failed to load lead details:", error);
    }
  };

  const handleLeadDocumentDownload = async (docId: string, fileName: string) => {
    if (!selectedLead || !docId) return;
    const leadId = selectedLead.id || (selectedLead as any)._id;
    if (!leadId) return;

    try {
      await leadsAPI.downloadDocument(leadId, docId, fileName);
    } catch (error: any) {
      console.error("Failed to download document:", error);
      toast.error(error?.message || "Failed to download document");
    }
  };

  const handleEditLead = (lead: Lead) => {
    const leadId = (lead as any)._id?.toString() || lead.id;
    router.push(`/dashboard/leads/edit/${leadId}`);
  };

  const handleDeleteClick = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    try {
      await leadsAPI.delete(leadToDelete.id);
      toast.success("Lead deleted successfully");
      setIsDeleteModalOpen(false);
      setLeadToDelete(null);
      // If this was the last lead on the current page, go to previous page
      const newPage = leadList.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      await loadLeads({ page: newPage });
    } catch (error) {
      console.error("Failed to delete lead:", error);
      toast.error("Failed to delete lead. Please try again.");
    }
  };

  const handleBulkDeleteConfirm = async () => {
    if (selectedLeadIds.size === 0) return;

    const count = selectedLeadIds.size;
    setDeleting(true);
    try {
      const deletePromises = Array.from(selectedLeadIds).map(async (leadId) => {
        await leadsAPI.delete(leadId);
      });

      await Promise.all(deletePromises);
      await loadLeads({ page: currentPage });
      setSelectedLeadIds(new Set());
      setIsBulkDeleteModalOpen(false);
      toast.success(`Successfully deleted ${count} lead(s)`);
    } catch (error) {
      console.error("Failed to delete leads:", error);
      toast.error("Failed to delete some leads. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return;

    try {
      const updatedNotes = selectedLead.notes
        ? `${selectedLead.notes}\n\n[${new Date().toLocaleString()}] ${newNote}`
        : `[${new Date().toLocaleString()}] ${newNote}`;

      await leadsAPI.update(selectedLead.id, { notes: updatedNotes });
      setLeadList(leadList.map(lead =>
        lead.id === selectedLead.id ? { ...lead, notes: updatedNotes } : lead
      ));
      setSelectedLead({ ...selectedLead, notes: updatedNotes });
      setNewNote("");
    } catch (error) {
      console.error("Failed to add note:", error);
      toast.error("Failed to add note. Please try again.");
    }
  };

  const handleAddLead = async () => {
    if (isCreatingLead) return;
    // Validation
    if (!newLead.name || !newLead.phone || !newLead.email || !newLead.state || !newLead.source) {
      toast.error("Please fill in all required basic lead details.");
      return;
    }

    // Validate phone number - must be exactly 10 digits
    if (!validatePhone(newLead.phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // Validate name - should not contain numbers
    // Validate name - should not contain numbers
    if (/\d/.test(newLead.name)) {
      toast.error("Name should only contain letters and spaces.");
      return;
    }

    try {
      setIsCreatingLead(true);
      const leadData: any = {
        name: newLead.name,
        company: newLead.state,
        state: newLead.state,
        email: newLead.email,
        phone: newLead.phone,
        source: newLead.source,
        stage: "New Lead" as Lead["stage"],
        value: 0,
        assignedTo: newLead.assignedTo,
        notes: newLead.remarks,
      };

      const nameMatch = users.find(
        (u) =>
          u.name &&
          newLead.assignedTo?.trim() &&
          u.name.trim().toLowerCase() === newLead.assignedTo.trim().toLowerCase()
      );
      if (nameMatch?.id) {
        leadData.assignedToUserId = nameMatch.id;
      }

      if (newLead.groupId) {
        leadData.groupId = newLead.groupId;
      }

      await leadsAPI.create(leadData);
      await loadLeads({ page: currentPage });
      setIsModalOpen(false);
      toast.success("Lead added successfully!");

      // Reset form and clear uploads
      setSelfieImage(null);
      setUploadedDocuments([]);
      setDocumentPreviews({});
      setNewLead({
        name: "",
        phone: "",
        email: "",
        state: "",
        source: "Website",
        remarks: "",
        company: "",
        value: "",
        assignedTo: "",
        notes: "",
        groupId: "",
      });
    } catch (error: any) {
      console.error("Failed to create lead:", error);
      const status = error?.status;
      const errorMessage = error?.message || "";

      if (status === 401 || status === 403) {
        toast.error("You don't have access.");
      } else if (errorMessage.includes("Unable to connect") || errorMessage.includes("Failed to fetch") || errorMessage.includes("ERR_CONNECTION_REFUSED")) {
        toast.error("Unable to connect. Please try again later.");
      } else {
        toast.error(errorMessage || "Failed to create lead. Please try again.");
      }
    } finally {
      setIsCreatingLead(false);
    }
  };

  const handleImportExcel = async (file: File) => {
    setIsImporting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Dynamically import xlsx only when needed (inside the callback)
          const XLSXModule = await import("xlsx");
          // Next.js dynamic import wraps the module; xlsx functions live on .default
          const XLSX = (XLSXModule as any).default ?? XLSXModule;
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);

          if (jsonData.length === 0) {
            toast.error("Excel file is empty or invalid format.");
            if (fileInputRef.current) fileInputRef.current.value = '';
            setIsImporting(false);
            return;
          }

          // --- Parse all rows first ---
          type ParsedRow = {
            rowIndex: number;
            name: string;
            company: string;
            email: string;
            phone: string;
            source: string;
            stage: string;
            value: number;
          };

          const parsedRows: ParsedRow[] = [];
          let parseErrorCount = 0;
          const parseErrors: string[] = [];
          const seenPhonesInFile = new Set<string>();
          const seenEmailsInFile = new Set<string>();
          const duplicateRowsInFile = new Map<number, string>();

          for (let i = 0; i < (jsonData as any[]).length; i++) {
            const row = (jsonData as any[])[i];
            const rowIndex = i + 1;

            const name = (row['Name'] || row['name'] || row['Name / Company'] || row['Lead Name'] || row['Customer Name'] || '').toString().trim();
            const company = (row['Company'] || row['company'] || row['Name / Company'] || row['Organization'] || '').toString().trim();
            const email = (row['Email'] || row['email'] || row['Email ID'] || row['E-mail'] || row['e-mail'] || row['Contact Email'] || '').toString().trim().toLowerCase();
            let phone = (row['Phone'] || row['phone'] || row['Phone Number'] || row['Mobile'] || row['mobile'] || row['Contact Number'] || row['Contact'] || '').toString().trim().replace(/\D/g, '');
            if (phone.length === 12 && phone.startsWith('91')) phone = phone.slice(2);
            if (phone.length === 13 && phone.startsWith('091')) phone = phone.slice(3);
            const source = (row['Source'] || row['source'] || '').toString().trim();
            const stage = (row['Stage'] || row['stage'] || '').toString().trim();
            const value = parseFloat(row['Value'] || row['value'] || row['Lead Value'] || 0) || 0;

            if (!name) {
              parseErrors.push(`Row ${rowIndex}: Name is required`);
              parseErrorCount++;
              continue;
            }
            if (!phone || phone.length !== 10) {
              parseErrors.push(`Row ${rowIndex}: Valid 10-digit phone number is required`);
              parseErrorCount++;
              continue;
            }

            if (seenPhonesInFile.has(phone)) {
              duplicateRowsInFile.set(rowIndex, `phone ${phone} duplicated in same file`);
              continue;
            }
            if (email && seenEmailsInFile.has(email)) {
              duplicateRowsInFile.set(rowIndex, `email ${email} duplicated in same file`);
              continue;
            }

            seenPhonesInFile.add(phone);
            if (email) seenEmailsInFile.add(email);
            parsedRows.push({ rowIndex, name, company, email, phone, source, stage, value });
          }

          // --- Check for duplicates against CRM in one batch request ---
          const allPhones = parsedRows.map(r => r.phone);
          const allEmails = parsedRows.map(r => r.email).filter(Boolean);

          let duplicatePhones = new Set<string>();
          let duplicateEmails = new Set<string>();

          try {
            const dupResult = await leadsAPI.checkDuplicates({ phones: allPhones, emails: allEmails });
            duplicatePhones = new Set(dupResult.duplicatePhones);
            duplicateEmails = new Set(dupResult.duplicateEmails);
          } catch {
            // If check fails, continue import without blocking (fail open)
          }

          let successCount = 0;
          let duplicateCount = 0;
          let errorCount = parseErrorCount;
          const errors: string[] = [...parseErrors];
          const duplicateMessages: string[] = [];

          for (const row of parsedRows) {
            const isDuplicatePhone = duplicatePhones.has(row.phone);
            const isDuplicateEmail = row.email ? duplicateEmails.has(row.email) : false;

            if (isDuplicatePhone || isDuplicateEmail) {
              duplicateCount++;
              const reason = isDuplicatePhone
                ? `phone ${row.phone} already exists`
                : `email ${row.email} already exists`;
              duplicateMessages.push(`Row ${row.rowIndex} (${row.name}): Lead is duplicate — ${reason}`);
              continue;
            }

            try {
              let assignedTo: string;
              if (isAdmin()) {
                assignedTo = 'Unassigned';
              } else {
                assignedTo = currentUser?.name || 'Unassigned';
              }

              const leadData: Record<string, unknown> = {
                name: row.name,
                company: row.company,
                email: row.email,
                phone: row.phone,
                source: row.source || 'Website',
                stage: (row.stage || 'New Lead') as Lead["stage"],
                value: row.value,
                assignedTo,
                notes: '',
              };
              if (currentUser?.id && assignedTo === currentUser.name) {
                leadData.assignedToUserId = currentUser.id;
              }

              await leadsAPI.create(leadData);
              successCount++;
            } catch (error: any) {
              errorCount++;
              errors.push(`Row ${row.rowIndex}: ${error.message || 'Failed to import'}`);
            }
          }

          // Count duplicates detected inside the uploaded sheet itself.
          for (const [rowIndex, reason] of duplicateRowsInFile.entries()) {
            duplicateCount++;
            duplicateMessages.push(`Row ${rowIndex}: Lead is duplicate — ${reason}`);
          }

          if (successCount > 0) {
            toast.success(`Successfully imported ${successCount} lead(s)`);
            await loadLeads({ page: 1 });
          }

          if (duplicateCount > 0) {
            toast.error(
              `${duplicateCount} duplicate lead(s) skipped — already exist in CRM. ${duplicateMessages.slice(0, 2).join('; ')}${duplicateMessages.length > 2 ? '...' : ''}`,
              7000
            );
          }

          if (errorCount > 0) {
            toast.error(`Failed to import ${errorCount} lead(s). ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? '...' : ''}`);
          }

          if (successCount === 0 && duplicateCount === 0 && errorCount === 0) {
            toast.error("No leads were imported.");
          }

          setIsImportModalOpen(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } catch (error: any) {
          console.error("Failed to parse Excel:", error);
          toast.error("Failed to parse Excel file. Please check the format.");
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error("Failed to import Excel:", error);
      toast.error("Failed to import Excel file. Please try again.");
      setIsImporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        handleImportExcel(file);
      } else {
        toast.error("Please select a valid Excel file (.xlsx or .xls)");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  fbSyncParamsRef.current = {
    assignedTo: isAdmin() ? "Sales Executive 1" : (currentUser?.name || "Sales Executive 1"),
    assignedToUserId: !isAdmin() && currentUser?.id ? currentUser.id : undefined,
    groupId: selectedGroupId || null,
  };

  const FB_SYNC_MAX_FAILURES = 3;
  const syncFacebookSilent = async () => {
    if (!facebookConfigured || fbSyncDisabled) return;
    console.log("[Leads] Fetching leads from Facebook...");
    const { assignedTo, assignedToUserId, groupId } = fbSyncParamsRef.current;
    try {
      const res = await leadsAPI.syncFacebook({
        assignedTo,
        assignedToUserId,
        groupId: groupId ?? undefined,
      });
      fbSyncFailuresRef.current = 0;
      if (res.imported > 0) {
        console.log(`[Leads] Fetched ${res.imported} lead(s) from Facebook. Leads are fetching from Facebook.`);
        await loadLeads({ page: 1 });
      } else {
        console.log("[Leads] No new leads from Facebook this sync.", res.total != null ? `(Total checked: ${res.total})` : "");
      }
    } catch (e) {
      fbSyncFailuresRef.current += 1;
      console.warn(
        `[Leads] Facebook sync failed (background, ${fbSyncFailuresRef.current}/${FB_SYNC_MAX_FAILURES}):`,
        e
      );
      if (fbSyncFailuresRef.current >= FB_SYNC_MAX_FAILURES) {
        setFbSyncDisabled(true);
        console.warn(
          "[Leads] Auto-sync disabled after repeated Facebook failures. Fix the credentials in Settings, then reload the page."
        );
      }
    }
  };

  const handleSyncFacebook = async () => {
    if (!facebookConfigured) {
      toast.error("Configure Facebook credentials in Settings to sync leads.");
      return;
    }
    console.log("[Leads] Syncing leads from Facebook (manual)...");
    setSyncingFacebook(true);
    try {
      const res = await leadsAPI.syncFacebook({
        assignedTo: isAdmin() ? "Sales Executive 1" : (currentUser?.name || "Sales Executive 1"),
        assignedToUserId: !isAdmin() && currentUser?.id ? currentUser.id : undefined,
        groupId: selectedGroupId || null,
      });
      console.log(`[Leads] Leads are fetching from Facebook. Synced ${res.imported} lead(s).`);
      toast.success(res.message || `Synced ${res.imported} lead(s) from Facebook Lead Ads.`);
      fbSyncFailuresRef.current = 0;
      if (fbSyncDisabled) setFbSyncDisabled(false);
      if (res.imported > 0) await loadLeads({ page: 1 });
      if (res.errors?.length) toast.error(res.errors.slice(0, 2).join(" "));
    } catch (e: any) {
      console.warn("[Leads] Facebook sync failed:", e?.message || e);
      toast.error(e.message || "Facebook sync failed. Check credentials in Settings.");
    } finally {
      setSyncingFacebook(false);
    }
  };


  // Auto-sync Facebook leads periodically when configured (credentials stored on backend).
  // Stops entirely once fbSyncDisabled is set (after repeated failures).
  useEffect(() => {
    if (!facebookConfigured || fbSyncDisabled) return;
    const t1 = setTimeout(() => syncFacebookSilent(), 10000);
    const t2 = setInterval(syncFacebookSilent, 5 * 60 * 1000);
    return () => {
      clearTimeout(t1);
      clearInterval(t2);
    };
  }, [facebookConfigured, fbSyncDisabled]);

  // Google Ads leads now come via webhook, no periodic sync needed

  // Let the backend control which leads are visible for the current user.
  const filteredLeads = leadList;
  const leadGroupOptions = useMemo(() => {
    const existing = new Set(groups.map((g) => g.groupName.toLowerCase()));
    const extras = LEAD_GROUP_OPTIONS.filter((name) => !existing.has(name.toLowerCase())).map(
      (name) => ({ id: name, groupName: name })
    );
    return [...extras, ...groups];
  }, [groups]);
  const salesExecutiveSuggestions = Array.from(
    new Set(
      users
        .filter((user) => user.role !== "Admin" && user.name?.trim())
        .map((user) => user.name.trim())
    )
  );
  const [isSalesExecDropdownOpen, setIsSalesExecDropdownOpen] = useState(false);
  const filteredSalesExecSuggestions = useMemo(() => {
    const q = (newLead.assignedTo || "").trim().toLowerCase();
    const list = salesExecutiveSuggestions;
    const filtered = q ? list.filter((n) => n.toLowerCase().includes(q)) : list;
    return filtered.slice(0, 25);
  }, [salesExecutiveSuggestions, newLead.assignedTo]);

  if (loading && !hasLoadedOnce) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading leads...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200 max-w-md">
          <p className="text-gray-700 font-medium">You don&apos;t have access.</p>
          <p className="text-sm text-gray-500 mt-1">You don&apos;t have permission to view this module.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 max-w-full">
      {/* Connection issue: generic message only (no dev instructions) */}
      {backendConnected === false && (
        <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-amber-800">Unable to connect</h3>
              <p className="mt-1 text-sm text-amber-700">Please try again later.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 sm:mb-8 space-y-4">
        {/* Title + actions */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Leads</h1>
            <p className="text-sm sm:text-base text-gray-600">Track and manage all your sales leads</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={backendConnected === false}
              className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${backendConnected === false
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              <IoAdd className="w-4 h-4 shrink-0" />
              Add Lead
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={backendConnected === false || isImporting}
              className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${backendConnected === false || isImporting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
              <IoCloudUpload className="w-4 h-4 shrink-0" />
              {isImporting ? "Importing..." : "Import Excel"}
            </button>
            <button
              onClick={handleSyncFacebook}
              disabled={backendConnected === false || syncingFacebook || !facebookConfigured}
              title="Sync leads from Facebook Lead Ads (configure in Settings)"
              className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${backendConnected === false || syncingFacebook || !facebookConfigured
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
            >
              <IoRefresh className="w-4 h-4 shrink-0" />
              {syncingFacebook ? "Syncing..." : "Sync Facebook"}
            </button>
            {canManageAssignments && (
              <button
                onClick={() => setIsBulkReassignModalOpen(true)}
                disabled={backendConnected === false}
                className={`inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${backendConnected === false
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
              >
                <IoPerson className="w-4 h-4 shrink-0" />
                Bulk Reassign
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 sm:p-4">
          <div className="relative mb-3">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <select
              value={selectedGroupId}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedGroupId(v);
                setCurrentPage(1);
                loadLeads({ groupId: v || undefined, page: 1 });
              }}
              className="h-10 w-full min-w-0 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-label="Filter by group"
            >
              <option value="">All Groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.groupName}
                </option>
              ))}
            </select>
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="h-10 w-full min-w-0 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-label="Filter by stage"
            >
              <option value="">All Stages</option>
              {stages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={selectedContactStatusFilter}
              onChange={(e) => setSelectedContactStatusFilter(e.target.value)}
              className="h-10 w-full min-w-0 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              {LEAD_CONTACT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="h-10 w-full min-w-0 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-label="Filter by state"
            >
              <option value="">All States</option>
              {(availableStates.length > 0 ? availableStates : indianStates).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {canViewAllLeadsFilter && (
            <select
              value={selectedBdmUserId}
              onChange={(e) => setSelectedBdmUserId(e.target.value)}
              className="h-10 w-full min-w-0 px-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:col-span-2 lg:col-span-1"
              aria-label="Filter by BDM"
            >
              <option value="">All BDM</option>
              {users
                .filter((u: any) => (u?.role || "") !== "Admin")
                .map((u: any) => (
                  <option key={u.id || u._id} value={u.id || u._id}>
                    {u.name || u.email || "User"}
                  </option>
                ))}
            </select>
            )}
          </div>
        </div>
      </div>

      {/* Results Info & Rows Per Page */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className={`text-sm rounded-lg px-4 py-2 inline-block ${totalLeads > 0
            ? "bg-green-50 border border-green-200 text-gray-600"
            : "bg-gray-50 border border-gray-200 text-gray-500"
          }`}>
          {totalLeads > 0 ? (
            <>
              Showing{" "}
              <span className="font-semibold text-green-700">
                {Math.min((currentPage - 1) * leadsPerPage + 1, totalLeads)}–{Math.min(currentPage * leadsPerPage, totalLeads)}
              </span>{" "}
              of <span className="font-semibold">{totalLeads}</span> leads
              {selectedSourceFilter && (
                <span className="ml-2">• Source: <span className="font-semibold">{selectedSourceFilter}</span></span>
              )}
              {selectedGroupId && (
                <span className="ml-2">• Group: <span className="font-semibold">{groups.find((g) => g.id === selectedGroupId)?.groupName ?? "—"}</span></span>
              )}
              {selectedState && (
                <span className="ml-2">• State: <span className="font-semibold">{selectedState}</span></span>
              )}
              {selectedStageFilter && (
                <span className="ml-2">• Stage: <span className="font-semibold">{selectedStageFilter}</span></span>
              )}
              {selectedContactStatusFilter && (
                <span className="ml-2">• Status: <span className="font-semibold">{selectedContactStatusFilter}</span></span>
              )}
              {selectedBdmUserId && (
                <span className="ml-2">• BDM: <span className="font-semibold">{users.find((u: any) => (u.id || u._id) === selectedBdmUserId)?.name ?? "—"}</span></span>
              )}
              {searchTerm && (
                <span className="ml-2">• Search: &ldquo;<span className="font-semibold">{searchTerm}</span>&rdquo;</span>
              )}
            </>
          ) : (
            <>
              {selectedSourceFilter && !selectedGroupId && !searchTerm && !selectedStageFilter && !selectedContactStatusFilter
                ? `No leads from ${selectedSourceFilter}`
                : selectedGroupId && !searchTerm && !selectedSourceFilter && !selectedStageFilter && !selectedContactStatusFilter
                  ? "No leads assigned to this group"
                  : selectedStageFilter && !searchTerm && !selectedContactStatusFilter
                    ? `No leads in ${selectedStageFilter} stage`
                    : selectedContactStatusFilter && !searchTerm
                      ? `No leads with status "${selectedContactStatusFilter}"`
                      : `No leads found${searchTerm ? ` matching "${searchTerm}"` : ""}`}
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <label htmlFor="leadsPerPage" className="whitespace-nowrap">Rows per page:</label>
          <select
            id="leadsPerPage"
            value={leadsPerPage}
            onChange={(e) => setLeadsPerPage(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Assignment and bulk actions */}
      {selectedLeadIds.size > 0 && (() => {
        const selectedLeads = leadList.filter((l) => {
          const id = l.id || (l as any)._id?.toString?.() || "";
          const idAlt = (l as any)._id != null ? String((l as any)._id) : id;
          return (id && selectedLeadIds.has(id)) || (idAlt && selectedLeadIds.has(idAlt));
        });
        const hasAnyAssigned = selectedLeads.some((l) => {
          const t = (l.assignedTo || "").trim();
          return t !== "" && t !== "Unassigned";
        });
        return (
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            {canManageAssignments && (
              <>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  <IoPerson className="w-4 h-4 sm:w-5 sm:h-5" />
                  Assign ({selectedLeadIds.size})
                </button>
                <button
                  onClick={handleUnassignLeads}
                  disabled={assigning || !hasAnyAssigned}
                  title={!hasAnyAssigned ? "No selected lead is assigned" : undefined}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assigning ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <IoPersonRemove className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  Unassign ({selectedLeadIds.size})
                </button>
              </>
            )}
            {canDeleteLeadActions && (
              <button
                onClick={() => setIsBulkDeleteModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                <IoCloseCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                Delete All ({selectedLeadIds.size})
              </button>
            )}
            <button
              onClick={() => setSelectedLeadIds(new Set())}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Selection
            </button>
          </div>
        );
      })()}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-w-0 max-w-full">

        {/* Mobile Card View */}
        <div className="block md:hidden divide-y divide-gray-200">
          {filteredLeads.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              {leadList.length === 0 ? "No leads yet" : "No results found"}
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const leadId = lead.id || (lead as any)._id || "";
              return (
                <div key={lead.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={selectedLeadIds.has(leadId)}
                        onChange={() => handleSelectLead(leadId)}
                        className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gray-900">{lead.id}</span>
                          <StatusBadge status={lead.stage} />
                        </div>
                        <p className="text-base font-medium text-gray-900 truncate">{lead.name}</p>
                        <p className="text-sm text-gray-600 truncate">{lead.company}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-gray-900 truncate">{lead.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="text-gray-900">{lead.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-gray-900">
                        {(lead as any).createdAt ? new Date((lead as any).createdAt).toLocaleDateString() : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Source</p>
                      {(lead.source || "").toLowerCase().includes("facebook") ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">{lead.source}</span>
                      ) : (
                        <p className="text-gray-900">{lead.source}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Value</p>
                      <p className="text-gray-900 font-semibold">₹{(lead.value / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                    <label className="text-xs font-medium text-gray-700 mb-1">Stage</label>
                    <div className="relative">
                      <select
                        value={lead.stage}
                        onChange={(e) => {
                          const leadId = lead.id || (lead as any)._id || "";
                          if (leadId) {
                            handleStageChange(leadId, e.target.value as Lead["stage"]);
                          } else {
                            console.error("Lead has no valid ID:", lead);
                            toast.error("Lead ID is missing. Please refresh the page.");
                          }
                        }}
                        className={`text-sm sm:text-base border-2 rounded-lg pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 focus:outline-none focus:ring-2 transition-all bg-white w-full appearance-none cursor-pointer shadow-sm hover:shadow-md active:shadow-lg touch-manipulation min-h-[44px] ${stageChangeError[lead.id || (lead as any)._id || ""]
                          ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                          : `${getStageColor(lead.stage)} focus:ring-green-500 focus:border-green-500`
                          }`}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1em 1em',
                          paddingRight: '2.5rem',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          fontSize: '16px' // Prevents zoom on iOS
                        }}
                      >
                        {getAvailableStages(lead.stage).map((stage) => (
                          <option
                            key={stage}
                            value={stage}
                            className={lead.stage === stage ? "font-semibold bg-green-600 text-white" : ""}
                          >
                            {stage}
                          </option>
                        ))}
                      </select>
                      {/* Icon overlay */}
                      <div className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none ${getStageColor(lead.stage).split(' ')[1]}`}>
                        {getStageIcon(lead.stage)}
                      </div>
                      {stageChangeError[lead.id || (lead as any)._id || ""] && (
                        <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 z-10 whitespace-normal sm:whitespace-nowrap max-w-[calc(100vw-2rem)] sm:max-w-xs shadow-sm">
                          {stageChangeError[lead.id || (lead as any)._id || ""]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assigned To</p>
                      <p className="text-sm text-gray-900">{lead.assignedTo || "Unassigned"}</p>
                    </div>
                    <label className="text-xs font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={(lead as any).contactStatus || ""}
                      disabled={!canEditLeadActions}
                      onChange={(e) => {
                        const id = lead.id || (lead as any)._id || "";
                        if (id) handleContactStatusChange(id, e.target.value);
                      }}
                      className="text-sm border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">Select status</option>
                      {LEAD_CONTACT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      {canViewLeadActions && (
                        <button
                          onClick={() => handleViewDetails(lead)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex-1"
                        >
                          <IoDocumentText className="w-4 h-4" />
                          View Details
                        </button>
                      )}
                      {canEditLeadActions && (
                        <AnimatedEditButton
                          onClick={() => handleEditLead(lead)}
                          size="sm"
                          title="Edit Lead"
                        />
                      )}
                      {canDeleteLeadActions && (
                        <AnimatedDeleteButton
                          onClick={() => handleDeleteClick(lead)}
                          size="sm"
                          title="Delete Lead"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table View — horizontal scroll when columns exceed viewport */}
        <div className="hidden md:block w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
          <table className="w-full min-w-[1500px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.size > 0 && selectedLeadIds.size === filteredLeads.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead ID
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name / Company
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  State
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Assigned To
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 sm:px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    {leadList.length === 0 ? "No leads yet" : "No results found"}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const leadId = lead.id || (lead as any)._id || "";
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedLeadIds.has(leadId)}
                          onChange={() => handleSelectLead(leadId)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        <span className="truncate block max-w-[80px] sm:max-w-none">{lead.id}</span>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{lead.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-none">{lead.company}</div>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="text-xs sm:text-sm text-gray-900 truncate max-w-[120px] sm:max-w-[150px]">{lead.email}</div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[120px] sm:max-w-[150px]">{lead.phone}</div>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {lead.source}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {lead.groupName || "-"}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {lead.state || lead.company || "-"}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {(lead as any).createdAt ? new Date((lead as any).createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="relative min-w-[140px] sm:min-w-[160px] lg:min-w-[180px] max-w-full">
                          <select
                            value={lead.stage}
                            onChange={(e) => {
                              const leadId = lead.id || (lead as any)._id || "";
                              if (leadId) {
                                handleStageChange(leadId, e.target.value as Lead["stage"]);
                              } else {
                                console.error("Lead has no valid ID:", lead);
                                toast.error("Lead ID is missing. Please refresh the page.");
                              }
                            }}
                            className={`text-sm sm:text-sm border-2 rounded-lg pl-9 sm:pl-10 pr-8 sm:pr-9 py-2 sm:py-2.5 focus:outline-none focus:ring-2 transition-all bg-white w-full appearance-none cursor-pointer shadow-sm hover:shadow-md active:shadow-lg touch-manipulation min-h-[40px] sm:min-h-[44px] ${stageChangeError[lead.id || (lead as any)._id || ""]
                              ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                              : `${getStageColor(lead.stage)} focus:ring-green-500 focus:border-green-500`
                              }`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 0.6rem center',
                              backgroundSize: '1em 1em',
                              paddingRight: '2.25rem',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              fontSize: '14px'
                            }}
                          >
                            {getAvailableStages(lead.stage).map((stage) => (
                              <option
                                key={stage}
                                value={stage}
                                className={lead.stage === stage ? "font-semibold bg-green-600 text-white" : ""}
                              >
                                {stage}
                              </option>
                            ))}
                          </select>
                          {/* Icon overlay */}
                          <div className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 pointer-events-none ${getStageColor(lead.stage).split(' ')[1]}`}>
                            {getStageIcon(lead.stage)}
                          </div>
                          {stageChangeError[lead.id || (lead as any)._id || ""] && (
                            <div className="absolute top-full left-0 mt-1 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 z-10 whitespace-normal sm:whitespace-nowrap max-w-[200px] sm:max-w-xs shadow-sm">
                              {stageChangeError[lead.id || (lead as any)._id || ""]}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-semibold text-gray-900">
                        ₹{(lead.value / 100000).toFixed(1)}L
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 hidden lg:table-cell">
                        {lead.assignedTo}
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <select
                          value={(lead as any).contactStatus || ""}
                          disabled={!canEditLeadActions}
                          onChange={(e) => {
                            const leadId = lead.id || (lead as any)._id || "";
                            if (leadId) handleContactStatusChange(leadId, e.target.value);
                          }}
                          className="text-xs sm:text-sm border-2 border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full min-w-[130px] sm:min-w-[150px] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">Select status</option>
                          {LEAD_CONTACT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                        <div className="flex items-center gap-3">
                          {canViewLeadActions && (
                            <button
                              onClick={() => handleViewDetails(lead)}
                              className="text-green-600 hover:text-green-900 text-sm"
                            >
                              <span className="hidden lg:inline">View Details</span>
                              <span className="lg:hidden">View</span>
                            </button>
                          )}
                          {canEditLeadActions && (
                            <AnimatedEditButton
                              onClick={() => handleEditLead(lead)}
                              size="sm"
                              title="Edit Lead"
                            />
                          )}
                          {canDeleteLeadActions && (
                            <AnimatedDeleteButton
                              onClick={() => handleDeleteClick(lead)}
                              size="sm"
                              title="Delete Lead"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalLeads > 0 && (
        <div className="mt-4 w-full min-w-0 max-w-full overflow-x-auto [scrollbar-width:thin]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 min-w-max sm:min-w-0">
          <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
            <span className="ml-2 text-gray-400">
              ({Math.min((currentPage - 1) * leadsPerPage + 1, totalLeads)}–{Math.min(currentPage * leadsPerPage, totalLeads)} of {totalLeads})
            </span>
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${currentPage === pageNum
                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                »
              </button>
            </div>
          )}
        </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelfieImage(null);
          setUploadedDocuments([]);
          setDocumentPreviews({});
        }}
        title="Add New Lead"
        size="lg"
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <div className="space-y-6">
            {/* 1. BASIC LEAD DETAILS */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">BASIC LEAD DETAILS (Auto / Pre-filled)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Name *
                  </label>
                  <input
                    type="text"
                    value={newLead.name}
                    onChange={(e) => handleTextChange(e.target.value, setNewLead, newLead, 'name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter lead name (text only)"
                    pattern="[A-Za-z\s\.\-\'']+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) => handlePhoneChange(e.target.value, setNewLead, newLead, 'phone')}
                    maxLength={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter 10 digit mobile number"
                    pattern="[0-9]{10}"
                  />
                  {newLead.phone && newLead.phone.length !== 10 && (
                    <p className="text-xs text-red-600 mt-1">Phone number must be exactly 10 digits</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <select
                    value={newLead.state}
                    onChange={(e) => setNewLead({ ...newLead, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select State</option>
                    {(availableStates.length > 0 ? availableStates : indianStates).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group
                  </label>
                  <select
                    value={newLead.groupId}
                    onChange={(e) => setNewLead({ ...newLead, groupId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Group</option>
                    {leadGroupOptions.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.groupName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Source *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {["Website", "Google Ads","Meta Ads", "Referral", "Walk-in", "Other"].map((source) => (
                      <label key={source} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="source"
                          value={source}
                          checked={newLead.source === source}
                          onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>



            {/* 9. SALES OWNER CONFIRMATION */}
            <div className="pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SALES OWNER CONFIRMATION</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Executive Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newLead.assignedTo}
                      onChange={(e) => {
                        setNewLead({ ...newLead, assignedTo: e.target.value });
                        setIsSalesExecDropdownOpen(true);
                      }}
                      onFocus={() => setIsSalesExecDropdownOpen(true)}
                      onBlur={() => {
                        // Delay close so click selection can register.
                        window.setTimeout(() => setIsSalesExecDropdownOpen(false), 150);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter sales executive name"
                      autoComplete="off"
                    />

                    {isSalesExecDropdownOpen && filteredSalesExecSuggestions.length > 0 && (
                      <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
                        {filteredSalesExecSuggestions.map((userName) => (
                          <li
                            key={userName}
                            className="px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setNewLead({ ...newLead, assignedTo: userName });
                              setIsSalesExecDropdownOpen(false);
                            }}
                          >
                            {userName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks / Notes
                  </label>
                  <textarea
                    value={newLead.remarks}
                    onChange={(e) => setNewLead({ ...newLead, remarks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Additional remarks or notes..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleAddLead}
                disabled={isCreatingLead}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${isCreatingLead ? "bg-blue-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isCreatingLead ? "Adding..." : "Add Lead"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Lead Details Modal with Notes */}
      <Modal
        isOpen={isDetailsModalOpen && selectedLead !== null}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedLead(null);
          setNewNote("");
        }}
        title={`Lead Details - ${selectedLead?.name}`}
        size="lg"
      >
        {selectedLead && (() => {
          // Parse structured data from notes
          const notes = selectedLead.notes || '';
          const parseSection = (sectionName: string) => {
            const regex = new RegExp(`${sectionName}:([\\s\\S]*?)(?=\\n\\n[A-Z]|$)`, 'i');
            const match = notes.match(regex);
            if (!match) return null;

            const lines = match[1].trim().split('\n').filter(line => line.trim());
            const data: { [key: string]: string } = {};
            lines.forEach(line => {
              const match = line.match(/^-\s*(.+?):\s*(.+)$/);
              if (match) {
                const key = match[1].trim();
                const value = match[2].trim();
                data[key] = value === 'N/A' ? '' : value;
              }
            });
            return Object.keys(data).length > 0 ? data : null;
          };

          const basicDetails = parseSection('BASIC LEAD DETAILS') || {};
          const contactConfirmation = parseSection('CONTACT CONFIRMATION') || {};
          const contactDetails = parseSection('CONTACT DETAILS') || {};
          const propertyRequirement = parseSection('PROPERTY & REQUIREMENT') || {};
          const sitePit = parseSection('SITE READINESS - PIT') || {};
          const siteShaft = parseSection('SITE READINESS - SHAFT') || {};
          const siteMachineRoom = parseSection('SITE READINESS - MACHINE ROOM') || {};
          const elevatorPreference = parseSection('ELEVATOR PREFERENCE') || {};
          const clientIntent = parseSection('CLIENT INTENT & COMMERCIAL') || {};
          const nextAction = parseSection('NEXT ACTION') || {};
          const salesOwner = parseSection('SALES OWNER') || {};

          mergeContactReportSections(
            {
              contactConfirmation,
              contactDetails,
              propertyRequirement,
              sitePit,
              siteShaft,
              siteMachineRoom,
              elevatorPreference,
              clientIntent,
              nextAction,
              salesOwner,
            },
            selectedLead.contactReport
          );

          const plainRemarks =
            !notes.includes('BASIC LEAD DETAILS') &&
            !notes.includes('SALES OWNER') &&
            !notes.includes('---') &&
            notes.trim()
              ? notes.trim()
              : '';

          return (
            <div className="space-y-6">
              <div className="space-y-6">
                {/* Basic Lead Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <IoPerson className="w-5 h-5 text-green-600" />
                    Basic Lead Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Name</p>
                      <p className="font-medium text-gray-900">{selectedLead.name || basicDetails['Lead Name'] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                      <p className="font-medium text-gray-900">{selectedLead.phone || basicDetails['Mobile Number'] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email ID</p>
                      <p className="font-medium text-gray-900">{selectedLead.email || basicDetails['Email ID'] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">State</p>
                      <p className="font-medium text-gray-900">{selectedLead.state || selectedLead.company || basicDetails['Project Location'] || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Lead Source</p>
                      <p className="font-medium text-gray-900">{selectedLead.source || basicDetails['Lead Source'] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Group</p>
                      <p className="font-medium text-gray-900">{selectedLead.groupName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Stage</p>
                      <StatusBadge status={selectedLead.stage} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                      <p className="font-medium text-gray-900">{selectedLead.assignedTo || salesOwner['Sales Executive'] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Value</p>
                      <p className="font-medium text-gray-900">₹{(selectedLead.value / 100000).toFixed(1)}L</p>
                    </div>
                    {selectedLead.createdAt && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Created At</p>
                        <p className="font-medium text-gray-900">{new Date(selectedLead.createdAt).toLocaleString()}</p>
                      </div>
                    )}
                    {selectedLead.lastContact && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Last Contact</p>
                        <p className="font-medium text-gray-900">{new Date(selectedLead.lastContact).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Standalone remarks (e.g. from new lead creation) */}
                {(plainRemarks || salesOwner['Remarks']) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoDocumentText className="w-5 h-5 text-green-600" />
                      Remarks
                    </h3>
                    <div className="pb-4 border-b">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {salesOwner['Remarks'] || plainRemarks}
                      </p>
                    </div>
                  </div>
                )}

                {/* Contact Confirmation */}
                {contactConfirmation['Contact Successful'] && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoCall className="w-5 h-5 text-green-600" />
                      Contact Confirmation
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Contact Successful</p>
                        <p className="font-medium text-gray-900">{contactConfirmation['Contact Successful']}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Details */}
                {(contactDetails['Contact Mode'] || contactDetails['Date & Time'] || contactDetails['Spoken To']) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoCall className="w-5 h-5 text-green-600" />
                      Contact Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      {contactDetails['Contact Mode'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Contact Mode</p>
                          <p className="font-medium text-gray-900">{contactDetails['Contact Mode']}</p>
                        </div>
                      )}
                      {contactDetails['Date & Time'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                          <p className="font-medium text-gray-900">{contactDetails['Date & Time']}</p>
                        </div>
                      )}
                      {contactDetails['Spoken To'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Spoken To</p>
                          <p className="font-medium text-gray-900">{contactDetails['Spoken To']}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Property & Requirement */}
                {(propertyRequirement['Property Type'] || propertyRequirement['Total Floors'] || propertyRequirement['Primary Usage']) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoDocumentText className="w-5 h-5 text-green-600" />
                      Property & Requirement
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      {propertyRequirement['Property Type'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Property Type</p>
                          <p className="font-medium text-gray-900">{propertyRequirement['Property Type']}</p>
                        </div>
                      )}
                      {propertyRequirement['Total Floors'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Total Floors</p>
                          <p className="font-medium text-gray-900">{propertyRequirement['Total Floors']}</p>
                        </div>
                      )}
                      {propertyRequirement['Primary Usage'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Primary Usage</p>
                          <p className="font-medium text-gray-900">{propertyRequirement['Primary Usage']}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Site Readiness */}
                {(sitePit['Pit Available'] || siteShaft['Shaft Available'] || siteMachineRoom['Machine Room Available']) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoCheckmarkCircle className="w-5 h-5 text-green-600" />
                      Site Readiness
                    </h3>
                    <div className="space-y-4 pb-4 border-b">
                      {sitePit['Pit Available'] && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Pit</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Pit Available</p>
                              <p className="font-medium text-gray-900">{sitePit['Pit Available']}</p>
                            </div>
                            {sitePit['Pit Depth'] && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Pit Depth</p>
                                <p className="font-medium text-gray-900">{sitePit['Pit Depth']}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {siteShaft['Shaft Available'] && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Shaft</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Shaft Available</p>
                              <p className="font-medium text-gray-900">{siteShaft['Shaft Available']}</p>
                            </div>
                            {siteShaft['Shaft Type'] && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Shaft Type</p>
                                <p className="font-medium text-gray-900">{siteShaft['Shaft Type']}</p>
                              </div>
                            )}
                            {siteShaft['Shaft Size'] && (
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Shaft Size</p>
                                <p className="font-medium text-gray-900">{siteShaft['Shaft Size']}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {siteMachineRoom['Machine Room Available'] && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Machine Room</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Machine Room Available</p>
                              <p className="font-medium text-gray-900">{siteMachineRoom['Machine Room Available']}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Elevator Preference */}
                {(elevatorPreference['Preferred Type'] || elevatorPreference['Brand Expectation']) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoDocumentText className="w-5 h-5 text-green-600" />
                      Elevator Preference
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      {elevatorPreference['Preferred Type'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Preferred Type</p>
                          <p className="font-medium text-gray-900">{elevatorPreference['Preferred Type']}</p>
                        </div>
                      )}
                      {elevatorPreference['Brand Expectation'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Brand Expectation</p>
                          <p className="font-medium text-gray-900">{elevatorPreference['Brand Expectation']}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Client Intent & Commercial */}
                {(clientIntent['Interest Level'] || clientIntent['Budget Discussion'] || clientIntent['Decision Timeline']) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoCheckmarkDone className="w-5 h-5 text-green-600" />
                      Client Intent & Commercial
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      {clientIntent['Interest Level'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Interest Level</p>
                          <p className="font-medium text-gray-900">{clientIntent['Interest Level']}</p>
                        </div>
                      )}
                      {clientIntent['Budget Discussion'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Budget Discussion</p>
                          <p className="font-medium text-gray-900">{clientIntent['Budget Discussion']}</p>
                        </div>
                      )}
                      {clientIntent['Decision Timeline'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Decision Timeline</p>
                          <p className="font-medium text-gray-900">{clientIntent['Decision Timeline']}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Next Action */}
                {(nextAction['Next Step'] || nextAction['Expected Timeline'] || nextAction['Next Follow-up']) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoCalendar className="w-5 h-5 text-green-600" />
                      Next Action
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      {nextAction['Next Step'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Next Step</p>
                          <p className="font-medium text-gray-900">{nextAction['Next Step']}</p>
                        </div>
                      )}
                      {nextAction['Expected Timeline'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Expected Timeline</p>
                          <p className="font-medium text-gray-900">{nextAction['Expected Timeline']}</p>
                        </div>
                      )}
                      {nextAction['Next Follow-up'] && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Next Follow-up</p>
                          <p className="font-medium text-gray-900">{nextAction['Next Follow-up']}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sales Owner */}
                {salesOwner['Sales Executive'] && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <IoPerson className="w-5 h-5 text-green-600" />
                      Sales Owner
                    </h3>
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Sales Executive</p>
                        <p className="font-medium text-gray-900">{salesOwner['Sales Executive']}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attachments Section */}
                {(() => {
                  const notes = selectedLead.notes || '';

                  // Parse attachments data from notes
                  let attachmentsData: { selfie: string | null; documents: Array<{ name: string; type: string; data: string }> } | null = null;
                  const attachmentsDataMatch = notes.match(/\[ATTACHMENTS_DATA\]\s*([\s\S]*?)\s*\[END_ATTACHMENTS_DATA\]/);

                  if (attachmentsDataMatch) {
                    try {
                      attachmentsData = JSON.parse(attachmentsDataMatch[1].trim());
                    } catch (e) {
                      console.error('Failed to parse attachments data:', e);
                    }
                  }

                  // Fallback: parse status from text
                  const attachmentsMatch = notes.match(/ATTACHMENTS:([\s\S]*?)(?=\n\n|\[ATTACHMENTS_DATA\]|$)/);
                  let selfieStatus = 'Not captured';
                  let documentsCount = 0;

                  if (attachmentsMatch) {
                    const attachmentsText = attachmentsMatch[1];
                    const selfieMatch = attachmentsText.match(/Selfie:\s*(.+)/);
                    const documentsMatch = attachmentsText.match(/Documents:\s*(\d+)/);

                    if (selfieMatch) {
                      selfieStatus = selfieMatch[1].trim();
                    }
                    if (documentsMatch) {
                      documentsCount = parseInt(documentsMatch[1]);
                    }
                  }

                  // Use parsed data if available
                  if (attachmentsData) {
                    if (attachmentsData.selfie) {
                      selfieStatus = 'Captured';
                    }
                    if (attachmentsData.documents && attachmentsData.documents.length > 0) {
                      documentsCount = attachmentsData.documents.length;
                    }
                  }

                  const hasAttachments = selfieStatus.toLowerCase().includes('captured') || documentsCount > 0;

                  return hasAttachments ? (
                    <div className="pb-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                        <IoCloudUpload className="w-5 h-5 text-green-600" />
                        Attachments
                      </h3>
                      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-gray-200 p-4 shadow-sm">
                        <div className="space-y-4">
                          {/* Selfie Display */}
                          {selfieStatus.toLowerCase().includes('captured') && attachmentsData?.selfie && (
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <IoCamera className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">Selfie</p>
                                    <p className="text-xs text-gray-600">Captured during meeting</p>
                                  </div>
                                  <div className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    ✓ Captured
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-100 group">
                                  <img
                                    src={attachmentsData.selfie}
                                    alt="Selfie"
                                    className="w-full h-auto max-h-96 object-contain mx-auto cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => setViewerItem({ type: 'image', src: attachmentsData.selfie!, name: 'Selfie' })}
                                    onError={(e) => {
                                      console.error("Selfie image failed to load");
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                  <button
                                    onClick={() => setViewerItem({ type: 'image', src: attachmentsData.selfie!, name: 'Selfie' })}
                                    className="absolute top-3 right-3 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                    title="View Selfie"
                                  >
                                    <IoEye className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Documents Display */}
                          {documentsCount > 0 && attachmentsData?.documents && attachmentsData.documents.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <IoDocumentText className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">Documents</p>
                                    <p className="text-xs text-gray-600">{documentsCount} file(s) uploaded</p>
                                  </div>
                                  <div className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    {documentsCount} File(s)
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {attachmentsData.documents.map((doc, index) => {
                                    const isPDF = doc.type === 'application/pdf' || doc.name.toLowerCase().endsWith('.pdf');
                                    const isImage = doc.type.startsWith('image/');

                                    return (
                                      <div key={index} className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:shadow-md transition-shadow group">
                                        {isImage ? (
                                          <div className="relative">
                                            <img
                                              src={doc.data}
                                              alt={doc.name}
                                              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                              onClick={() => setViewerItem({ type: 'image', src: doc.data, name: doc.name })}
                                              onError={(e) => {
                                                console.error("Document image failed to load:", doc.name);
                                                (e.target as HTMLImageElement).style.display = 'none';
                                              }}
                                            />
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full shadow-lg">
                                              Image
                                            </div>
                                            <button
                                              onClick={() => setViewerItem({ type: 'image', src: doc.data, name: doc.name })}
                                              className="absolute top-2 left-2 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
                                              title="View Image"
                                            >
                                              <IoEye className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="relative p-6 flex flex-col items-center justify-center min-h-[192px]">
                                            <IoDocumentText className="w-12 h-12 text-gray-400 mb-3" />
                                            <p className="text-sm font-medium text-gray-700 text-center break-words px-2">
                                              {doc.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                              {doc.type || 'File'}
                                            </p>
                                            <button
                                              onClick={() => {
                                                if (isPDF) {
                                                  setViewerItem({ type: 'pdf', src: doc.data, name: doc.name });
                                                } else {
                                                  // For non-PDF files, open in new tab
                                                  const link = document.createElement('a');
                                                  link.href = doc.data;
                                                  link.target = '_blank';
                                                  link.download = doc.name;
                                                  link.click();
                                                }
                                              }}
                                              className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100"
                                              title={isPDF ? "View PDF" : "Download File"}
                                            >
                                              <IoEye className="w-4 h-4" />
                                              {isPDF ? 'View PDF' : 'Download'}
                                            </button>
                                          </div>
                                        )}
                                        <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between">
                                          <p className="text-xs font-medium text-gray-900 truncate flex-1" title={doc.name}>
                                            {doc.name}
                                          </p>
                                          {!isImage && (
                                            <button
                                              onClick={() => {
                                                if (isPDF) {
                                                  setViewerItem({ type: 'pdf', src: doc.data, name: doc.name });
                                                } else {
                                                  const link = document.createElement('a');
                                                  link.href = doc.data;
                                                  link.target = '_blank';
                                                  link.download = doc.name;
                                                  link.click();
                                                }
                                              }}
                                              className="ml-2 p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
                                              title={isPDF ? "View PDF" : "Download File"}
                                            >
                                              <IoEye className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Fallback: Show status only if data not available */}
                          {(!attachmentsData || (!attachmentsData.selfie && (!attachmentsData.documents || attachmentsData.documents.length === 0))) && (
                            <>
                              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <IoCamera className="w-6 h-6 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">Selfie</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {selfieStatus.toLowerCase().includes('captured') ? 'Image captured during meeting' : 'No selfie available'}
                                    </p>
                                  </div>
                                </div>
                                <div className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${selfieStatus.toLowerCase().includes('captured')
                                  ? 'bg-green-100 text-green-700 border border-green-300'
                                  : 'bg-gray-100 text-gray-600 border border-gray-300'
                                  }`}>
                                  {selfieStatus.toLowerCase().includes('captured') ? '✓ Captured' : 'Not Available'}
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shadow-sm">
                                    <IoDocumentText className="w-6 h-6 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-gray-900">Documents</p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {documentsCount > 0 ? `${documentsCount} file(s) uploaded during meeting` : 'No documents uploaded'}
                                    </p>
                                  </div>
                                </div>
                                <div className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm ${documentsCount > 0
                                  ? 'bg-green-100 text-green-700 border border-green-300'
                                  : 'bg-gray-100 text-gray-600 border border-gray-300'
                                  }`}>
                                  {documentsCount > 0 ? `${documentsCount} File(s)` : 'None'}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Notes Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <IoDocumentText className="w-5 h-5 text-green-600" />
                      Notes & Follow-ups
                    </h3>
                  </div>

                  {/* Existing Notes */}
                  {selectedLead.notes ? (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4 mb-4 max-h-96 overflow-y-auto shadow-inner">
                      <div className="space-y-3">
                        {selectedLead.notes.split(/\n\n(?=\[|---)/).filter(Boolean).map((noteSection, index) => {
                          // Extract timestamp if present
                          const timestampMatch = noteSection.match(/^\[([^\]]+)\]/);
                          const timestamp = timestampMatch ? timestampMatch[1] : null;
                          let content = timestamp ? noteSection.replace(/^\[[^\]]+\]\s*/, '') : noteSection;

                          // Remove separator lines
                          content = content.replace(/^---\s*/gm, '');

                          // Split into lines for formatting
                          const lines = content.split('\n').filter(line => line.trim() || line === '');

                          return (
                            <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-green-500 shadow-sm hover:shadow-md transition-all">
                              {timestamp && (
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                                  <IoTime className="w-4 h-4 text-green-600" />
                                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{timestamp}</span>
                                </div>
                              )}
                              <div className="text-sm text-gray-800 leading-relaxed">
                                {lines.map((line, lineIndex) => {
                                  const trimmedLine = line.trim();

                                  // Skip empty lines (but keep spacing)
                                  if (!trimmedLine) {
                                    return <div key={lineIndex} className="h-2" />;
                                  }

                                  // Format section headers (ALL CAPS with colon)
                                  if (/^[A-Z][A-Z\s&:]+:$/.test(trimmedLine)) {
                                    return (
                                      <div key={lineIndex} className="mb-2 mt-3 first:mt-0">
                                        <h4 className="font-bold text-gray-900 text-base uppercase tracking-wide">{trimmedLine}</h4>
                                      </div>
                                    );
                                  }

                                  // Format bullet points
                                  if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•')) {
                                    const bulletContent = trimmedLine.replace(/^[-•]\s*/, '');
                                    return (
                                      <div key={lineIndex} className="ml-5 mb-1.5 flex items-start gap-2">
                                        <span className="text-green-600 font-bold mt-1 flex-shrink-0">•</span>
                                        <span className="flex-1">{bulletContent}</span>
                                      </div>
                                    );
                                  }

                                  // Format key-value pairs (with colon)
                                  if (trimmedLine.includes(':') && !trimmedLine.startsWith('http')) {
                                    const [key, ...valueParts] = trimmedLine.split(':');
                                    const value = valueParts.join(':').trim();
                                    if (key.length < 30 && value) {
                                      return (
                                        <div key={lineIndex} className="mb-1.5">
                                          <span className="font-semibold text-gray-700">{key.trim()}:</span>
                                          <span className="text-gray-800 ml-1">{value}</span>
                                        </div>
                                      );
                                    }
                                  }

                                  // Regular paragraph text
                                  return (
                                    <div key={lineIndex} className="mb-1.5 text-gray-800">
                                      {trimmedLine}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-6 mb-4 text-center">
                      <IoDocumentText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No notes yet. Add your first note below.</p>
                    </div>
                  )}

                  {/* Add New Note */}
                  <div className="space-y-3 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <IoDocumentText className="w-5 h-5 text-green-600" />
                      <label className="block text-sm font-semibold text-gray-900">
                        Add New Note
                      </label>
                    </div>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter call notes, meeting notes, or follow-up updates...&#10;&#10;Tip: Use bullet points (-) for lists and clear formatting for better readability."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none text-sm leading-relaxed"
                      rows={5}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        Note will be saved with timestamp automatically
                      </p>
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
                      >
                        <IoDocumentText className="w-4 h-4" />
                        Add Note
                      </button>
                    </div>
                  </div>
                </div>

                {/* Documents (view only — upload via Edit Lead) */}
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                    <IoDocumentText className="w-5 h-5 text-green-600" />
                    Documents
                  </h3>

                  {(selectedLead.documents?.length ?? 0) > 0 ? (
                    <div className="space-y-2">
                      {selectedLead.documents!.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <IoDocumentText className="w-5 h-5 text-green-600 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{doc.fileName}</p>
                              <p className="text-xs text-gray-500">
                                {doc.uploadedDate || "Uploaded"}
                                {doc.fileSize ? ` • ${(doc.fileSize / 1024).toFixed(1)} KB` : ""}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleLeadDocumentDownload(doc.id, doc.fileName)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                            title="Download"
                          >
                            <IoDownload className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <IoDocumentText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Use Edit Lead to upload plans, drawings, and enquiry documents.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Order Lost Reason Modal */}
      <Modal
        isOpen={isOrderLostModalOpen && leadForOrderLost !== null}
        onClose={() => {
          setIsOrderLostModalOpen(false);
          setLeadForOrderLost(null);
          setOrderLostReason("");
          setOrderLostReasonOther("");
        }}
        title="Order Lost - Reason"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Please select a reason for marking this lead as <span className="font-semibold text-red-600">Order Lost</span>.
          </p>

          <div className="space-y-2">
            {[
              "Price too high",
              "Competitor selected",
              "Budget issue",
              "Timeline mismatch",
              "No response / Not reachable",
              "No requirement",
              "Other",
            ].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="orderLostReason"
                  value={r}
                  checked={orderLostReason === r}
                  onChange={(e) => setOrderLostReason(e.target.value)}
                  className="w-4 h-4 text-red-600"
                />
                <span className="text-sm text-gray-800">{r}</span>
              </label>
            ))}
          </div>

          {orderLostReason === "Other" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Other reason *</label>
              <input
                value={orderLostReasonOther}
                onChange={(e) => setOrderLostReasonOther(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Type reason..."
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setIsOrderLostModalOpen(false);
                setLeadForOrderLost(null);
                setOrderLostReason("");
                setOrderLostReasonOther("");
              }}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                const lead = leadForOrderLost;
                if (!lead) return;
                const validLeadId = lead.id || (lead as any)._id;
                const selected = (orderLostReason || "").trim();
                const other = (orderLostReasonOther || "").trim();

                if (!selected) {
                  toast.error("Please select a reason.");
                  return;
                }
                if (selected === "Other" && !other) {
                  toast.error("Please type the other reason.");
                  return;
                }

                try {
                  await leadsAPI.update(validLeadId, {
                    stage: "Order Lost",
                    orderLostReason: selected,
                    orderLostReasonOther: selected === "Other" ? other : "",
                  });

                  setLeadList(leadList.map((l) => {
                    const currentId = l.id || (l as any)._id;
                    if (currentId !== validLeadId) return l;
                    return {
                      ...l,
                      id: validLeadId,
                      stage: "Order Lost",
                      orderLostReason: selected,
                      orderLostReasonOther: selected === "Other" ? other : "",
                    } as any;
                  }));

                  toast.success("Lead marked as Order Lost");
                  setIsOrderLostModalOpen(false);
                  setLeadForOrderLost(null);
                  setOrderLostReason("");
                  setOrderLostReasonOther("");
                } catch (err: any) {
                  console.error("Failed to update Order Lost reason:", err);
                  toast.error(err?.message || "Failed to update lead");
                }
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Meeting Verification Modal */}
      <Modal
        isOpen={isMeetingModalOpen && leadForMeeting !== null}
        onClose={() => {
          setIsMeetingModalOpen(false);
          setLeadForMeeting(null);
        }}
        title={leadForMeeting?.stage === "Meeting Scheduled" ? "Meeting Completion Report" : "Schedule Meeting"}
        size="lg"
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          {leadForMeeting && (leadForMeeting.stage === "New Lead" || leadForMeeting.stage === "Lead Contacted") ? (
            // --- SCHEDULING FORM (NEW) ---
            <div className="space-y-6">
              {/* 1. NEXT STEP IDENTIFIED */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Step Identified</h3>
                <div className="space-y-2">
                  {["Meeting to be Scheduled", "Site Visit Required", "Send Brochure", "Follow-up Call"].map((step) => (
                    <label key={step} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio" // Changed to radio as usually one next primary step, but could be checkbox if multiple allowed. Adhering to singular 'Next Step Identified'
                        name="nextStepIdentified"
                        value={step}
                        checked={meetingData.nextStepIdentified === step}
                        onChange={(e) => setMeetingData({ ...meetingData, nextStepIdentified: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{step}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. DATE AND TIME */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Date and Time</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time *</label>
                  <input
                    type="datetime-local"
                    value={meetingData.meetingDateTime}
                    onChange={(e) => setMeetingData({ ...meetingData, meetingDateTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 3. TIMELINE & FOLLOW-UP */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Follow-up</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Meeting / Visit Timeline</label>
                    <input
                      type="text"
                      value={meetingData.expectedTimeline}
                      onChange={(e) => setMeetingData({ ...meetingData, expectedTimeline: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Next Week, Within 2 days..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
                    <input
                      type="date"
                      value={meetingData.nextFollowUpDate}
                      onChange={(e) => setMeetingData({ ...meetingData, nextFollowUpDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 4. SALES OWNER CONFIRMATION */}
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SALES OWNER CONFIRMATION</h3> {/* Kept 9 as per request, likely to match other forms */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Executive Name *</label>
                    <input
                      type="text"
                      value={meetingData.salesExecutive}
                      onChange={(e) => setMeetingData({ ...meetingData, salesExecutive: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks / Notes</label>
                    <textarea
                      value={meetingData.meetingNotes} // Reusing meetingNotes for Remarks
                      onChange={(e) => setMeetingData({ ...meetingData, meetingNotes: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      placeholder="Enter remarks..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons for Scheduling */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleMeetingSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Schedule Meeting
                </button>
                <button
                  onClick={() => {
                    setIsMeetingModalOpen(false);
                    setLeadForMeeting(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // --- COMPLETION REPORT FORM (EXISTING) ---
            <div className="space-y-6">
              {/* 1. ACTUAL MEETING DETAILS */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actual Meeting Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Duration *</label>
                    <div className="space-y-2">
                      {["<30 mins", "30–60 mins", "60+ mins"].map((duration) => (
                        <label key={duration} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="meetingDuration"
                            value={duration}
                            checked={meetingData.meetingDuration === duration}
                            onChange={(e) => setMeetingData({ ...meetingData, meetingDuration: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{duration}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attendees Present (Actual) *</label>
                    <div className="space-y-2">
                      {["Client", "Spouse / Family", "Architect", "Builder / Contractor"].map((attendee) => (
                        <label key={attendee} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingData.attendeesPresent.includes(attendee)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMeetingData({ ...meetingData, attendeesPresent: [...meetingData.attendeesPresent, attendee] });
                              } else {
                                setMeetingData({ ...meetingData, attendeesPresent: meetingData.attendeesPresent.filter(a => a !== attendee) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{attendee}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SITE & TECHNICAL CONFIRMATION */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Site & Technical Confirmation (Post-Meeting)</h3>

                {/* Pit Status */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Pit Status</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pit Available?</label>
                      <div className="flex gap-4">
                        {["Yes", "No", "Can Be Provided"].map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="pitAvailable"
                              value={option}
                              checked={meetingData.pitAvailable === option}
                              onChange={(e) => setMeetingData({ ...meetingData, pitAvailable: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {meetingData.pitAvailable && meetingData.pitAvailable !== "No" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pit Depth Confirmed:</label>
                        <div className="space-y-2">
                          {["<300 mm", "300–600 mm", "600–1000 mm"].map((depth) => (
                            <label key={depth} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="radio"
                                name="pitDepthConfirmed"
                                value={depth}
                                checked={meetingData.pitDepthConfirmed === depth}
                                onChange={(e) => setMeetingData({ ...meetingData, pitDepthConfirmed: e.target.value })}
                                className="w-4 h-4 text-blue-600"
                              />
                              <span className="text-sm text-gray-700">{depth}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shaft Status */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Shaft Status</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shaft Status:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Existing", "Under Construction", "To Be Constructed", "Not Feasible"].map((status) => (
                          <label key={status} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="shaftStatus"
                              value={status}
                              checked={meetingData.shaftStatus === status}
                              onChange={(e) => setMeetingData({ ...meetingData, shaftStatus: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    {meetingData.shaftStatus && meetingData.shaftStatus !== "Not Feasible" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Shaft Type:</label>
                          <div className="flex gap-4">
                            {["RCC", "Block", "Steel"].map((type) => (
                              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="radio"
                                  name="shaftType"
                                  value={type}
                                  checked={meetingData.shaftType === type}
                                  onChange={(e) => setMeetingData({ ...meetingData, shaftType: e.target.value })}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-sm text-gray-700">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Approx Shaft Size (Confirmed):</label>
                          <input
                            type="text"
                            value={meetingData.shaftSize}
                            onChange={(e) => setMeetingData({ ...meetingData, shaftSize: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="L × W in mm (e.g., 2000 × 1500)"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Machine Room Status */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Machine Room Status</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Machine Room:</label>
                    <div className="space-y-2">
                      {["Available", "Not Available (MRL)", "Can Be Constructed"].map((option) => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="machineRoom"
                            value={option}
                            checked={meetingData.machineRoom === option}
                            onChange={(e) => setMeetingData({ ...meetingData, machineRoom: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. SOLUTION & PRODUCT FINALIZATION */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Solution & Product Finalization (Initial)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Elevator Type:</label>
                    <div className="space-y-2">
                      {["Traction (MRL)", "Hydraulic", "Pneumatic"].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="proposedElevatorType"
                            value={type}
                            checked={meetingData.proposedElevatorType === type}
                            onChange={(e) => setMeetingData({ ...meetingData, proposedElevatorType: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floors Finalized:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["G+1", "G+2", "G+3", "G+4"].map((floor) => (
                        <label key={floor} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingData.floorsFinalized.includes(floor)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMeetingData({ ...meetingData, floorsFinalized: [...meetingData.floorsFinalized, floor] });
                              } else {
                                setMeetingData({ ...meetingData, floorsFinalized: meetingData.floorsFinalized.filter(f => f !== floor) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{floor}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity Discussed:</label>
                    <div className="space-y-2">
                      {["250 kg", "300 kg", "400 kg"].map((capacity) => (
                        <label key={capacity} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="capacityDiscussed"
                            value={capacity}
                            checked={meetingData.capacityDiscussed === capacity}
                            onChange={(e) => setMeetingData({ ...meetingData, capacityDiscussed: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{capacity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements:</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Senior Citizen Friendly", "Wheelchair Access", "Premium Interiors", "Noise Reduction"].map((req) => (
                        <label key={req} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={meetingData.specialRequirements.includes(req)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMeetingData({ ...meetingData, specialRequirements: [...meetingData.specialRequirements, req] });
                              } else {
                                setMeetingData({ ...meetingData, specialRequirements: meetingData.specialRequirements.filter(r => r !== req) });
                              }
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{req}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. COMMERCIAL DISCUSSION SUMMARY */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Commercial Discussion Summary</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Alignment:</label>
                    <div className="space-y-2">
                      {["Within Expected Range", "Slightly Higher", "Budget Sensitive"].map((alignment) => (
                        <label key={alignment} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="budgetAlignment"
                            value={alignment}
                            checked={meetingData.budgetAlignment === alignment}
                            onChange={(e) => setMeetingData({ ...meetingData, budgetAlignment: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{alignment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Approx Budget Indicated:</label>
                    <div className="space-y-2">
                      {["Not Shared", "₹10–15L", "₹15–20L", "₹20L+"].map((budget) => (
                        <label key={budget} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="approxBudgetIndicated"
                            value={budget}
                            checked={meetingData.approxBudgetIndicated === budget}
                            onChange={(e) => setMeetingData({ ...meetingData, approxBudgetIndicated: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{budget}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. CLIENT RESPONSE & QUALITY */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Response & Quality</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Interest Level:</label>
                    <div className="space-y-2">
                      {["Very High", "High", "Medium", "Low"].map((level) => (
                        <label key={level} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="clientInterestLevel"
                            value={level}
                            checked={meetingData.clientInterestLevel === level}
                            onChange={(e) => setMeetingData({ ...meetingData, clientInterestLevel: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Decision Maker Identified:</label>
                    <div className="flex gap-4">
                      {["Yes", "No"].map((option) => (
                        <label key={option} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="decisionMakerIdentified"
                            value={option}
                            checked={meetingData.decisionMakerIdentified === option}
                            onChange={(e) => setMeetingData({ ...meetingData, decisionMakerIdentified: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Decision Timeline:</label>
                    <div className="space-y-2">
                      {["Immediate", "1–2 Weeks", "1–3 Months"].map((timeline) => (
                        <label key={timeline} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="expectedDecisionTimeline"
                            value={timeline}
                            checked={meetingData.expectedDecisionTimeline === timeline}
                            onChange={(e) => setMeetingData({ ...meetingData, expectedDecisionTimeline: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{timeline}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. NEXT ACTION */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Action (Mandatory)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Next Step *</label>
                    <div className="space-y-2">
                      {["Prepare Quotation", "Revise Layout / Feasibility", "Second Meeting Required", "Follow-up Call"].map((step) => (
                        <label key={step} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="nextStep"
                            value={step}
                            checked={meetingData.nextStep === step}
                            onChange={(e) => setMeetingData({ ...meetingData, nextStep: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{step}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Quotation Date:</label>
                      <input
                        type="date"
                        value={meetingData.expectedQuotationDate}
                        onChange={(e) => setMeetingData({ ...meetingData, expectedQuotationDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date *</label>
                      <input
                        type="date"
                        value={meetingData.nextFollowUpDate}
                        onChange={(e) => setMeetingData({ ...meetingData, nextFollowUpDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. MEETING NOTES */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Notes</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Summary / Notes:</label>
                  <textarea
                    value={meetingData.meetingNotes}
                    onChange={(e) => setMeetingData({ ...meetingData, meetingNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    placeholder="Enter meeting summary and notes..."
                  />
                </div>
              </div>

              {/* 8. TAKE SELFIE */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">TAKE SELFIE</h3>
                {!isCameraOpen && !selfieImage && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <IoCamera className="w-5 h-5" />
                    Open Camera
                  </button>
                )}

                {isCameraOpen && (
                  <div className="space-y-3">
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg border-2 border-gray-300"
                        style={{ maxHeight: "400px" }}
                      />
                      <canvas ref={canvasRef} className="hidden" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={captureSelfie}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <IoCamera className="w-5 h-5" />
                        Capture
                      </button>
                      <button
                        type="button"
                        onClick={stopCamera}
                        className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {selfieImage && (
                  <div className="space-y-3">
                    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <img
                        src={selfieImage}
                        alt="Selfie"
                        className="w-full rounded-lg"
                        style={{ maxHeight: "400px", objectFit: "contain", display: "block" }}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full shadow-lg">
                          ✓ Captured
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelfieImage(null);
                        startCamera();
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Retake Selfie
                    </button>
                  </div>
                )}
              </div>

              {/* 9. UPLOAD DOCUMENTS */}
              <div className="pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">UPLOAD DOCUMENTS</h3>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload-meeting"
                    />
                    <label
                      htmlFor="document-upload-meeting"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <IoCloudUpload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload documents (Multiple files allowed)
                      </span>
                      <span className="text-xs text-gray-500">
                        PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (Max 10MB per file)
                      </span>
                    </label>
                  </div>

                  {uploadedDocuments.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        Uploaded Documents ({uploadedDocuments.length}):
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uploadedDocuments.map((file, index) => {
                          const isImage = file.type.startsWith('image/');
                          const preview = documentPreviews[index];

                          return (
                            <div
                              key={index}
                              className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                              {isImage && preview ? (
                                <div className="relative">
                                  <img
                                    src={preview}
                                    alt={file.name}
                                    className="w-full h-48 object-cover"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <button
                                      type="button"
                                      onClick={() => removeDocument(index)}
                                      className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                                      title="Remove"
                                    >
                                      <IoClose className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <div className="p-2 bg-white border-t border-gray-200">
                                    <p className="text-xs text-gray-600 truncate font-medium">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-4">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <IoDocumentText className="w-6 h-6 text-blue-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                        <p className="text-xs text-gray-400 mt-1">{file.type || 'Unknown type'}</p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeDocument(index)}
                                      className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Remove"
                                    >
                                      <IoClose className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons (Completion) */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={handleMeetingSubmit}
                  disabled={!meetingData.meetingDuration || meetingData.attendeesPresent.length === 0 || !meetingData.nextStep || !meetingData.nextFollowUpDate}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${meetingData.meetingDuration && meetingData.attendeesPresent.length > 0 && meetingData.nextStep && meetingData.nextFollowUpDate
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                >
                  Complete Meeting
                </button>
                <button
                  onClick={() => {
                    setIsMeetingModalOpen(false);
                    setLeadForMeeting(null);
                    stopCamera();
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )} {/* End Condition */}
        </div>
      </Modal>

      {/* Quotation Confirmation Modal */}
      <Modal
        isOpen={isQuotationModalOpen && leadForQuotation !== null}
        onClose={() => {
          setIsQuotationModalOpen(false);
          setLeadForQuotation(null);
        }}
        title="Quotation Confirmation - Quotation Sent"
        size="xl"
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2 pb-6">
          <div className="space-y-6">
            {/* 1. QUOTATION CONFIRMATION */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔹 1. QUOTATION CONFIRMATION (MANDATORY)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Has the quotation been prepared and sent to the client? *
                </label>
                <div className="space-y-2">
                  {["Yes", "No"].map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="quotationPrepared"
                        value={option}
                        checked={quotationData.quotationPrepared === option}
                        onChange={(e) => setQuotationData({ ...quotationData, quotationPrepared: e.target.value })}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. QUOTATION DETAILS */}
            {quotationData.quotationPrepared === "Yes" && (
              <>
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">QUOTATION DETAILS</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Number</label>
                      <input
                        type="text"
                        value={quotationData.quotationNumber}
                        onChange={(e) => setQuotationData({ ...quotationData, quotationNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quotation number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date</label>
                        <input
                          type="date"
                          value={quotationData.quotationDate}
                          onChange={(e) => setQuotationData({ ...quotationData, quotationDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Validity</label>
                        <select
                          value={quotationData.quotationValidity}
                          onChange={(e) => setQuotationData({ ...quotationData, quotationValidity: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select validity</option>
                          <option value="7 Days">7 Days</option>
                          <option value="15 Days">15 Days</option>
                          <option value="30 Days">30 Days</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Quotation Value (₹)</label>
                      <input
                        type="number"
                        value={quotationData.totalQuotationValue}
                        onChange={(e) => setQuotationData({ ...quotationData, totalQuotationValue: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter quotation value"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                      <div className="space-y-2">
                        {["Standard", "Customized"].map((term) => (
                          <label key={term} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="paymentTerms"
                              value={term}
                              checked={quotationData.paymentTerms === term}
                              onChange={(e) => setQuotationData({ ...quotationData, paymentTerms: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{term}</span>
                          </label>
                        ))}
                      </div>
                      {quotationData.paymentTerms === "Customized" && (
                        <input
                          type="text"
                          value={quotationData.paymentTermsCustom}
                          onChange={(e) => setQuotationData({ ...quotationData, paymentTermsCustom: e.target.value })}
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Specify custom payment terms"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. PRODUCT & TECHNICAL SUMMARY */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">PRODUCT & TECHNICAL SUMMARY</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Elevator Type Quoted</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Traction (MRL)", "Hydraulic", "Pneumatic"].map((type) => (
                          <label key={type} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="elevatorTypeQuoted"
                              value={type}
                              checked={quotationData.elevatorTypeQuoted === type}
                              onChange={(e) => setQuotationData({ ...quotationData, elevatorTypeQuoted: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Floors</label>
                      <div className="grid grid-cols-4 gap-2">
                        {["G+1", "G+2", "G+3", "G+4"].map((floor) => (
                          <label key={floor} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={quotationData.numberOfFloors.includes(floor)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setQuotationData({ ...quotationData, numberOfFloors: [...quotationData.numberOfFloors, floor] });
                                } else {
                                  setQuotationData({ ...quotationData, numberOfFloors: quotationData.numberOfFloors.filter(f => f !== floor) });
                                }
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{floor}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rated Capacity</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["250 kg", "300 kg", "400 kg"].map((capacity) => (
                          <label key={capacity} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="ratedCapacity"
                              value={capacity}
                              checked={quotationData.ratedCapacity === capacity}
                              onChange={(e) => setQuotationData({ ...quotationData, ratedCapacity: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{capacity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Speed (if applicable)</label>
                      <input
                        type="text"
                        value={quotationData.speed}
                        onChange={(e) => setQuotationData({ ...quotationData, speed: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter speed"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. SCOPE OF SUPPLY */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SCOPE OF SUPPLY (CHECK ALL APPLICABLE)</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Elevator equipment supply",
                      "Installation & commissioning",
                      "Standard interiors",
                      "Custom / premium interiors",
                      "Civil interface support",
                      "Electrical interface support",
                      "Testing & handover"
                    ].map((item) => (
                      <label key={item} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={quotationData.scopeOfSupply.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setQuotationData({ ...quotationData, scopeOfSupply: [...quotationData.scopeOfSupply, item] });
                            } else {
                              setQuotationData({ ...quotationData, scopeOfSupply: quotationData.scopeOfSupply.filter(s => s !== item) });
                            }
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 5. DELIVERY & TIMELINES */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">DELIVERY & TIMELINES</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturing / Delivery Lead Time</label>
                      <div className="space-y-2">
                        {["30–45 Days", "45–60 Days", "60–90 Days"].map((time) => (
                          <label key={time} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="manufacturingLeadTime"
                              value={time}
                              checked={quotationData.manufacturingLeadTime === time}
                              onChange={(e) => setQuotationData({ ...quotationData, manufacturingLeadTime: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{time}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Installation Duration</label>
                      <div className="space-y-2">
                        {["7–10 Days", "10–15 Days"].map((duration) => (
                          <label key={duration} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="installationDuration"
                              value={duration}
                              checked={quotationData.installationDuration === duration}
                              onChange={(e) => setQuotationData({ ...quotationData, installationDuration: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{duration}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. CLIENT COMMUNICATION DETAILS */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">CLIENT COMMUNICATION DETAILS</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quotation Sent Via</label>
                      <div className="grid grid-cols-2 gap-2">
                        {["Email", "WhatsApp"].map((method) => (
                          <label key={method} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={quotationData.quotationSentVia.includes(method)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setQuotationData({ ...quotationData, quotationSentVia: [...quotationData.quotationSentVia, method] });
                                } else {
                                  setQuotationData({ ...quotationData, quotationSentVia: quotationData.quotationSentVia.filter(m => m !== method) });
                                }
                              }}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{method}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Acknowledgement Received?</label>
                      <div className="flex gap-4">
                        {["Yes", "No"].map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="clientAcknowledgement"
                              value={option}
                              checked={quotationData.clientAcknowledgement === option}
                              onChange={(e) => setQuotationData({ ...quotationData, clientAcknowledgement: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client Initial Feedback</label>
                      <div className="space-y-2">
                        {["Positive", "Needs Clarification", "Negotiation Expected"].map((feedback) => (
                          <label key={feedback} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="clientInitialFeedback"
                              value={feedback}
                              checked={quotationData.clientInitialFeedback === feedback}
                              onChange={(e) => setQuotationData({ ...quotationData, clientInitialFeedback: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{feedback}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. COMMERCIAL POSITIONING */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">COMMERCIAL POSITIONING</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Status</label>
                      <div className="space-y-2">
                        {["As per discussion", "Revised after meeting", "Special approval taken"].map((status) => (
                          <label key={status} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="pricingStatus"
                              value={status}
                              checked={quotationData.pricingStatus === status}
                              onChange={(e) => setQuotationData({ ...quotationData, pricingStatus: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount Applied</label>
                      <div className="space-y-2">
                        {["No", "Yes"].map((option) => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="discountApplied"
                              value={option}
                              checked={quotationData.discountApplied === option}
                              onChange={(e) => setQuotationData({ ...quotationData, discountApplied: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                      {quotationData.discountApplied === "Yes" && (
                        <input
                          type="text"
                          value={quotationData.discountAmount}
                          onChange={(e) => setQuotationData({ ...quotationData, discountAmount: e.target.value })}
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter discount amount (₹)"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Manager Approval Reference (if any)</label>
                      <input
                        type="text"
                        value={quotationData.managerApprovalReference}
                        onChange={(e) => setQuotationData({ ...quotationData, managerApprovalReference: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter approval reference"
                      />
                    </div>
                  </div>
                </div>

                {/* 8. NEXT ACTION */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">NEXT ACTION (MANDATORY)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Next Step</label>
                      <div className="space-y-2">
                        {["Follow-up Call", "Price Discussion / Negotiation", "Manager Deliberation", "Client Approval Awaited"].map((step) => (
                          <label key={step} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="nextStep"
                              value={step}
                              checked={quotationData.nextStep === step}
                              onChange={(e) => setQuotationData({ ...quotationData, nextStep: e.target.value })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{step}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
                      <input
                        type="date"
                        value={quotationData.nextFollowUpDate}
                        onChange={(e) => setQuotationData({ ...quotationData, nextFollowUpDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 9. SALES OWNER CONFIRMATION */}
                <div className="pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SALES OWNER CONFIRMATION</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sales Executive Name *
                      </label>
                      <input
                        type="text"
                        value={quotationData.salesExecutiveName}
                        onChange={(e) => setQuotationData({ ...quotationData, salesExecutiveName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter sales executive name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remarks / Notes
                      </label>
                      <textarea
                        value={quotationData.remarks}
                        onChange={(e) => setQuotationData({ ...quotationData, remarks: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={5}
                        placeholder="Enter remarks or notes..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={handleQuotationSubmit}
                disabled={quotationData.quotationPrepared !== "Yes"}
                className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${quotationData.quotationPrepared === "Yes"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
              >
                Submit Quotation
              </button>
              <button
                onClick={() => {
                  setIsQuotationModalOpen(false);
                  setLeadForQuotation(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Manager Deliberation Modal */}
      <Modal
        isOpen={isManagerDeliberationModalOpen && leadForDeliberation !== null}
        onClose={() => {
          setIsManagerDeliberationModalOpen(false);
          setLeadForDeliberation(null);
        }}
        title="Manager Deliberation"
        size="lg"
      >
        <div className="max-h-[80vh] overflow-y-auto pr-2">
          <div className="space-y-6">
            {/* 1. DELIBERATION TRIGGER */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DELIBERATION TRIGGER (MANDATORY)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Manager Deliberation *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Discount approval required",
                    "Special pricing / premium offer",
                    "Technical deviation from standard",
                    "Client negotiation requested",
                    "High-value order",
                    "Custom scope / special terms"
                  ].map((reason) => (
                    <label key={reason} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliberationData.deliberationReasons.includes(reason)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDeliberationData({ ...deliberationData, deliberationReasons: [...deliberationData.deliberationReasons, reason] });
                          } else {
                            setDeliberationData({ ...deliberationData, deliberationReasons: deliberationData.deliberationReasons.filter(r => r !== reason) });
                          }
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. QUOTATION SUMMARY */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">QUOTATION SUMMARY (AUTO / CONFIRM)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Number</label>
                  <input
                    type="text"
                    value={deliberationData.quotationNumber}
                    onChange={(e) => setDeliberationData({ ...deliberationData, quotationNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Date</label>
                  <input
                    type="date"
                    value={deliberationData.quotationDate}
                    onChange={(e) => setDeliberationData({ ...deliberationData, quotationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Value (₹)</label>
                  <input
                    type="number"
                    value={deliberationData.quotationValue}
                    onChange={(e) => setDeliberationData({ ...deliberationData, quotationValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quotation Validity (Days)</label>
                  <input
                    type="number"
                    value={deliberationData.quotationValidity}
                    onChange={(e) => setDeliberationData({ ...deliberationData, quotationValidity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input
                    type="text"
                    value={deliberationData.clientName}
                    onChange={(e) => setDeliberationData({ ...deliberationData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Location (State)</label>
                  <select
                    value={deliberationData.projectLocation}
                    onChange={(e) => setDeliberationData({ ...deliberationData, projectLocation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select State</option>
                    {(availableStates.length > 0 ? availableStates : indianStates).map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. TECHNICAL OVERVIEW */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">TECHNICAL OVERVIEW (FOR MANAGER)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Elevator Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Traction (MRL)", "Hydraulic", "Pneumatic"].map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="elevatorType"
                          value={type}
                          checked={deliberationData.elevatorType === type}
                          onChange={(e) => setDeliberationData({ ...deliberationData, elevatorType: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floors</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["G+1", "G+2", "G+3", "G+4"].map((floor) => (
                      <label key={floor} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deliberationData.floors.includes(floor)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDeliberationData({ ...deliberationData, floors: [...deliberationData.floors, floor] });
                            } else {
                              setDeliberationData({ ...deliberationData, floors: deliberationData.floors.filter(f => f !== floor) });
                            }
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{floor}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["250 kg", "300 kg", "400 kg"].map((cap) => (
                      <label key={cap} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="capacity"
                          value={cap}
                          checked={deliberationData.capacity === cap}
                          onChange={(e) => setDeliberationData({ ...deliberationData, capacity: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{cap}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pit / Shaft / Machine Room Status</label>
                  <div className="space-y-2">
                    {["Standard", "Acceptable with modifications", "Risk / Special attention required"].map((status) => (
                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="pitShaftStatus"
                          value={status}
                          checked={deliberationData.pitShaftStatus === status}
                          onChange={(e) => setDeliberationData({ ...deliberationData, pitShaftStatus: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. COMMERCIAL DETAILS */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">COMMERCIAL DETAILS</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Standard Price (₹)</label>
                    <input
                      type="number"
                      value={deliberationData.standardPrice}
                      onChange={(e) => setDeliberationData({ ...deliberationData, standardPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Price (₹)</label>
                    <input
                      type="number"
                      value={deliberationData.quotedPrice}
                      onChange={(e) => setDeliberationData({ ...deliberationData, quotedPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Requested</label>
                  <div className="space-y-2">
                    {["No", "Yes"].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="discountRequested"
                          value={option}
                          checked={deliberationData.discountRequested === option}
                          onChange={(e) => setDeliberationData({ ...deliberationData, discountRequested: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  {deliberationData.discountRequested === "Yes" && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <input
                        type="text"
                        value={deliberationData.discountAmount}
                        onChange={(e) => setDeliberationData({ ...deliberationData, discountAmount: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Discount Amount (₹)"
                      />
                      <input
                        type="text"
                        value={deliberationData.discountPercent}
                        onChange={(e) => setDeliberationData({ ...deliberationData, discountPercent: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Discount %"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Gross Margin</label>
                  <div className="space-y-2">
                    {["As per policy", "Below policy (justify below)"].map((margin) => (
                      <label key={margin} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="expectedGrossMargin"
                          value={margin}
                          checked={deliberationData.expectedGrossMargin === margin}
                          onChange={(e) => setDeliberationData({ ...deliberationData, expectedGrossMargin: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{margin}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. CLIENT POSITION & NEGOTIATION STATUS */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔹 5. CLIENT POSITION & NEGOTIATION STATUS</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Feedback on Quotation</label>
                  <div className="space-y-2">
                    {["Positive", "Negotiation Ongoing", "Price Sensitive", "Awaiting Response"].map((feedback) => (
                      <label key={feedback} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="clientFeedback"
                          value={feedback}
                          checked={deliberationData.clientFeedback === feedback}
                          onChange={(e) => setDeliberationData({ ...deliberationData, clientFeedback: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{feedback}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competitor Presence</label>
                  <div className="flex gap-4">
                    {["Yes", "No"].map((option) => (
                      <label key={option} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="competitorPresence"
                          value={option}
                          checked={deliberationData.competitorPresence === option}
                          onChange={(e) => setDeliberationData({ ...deliberationData, competitorPresence: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                  {deliberationData.competitorPresence === "Yes" && (
                    <input
                      type="text"
                      value={deliberationData.competitorBrand}
                      onChange={(e) => setDeliberationData({ ...deliberationData, competitorBrand: e.target.value })}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brand (if known)"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 6. SALES JUSTIFICATION */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SALES JUSTIFICATION (MANDATORY)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Justification for Approval / Revision *
                </label>
                <textarea
                  value={deliberationData.salesJustification}
                  onChange={(e) => setDeliberationData({ ...deliberationData, salesJustification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={5}
                  placeholder="Why this pricing or deviation is required..."
                />
              </div>
            </div>

            {/* 7. MANAGER DECISION */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">MANAGER DECISION (MANAGER ONLY)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status</label>
                  <div className="space-y-2">
                    {["Approved as Quoted", "Approved with Revision", "Rejected"].map((status) => (
                      <label key={status} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="approvalStatus"
                          value={status}
                          checked={deliberationData.approvalStatus === status}
                          onChange={(e) => setDeliberationData({ ...deliberationData, approvalStatus: e.target.value })}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Approved Final Value (₹)</label>
                  <input
                    type="number"
                    value={deliberationData.approvedFinalValue}
                    onChange={(e) => setDeliberationData({ ...deliberationData, approvedFinalValue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter final approved value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Conditions / Remarks</label>
                  <textarea
                    value={deliberationData.specialConditions}
                    onChange={(e) => setDeliberationData({ ...deliberationData, specialConditions: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                    placeholder="Enter special conditions or remarks..."
                  />
                </div>
              </div>
            </div>

            {/* 8. NEXT ACTION */}
            <div className="pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">NEXT ACTION (AUTO / SELECT)</h3>
              <div className="space-y-4">
                {deliberationData.approvalStatus === "Approved as Quoted" || deliberationData.approvalStatus === "Approved with Revision" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">If Approved</label>
                    <div className="space-y-2">
                      {["Share revised quotation with client", "Await client confirmation"].map((action) => (
                        <label key={action} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="nextActionIfApproved"
                            value={action}
                            checked={deliberationData.nextActionIfApproved === action}
                            onChange={(e) => setDeliberationData({ ...deliberationData, nextActionIfApproved: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{action}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : deliberationData.approvalStatus === "Rejected" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">If Rejected</label>
                    <div className="space-y-2">
                      {["Revise quotation", "Close as Lost"].map((action) => (
                        <label key={action} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="nextActionIfRejected"
                            value={action}
                            checked={deliberationData.nextActionIfRejected === action}
                            onChange={(e) => setDeliberationData({ ...deliberationData, nextActionIfRejected: e.target.value })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-gray-700">{action}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={deliberationData.nextFollowUpDate}
                    onChange={(e) => setDeliberationData({ ...deliberationData, nextFollowUpDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={handleDeliberationSubmit}
              disabled={deliberationData.deliberationReasons.length === 0 || !deliberationData.salesJustification}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${deliberationData.deliberationReasons.length > 0 && deliberationData.salesJustification
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
            >
              Submit Deliberation
            </button>
            <button
              onClick={() => {
                setIsManagerDeliberationModalOpen(false);
                setLeadForDeliberation(null);
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal - Dark Theme */}
      {isDeleteModalOpen && leadToDelete && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setLeadToDelete(null);
            }}
          />

          {/* Dark Theme Card - Exact match to provided design */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="group select-none w-[250px] flex flex-col p-4 relative items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <div className="text-center p-3 flex-auto justify-center">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <h2 className="text-xl font-bold py-4 text-gray-200">Are you sure?</h2>
                  <p className="font-bold text-sm text-gray-500 px-2">
                    Do you really want to continue ? This process cannot be undone
                  </p>
                </div>
                <div className="p-2 mt-2 text-center space-x-1 md:block">
                  <button
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setLeadToDelete(null);
                    }}
                    className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="bg-red-500 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        title={`Delete ${selectedLeadIds.size} Lead(s)?`}
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500">
              You are about to delete <span className="font-semibold text-gray-900">{selectedLeadIds.size}</span> lead(s). This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsBulkDeleteModalOpen(false)}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <IoCloseCircle className="w-4 h-4" />
                  Delete All
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Contact Report Modal */}
      <ContactReportModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleContactReportSubmit}
        leadName={leadForContact?.name}
      />

      {/* Bulk Reassign Modal — transfer all leads from one user to another */}
      <Modal
        isOpen={canManageAssignments && isBulkReassignModalOpen}
        onClose={() => {
          if (bulkReassigning) return;
          setIsBulkReassignModalOpen(false);
          setBulkReassignFromUserId("");
          setBulkReassignToUserId("");
        }}
        title="Bulk Reassign Leads"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Move all leads from one BDM to another. For example, transfer all of ABC&apos;s leads to XYZ in one step.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From (current owner)</label>
            <select
              value={bulkReassignFromUserId}
              onChange={(e) => setBulkReassignFromUserId(e.target.value)}
              disabled={bulkReassigning}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select user...</option>
              {users
                .filter((u: any) => (u?.role || "") !== "Admin")
                .map((u: any) => (
                  <option key={u.id || u._id} value={u.id || u._id}>
                    {u.name || u.email} ({u.role})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To (new owner)</label>
            <select
              value={bulkReassignToUserId}
              onChange={(e) => setBulkReassignToUserId(e.target.value)}
              disabled={bulkReassigning}
              className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select user...</option>
              {users
                .filter((u: any) => (u?.role || "") !== "Admin")
                .filter((u: any) => (u.id || u._id) !== bulkReassignFromUserId)
                .map((u: any) => (
                  <option key={u.id || u._id} value={u.id || u._id}>
                    {u.name || u.email} ({u.role})
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsBulkReassignModalOpen(false);
                setBulkReassignFromUserId("");
                setBulkReassignToUserId("");
              }}
              disabled={bulkReassigning}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleBulkReassign}
              disabled={bulkReassigning || !bulkReassignFromUserId || !bulkReassignToUserId}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkReassigning ? "Reassigning..." : "Reassign All Leads"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Lead Modal - Admin excluded (admins see all leads) */}
      <Modal
        isOpen={canManageAssignments && isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setUserSearchTerm("");
        }}
        title={`Assign ${selectedLeadIds.size} Lead(s)`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Choose a user to assign the selected leads to.</p>
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {users
              .filter((user) => user.role !== "Admin")
              .filter((user) =>
                user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
              )
              .map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleAssignLeads(user.id, user.name)}
                  disabled={assigning}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">{user.role}</p>
                    </div>
                    {assigning && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    )}
                  </div>
                </button>
              ))}
            {users
              .filter((user) => user.role !== "Admin")
              .filter((user) =>
                user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(userSearchTerm.toLowerCase())
              ).length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  No users found
                </div>
              )}
          </div>
        </div>
      </Modal>

      {/* Image/PDF Viewer Modal */}
      <Modal
        isOpen={viewerItem !== null}
        onClose={() => setViewerItem(null)}
        title={viewerItem?.name || 'Viewer'}
        size="xl"
      >
        {viewerItem && (
          <div className="space-y-4">
            {viewerItem.type === 'image' ? (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={viewerItem.src}
                  alt={viewerItem.name}
                  className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                  onError={(e) => {
                    console.error("Image failed to load in viewer");
                    toast.error("Failed to load image");
                    setViewerItem(null);
                  }}
                />
              </div>
            ) : (
              <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ minHeight: '600px' }}>
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <a
                    href={viewerItem.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      const newWindow = window.open();
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head><title>${viewerItem.name}</title></head>
                            <body style="margin:0; padding:0;">
                              <embed src="${viewerItem.src}" type="application/pdf" width="100%" height="100%" style="position:absolute; top:0; left:0; width:100%; height:100vh;" />
                            </body>
                          </html>
                        `);
                      }
                    }}
                  >
                    <IoEye className="w-4 h-4" />
                    Open in New Tab
                  </a>
                </div>
                <iframe
                  src={`${viewerItem.src}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full"
                  style={{ minHeight: '600px', border: 'none' }}
                  title={viewerItem.name}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 font-medium">{viewerItem.name}</p>
              <button
                onClick={() => setViewerItem(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <IoClose className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}