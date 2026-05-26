// Get API URL from environment or use default
const getApiBaseUrl = (): string => {
  // Check for environment variable first
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    // Check if we're in browser (client-side)
    if (typeof window !== 'undefined') {
      // If on localhost, use local backend
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        apiUrl = "http://localhost:5000/api";
      } else {
        // For production without env var, log warning
        console.warn("NEXT_PUBLIC_API_URL is not set. Using default localhost. Please configure it in your environment variables.");
        apiUrl = "http://localhost:5000/api";
      }
    } else {
      // Default fallback (for server-side or when env var not set)
      apiUrl = "http://localhost:5000/api";
    }
  }
  
  // Clean up the URL - fix common typos
  apiUrl = apiUrl.trim().replace(/\/+$/, '');
  // Fix http// or https// to http:// or https://
  apiUrl = apiUrl.replace(/^http\/\//, 'http://').replace(/^https\/\//, 'https://');
  // Ensure it starts with http:// or https://
  if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
    apiUrl = `http://${apiUrl}`;
  }
  
  return apiUrl;
};

const API_BASE_URL = getApiBaseUrl();

async function fetchAPI(endpoint: string, options?: RequestInit) {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };
    
    if (token) {
      (headers as any)["Authorization"] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText || "Unknown error";

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.details) {
          errorMessage = errorData.details;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else {
          errorMessage = errorText || errorMessage;
        }
      } catch {
        if (errorText && errorText.length > 0) {
          errorMessage = errorText.length > 200 ? errorText.substring(0, 200) + "..." : errorText;
        }
      }

      // User-friendly messages for auth/permission; attach status for callers
      if (response.status === 401) {
        errorMessage = "Please log in again.";
      } else if (response.status === 403) {
        errorMessage = "You don't have access.";
      }

      const err = new Error(errorMessage) as Error & { status?: number };
      err.status = response.status;
      throw err;
    }

    return response.json();
  } catch (error: any) {
    // Preserve status if already set (e.g. 401/403 from above)
    if (error.status !== undefined) {
      throw error;
    }
    // Network/connection errors: generic message only (no dev instructions)
    if (error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED') || error.message?.includes('NetworkError')) {
      throw new Error("Unable to connect. Please try again later.");
    }
    throw error;
  }
}

// Type definitions
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  contactStatus?: string;
  value: number;
  assignedTo: string;
  assignedToUserId?: string | null;
  createdAt: string;
  lastContact: string;

  notes: string;
  orderLostReason?: string;
  orderLostReasonOther?: string;
  groupId?: string | null;
  groupName?: string | null;
  contactReport?: {
    contactConfirmation: {
      successful: boolean;
    };
    contactDetails: {
      mode: string;
      dateTime: string;
      spokenTo: string;
    };
    propertyDetails: {
      type: string;
      floors: string;
      usage: string;
    };
    siteReadiness: {
      pitAvailable: string;
      pitDepth: string;
      shaftAvailable: string;
      shaftType: string;
      shaftSize: string;
      machineRoom: string;
    };
    elevatorPreference: {
      type: string;
      brand: string;
    };
    clientIntent: {
      interestLevel: string;
      budget: string;
      timeline: string;
    };
    nextAction: {
      type: string;
      meetingTime?: string;
      followUpDate?: string;
    };
    salesOwner: {
      name: string;
      remarks: string;
    };
  };
}

export interface Quotation {
  id: string;
  leadId: string;
  leadName: string;
  projectAddress?: string;
  contactNumber?: string;
  elevatorType: string;
  modelNumber?: string;
  floors: number;
  capacity: number;
  speed: number;
  shaftType?: string;
  application?: string;
  cabinType?: string;
  doorType?: string;
  features: string[];
  standardRates?: {
    basicCost: number;
    shaftMasonry: number;
    shaftFilling: number;
    installation: number;
    extraTravelHeight: number;
    premiumCabin: number;
    multiColorLED: number;
    glassDoor: number;
    premiumRALColor: number;
    customizedCabinSize: number;
    transportation: number;
    advancedFeatures: number;
  };
  signatureRates?: {
    basicCost: number;
    shaftMasonry: number;
    shaftFilling: number;
    installation: number;
    extraTravelHeight: number;
    premiumCabin: number;
    multiColorLED: number;
    glassDoor: number;
    premiumRALColor: number;
    customizedCabinSize: number;
    transportation: number;
    advancedFeatures: number;
  };
  standardTotal?: number;
  standardGST?: number;
  standardNet?: number;
  signatureTotal?: number;
  signatureGST?: number;
  signatureNet?: number;
  timeOfDelivery?: string;
  paymentTerms?: {
    percentage1: number;
    amount1: number;
    percentage2: number;
    amount2: number;
  };
  basePrice: number;
  installationCost: number;
  tax: number;
  totalAmount: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  validUntil: string;
  version: number;
}

export type ProjectStage =
  | "First Technical Visit"
  | "Drawings Prepared"
  | "Client Confirmation of Drawings"
  | "Interior Selection"
  | "Moved to Factory"
  | "Ready for Dispatch"
  | "Installation Team Scheduled"
  | "Installation in Progress"
  | "Testing & Final Handover";

export interface Project {
  id: string;
  // 1. Project Basic Details
  projectId?: string;
  projectName: string;
  customerName: string;
  projectType?: "New Installation" | "Modernization";
  siteAddress?: string;
  city?: string;
  salesPersonName?: string;
  orderDate?: string;
  expectedCompletionDate?: string;
  projectStatus?: "Planning" | "In Progress" | "On Hold" | "Completed";

  // 2. Lift / Technical Details
  liftType?: "MRL" | "Hydraulic" | "Gearless";
  numberOfLifts?: number;
  capacity?: string; // kg / persons
  numberOfStops?: number;
  speed?: string;
  doorType?: string;
  powerRequirement?: string;
  shaftStatus?: "Ready" | "Under Construction";

  // 3. Commercial & Order Details
  quotationId: string;
  orderValue?: number;
  advanceAmountReceived?: number;
  balanceAmount?: number;
  paymentMilestones?: string[]; // ["Advance", "Mid Payment", "Final Payment"]
  invoiceNumbers?: string[];
  gstDetails?: string;
  paymentStatus?: "Paid" | "Partial" | "Pending";

  // 4. Installation Progress Tracking
  materialDispatchDate?: string;
  materialReceivedDate?: string;
  machineInstallationStatus?: "Pending" | "In Progress" | "Completed";
  guideRailInstallation?: "Pending" | "In Progress" | "Completed";
  wiringElectricalWork?: "Pending" | "In Progress" | "Completed";
  cabinInstallation?: "Pending" | "In Progress" | "Completed";
  doorInstallation?: "Pending" | "In Progress" | "Completed";
  testingCommissioning?: "Pending" | "In Progress" | "Completed";
  safetyInspectionStatus?: "Pending" | "In Progress" | "Completed";
  governmentApproval?: string;

  // 5. Team & Responsibility
  siteEngineerName?: string;
  installationTechnician?: string;
  supervisor?: string;
  contactNumbers?: string;
  assignedDate?: string;

  // 6. Issues & Delays
  issues?: Array<{
    description: string;
    issueType: "Material Delay" | "Civil Work Pending" | "Payment Delay" | "Other";
    raisedDate: string;
    expectedResolutionDate?: string;
    currentStatus: "Open" | "In Progress" | "Resolved";
  }>;

  // 7. Handover & Closure
  installationCompletionDate?: string;
  handoverDate?: string;
  clientSignOff?: boolean;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  amcOffered?: boolean;
  amcLinked?: string; // AMC Contract ID

  // 8. Documents (stage-based)
  documents?: Array<{
    id?: string;
    stage: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl?: string;
    uploadedDate: string;
  }>;

  // Legacy fields (keep for backward compatibility)
  location: string;
  elevatorType: string;
  currentStage: ProjectStage;
  startDate: string;
  expectedCompletion: string;
  progress: number;
  assignedEngineer: string;
  status: "On Track" | "Delayed" | "On Hold";
}

export interface AMCContract {
  id: string;
  contractId?: string; // AMC Contract ID / Number
  customerName: string;
  elevatorName?: string; // Elevator / Product Name
  amcType?: "Comprehensive" | "Non-Comprehensive"; // AMC Type
  projectName: string;
  elevatorId: string;
  contractStartDate: string;
  contractEndDate: string;
  duration: number;
  amcAmount?: number; // AMC Amount
  amountType?: "Yearly" | "Monthly"; // Yearly / Monthly
  paymentStatus?: "Paid" | "Pending" | "Overdue"; // Payment Status
  paymentMode?: "Cash" | "UPI" | "Bank Transfer" | "Cheque"; // Payment Mode
  invoiceNumber?: string; // Invoice Number
  invoiceDate?: string; // Invoice Date
  gstAmount?: number; // GST Amount
  netRevenue?: number; // Net Revenue (after tax)
  nextPaymentDueDate?: string; // Next Payment Due Date
  remarks?: string; // Remarks / Notes
  nextServiceDate: string;
  serviceFrequency: string;
  assignedTechnician: string;
  status: "Active" | "Expired" | "Pending Renewal";
  totalValue: number;
  servicesCompleted: number;
  servicesPending: number;
  // Advanced fields
  monthWiseRevenue?: { [key: string]: number }; // Month-wise revenue
  yearWiseRevenue?: { [key: string]: number }; // Year-wise revenue
  totalAMCIncome?: number; // Total AMC income
  pendingAmount?: number; // Pending amount summary
}

// Leads API
export const leadsAPI = {
  getAll: (params?: {
    groupId?: string | null;
    state?: string;
    stage?: string;
    assignedToUserId?: string;
    page?: number;
    limit?: number;
    search?: string;
    source?: string;
  }) => {
    const p = params || {};
    const qs = new URLSearchParams();
    if (p.groupId) qs.set("groupId", p.groupId);
    if (p.state) qs.set("state", p.state);
    if (p.stage) qs.set("stage", p.stage);
    if (p.assignedToUserId) qs.set("assignedToUserId", p.assignedToUserId);
    if (p.page) qs.set("page", String(p.page));
    if (p.limit) qs.set("limit", String(p.limit));
    if (p.search) qs.set("search", p.search);
    if (p.source) qs.set("source", p.source);
    const query = qs.toString();
    return fetchAPI(`/leads${query ? `?${query}` : ""}`);
  },
  /** Dashboard-friendly totals across all matching leads (same filters as GET /leads — not capped at page size). */
  getSummaryStats: (params?: { state?: string }) => {
    const qs = new URLSearchParams();
    if (params?.state?.trim()) qs.set("state", params.state.trim());
    const suffix = qs.toString() ? `?${qs}` : "";
    return fetchAPI(`/leads/summary/stats${suffix}`) as Promise<{
      total: number;
      leadContacted: number;
      meetingScheduled: number;
      meetingsCompleted: number;
      quotationSent: number;
      managerDeliberation: number;
      lostLeads: number;
      newLead: number;
      orderClosed: number;
      askToCallBack: number;
      dnp: number;
      notRequired: number;
    }>;
  },
  getById: (id: string) => fetchAPI(`/leads/${id}`),
  create: (data: any) => fetchAPI("/leads", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/leads/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/leads/${id}`, { method: "DELETE" }),
  /** Check which phones/emails already exist in the CRM. Returns sets of duplicate values. */
  checkDuplicates: (data: { phones: string[]; emails: string[] }) =>
    fetchAPI("/leads/check-duplicates", {
      method: "POST",
      body: JSON.stringify(data),
    }) as Promise<{ duplicatePhones: string[]; duplicateEmails: string[] }>,
  /** Import leads from Facebook Lead Ads. Requires accessToken and pageId. */
  importFromFacebook: (data: {
    accessToken: string;
    pageId: string;
    assignedTo?: string;
    assignedToUserId?: string;
    groupId?: string | null;
  }) =>
    fetchAPI("/leads/import/facebook", { method: "POST", body: JSON.stringify(data) }) as Promise<{
      imported: number;
      total?: number;
      errors?: string[];
      message: string;
    }>,
  /** Sync leads from Facebook using credentials stored in backend Settings. Uses GET with query params. */
  syncFacebook: (data: {
    assignedTo: string;
    assignedToUserId?: string;
    groupId?: string | null;
  }) =>
    fetchAPI(
      `/leads/sync/facebook?assignedTo=${encodeURIComponent(data.assignedTo)}${
        data.assignedToUserId
          ? `&assignedToUserId=${encodeURIComponent(data.assignedToUserId)}`
          : ""
      }${data.groupId ? `&groupId=${encodeURIComponent(data.groupId)}` : ""}`
    ) as Promise<{
      imported: number;
      total?: number;
      errors?: string[];
      message: string;
    }>,
};

// Settings API (integrations stored on backend)
export const settingsAPI = {
  getStates: () =>
    fetchAPI("/settings/states") as Promise<{
      states: string[];
    }>,
  getFacebookLeadAds: () =>
    fetchAPI("/settings/facebook-lead-ads") as Promise<{
      configured: boolean;
      pageId: string;
    }>,
  updateFacebookLeadAds: (data: { accessToken: string; pageId: string }) =>
    fetchAPI("/settings/facebook-lead-ads", { method: "PUT", body: JSON.stringify(data) }) as Promise<{
      success: boolean;
      message: string;
      configured: boolean;
      pageId: string;
    }>,
  getGoogleAds: () =>
    fetchAPI("/settings/google-ads") as Promise<{
      configured: boolean;
      webhookUrl: string;
      secretSet: boolean;
    }>,
  updateGoogleAds: (data: {
    webhookUrl: string;
    webhookSecret: string;
  }) =>
    fetchAPI("/settings/google-ads", { method: "PUT", body: JSON.stringify(data) }) as Promise<{
      success: boolean;
      message: string;
      configured: boolean;
      webhookUrl: string;
    }>,
};

// Blogs API
export const blogsAPI = {
  getAll: (admin: boolean = false) => fetchAPI(`/blogs${admin ? "?admin=true" : ""}`),
  getById: (id: string) => fetchAPI(`/blogs/${id}`),
  create: (data: any) => fetchAPI("/blogs", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/blogs/${id}`, { method: "DELETE" }),
};

export interface Blog {
  _id?: string;
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  googleReviewUrl?: string;
  views: number;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Quotations API
export const quotationsAPI = {
  getAll: () => fetchAPI("/quotations"),
  getById: (id: string) => fetchAPI(`/quotations/${id}`),
  create: (data: any) => fetchAPI("/quotations", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/quotations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/quotations/${id}`, { method: "DELETE" }),
  downloadPDF: async (id: string): Promise<void> => {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/quotations/${id}/pdf`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    const blob = await response.blob();

    // Verify it's a PDF
    if (blob.type !== "application/pdf") {
      throw new Error("Invalid PDF file received");
    }

    // Create download link and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Quotation-${id}.pdf`;
    document.body.appendChild(a);
    a.click();

    // Clean up after a short delay to ensure download starts
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  },
};

// Projects API
export const projectsAPI = {
  getAll: () => fetchAPI("/projects"),
  getById: (id: string) => fetchAPI(`/projects/${id}`),
  create: (data: any) => fetchAPI("/projects", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/projects/${id}`, { method: "DELETE" }),
  getExpenses: (projectId: string) => fetchAPI(`/projects/${projectId}/expenses`) as Promise<{ id: string; projectId?: string; amount: number; description: string }[]>,
  addExpense: (projectId: string, data: { amount: number; description?: string }) =>
    fetchAPI(`/projects/${projectId}/expenses`, { method: "POST", body: JSON.stringify(data) }),
  updateExpense: (projectId: string, expenseId: string, data: { amount: number; description?: string }) =>
    fetchAPI(`/projects/${projectId}/expenses/${expenseId}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExpense: (projectId: string, expenseId: string) =>
    fetchAPI(`/projects/${projectId}/expenses/${expenseId}`, { method: "DELETE" }),
  uploadDocument: async (projectId: string, stage: string, file: File) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("stage", stage);
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/documents`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    if (!response.ok) {
      const errText = await response.text();
      let errorMessage = "Upload failed";
      try {
        const errData = JSON.parse(errText);
        errorMessage = errData.details || errData.error || errText || "Upload failed";
      } catch {
        if (errText) errorMessage = errText;
      }
      throw new Error(errorMessage);
    }
    return response.json();
  },
  deleteDocument: (projectId: string, docId: string) =>
    fetchAPI(`/projects/${projectId}/documents/${docId}`, { method: "DELETE" }),
  downloadDocument: async (projectId: string, docId: string, fileName: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/documents/${docId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      const errText = await response.text();
      let message = "Download failed";
      try {
        const errData = JSON.parse(errText);
        if (errData?.error) message = errData.error;
      } catch {
        if (errText) message = errText;
      }
      throw new Error(message);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
  fetchDocumentBlob: async (projectId: string, docId: string): Promise<{ blobUrl: string; mimeType: string }> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/documents/${docId}/view`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      const errText = await response.text();
      let message = "Failed to load document";
      try {
        const errData = JSON.parse(errText);
        if (errData?.error) message = errData.error;
      } catch {
        if (errText) message = errText;
      }
      throw new Error(message);
    }
    const mimeType = response.headers.get("Content-Type") || "application/octet-stream";
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return { blobUrl, mimeType };
  },
};

// AMC API
export const amcAPI = {
  getAll: () => fetchAPI("/amc"),
  getById: (id: string) => fetchAPI(`/amc/${id}`),
  create: (data: any) => fetchAPI("/amc", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/amc/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/amc/${id}`, { method: "DELETE" }),
};

// Users API
export const usersAPI = {
  getAll: () => fetchAPI("/users"),
  getById: (id: string) => fetchAPI(`/users/${id}`),
  create: (data: any) => fetchAPI("/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/users/${id}`, { method: "DELETE" }),
};

// Groups API
export const groupsAPI = {
  getAll: (search?: string) => fetchAPI(`/groups${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getById: (id: string) => fetchAPI(`/groups/${id}`),
  create: (data: { groupName: string; addedBy?: string; assignedTeam?: string[] }) =>
    fetchAPI("/groups", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: { groupName?: string; assignedTeam?: string[]; totalLeads?: number }) =>
    fetchAPI(`/groups/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle: (id: string, isSelected: boolean) =>
    fetchAPI(`/groups/${id}/toggle`, { method: "PUT", body: JSON.stringify({ isSelected }) }),
  copy: (id: string) => fetchAPI(`/groups/${id}/copy`, { method: "POST" }),
  delete: (id: string) => fetchAPI(`/groups/${id}`, { method: "DELETE" }),
};

// Pipelines (Leads Pipelines) API
export interface PipelineListItem {
  id: string;
  pipelineName: string;
  details?: string;
  stages?: { name: string; order: number }[];
  groupName: string | null;
  groupId: string | null;
  leads: number;
  assignedTeam: { id: string; name: string }[];
  created: string;
}

export const pipelinesAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page != null) q.set("page", String(params.page));
    if (params?.limit != null) q.set("limit", String(params.limit));
    if (params?.search?.trim()) q.set("search", params.search.trim());
    const qs = q.toString();
    return fetchAPI(`/pipelines${qs ? `?${qs}` : ""}`) as Promise<{
      data: PipelineListItem[];
      pagination: { page: number; limit: number; total: number; totalPages: number };
    }>;
  },
  getById: (id: string) => fetchAPI(`/pipelines/${id}`) as Promise<PipelineListItem>,
  create: (data: { pipelineName: string; details?: string; stages?: Array<string | { name: string; order?: number }>; groupId?: string | null; addedBy?: string }) =>
    fetchAPI("/pipelines", { method: "POST", body: JSON.stringify(data) }) as Promise<PipelineListItem>,
  update: (id: string, data: { pipelineName?: string; details?: string; stages?: Array<string | { name: string; order?: number }>; groupId?: string | null }) =>
    fetchAPI(`/pipelines/${id}`, { method: "PUT", body: JSON.stringify(data) }) as Promise<PipelineListItem>,
  delete: (id: string) => fetchAPI(`/pipelines/${id}`, { method: "DELETE" }),
  getBoard: (id: string) =>
    fetchAPI(`/pipelines/${id}/board`) as Promise<{
      pipeline: {
        id: string;
        pipelineName: string;
        details: string;
        groupId: string | null;
        groupName: string | null;
        stages: { name: string; order: number }[];
      };
      leads: Lead[];
    }>,
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => fetchAPI("/dashboard/stats"),
};

// Performance report API
export const performanceAPI = {
  getReport: (params?: { from?: string; to?: string }) => {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const query = qs.toString();
    return fetchAPI(`/performance-report${query ? `?${query}` : ""}`) as Promise<{
      meta: { from: string | null; to: string | null; generatedAt: string };
      data: Array<{
        userId: string;
        staffName: string;
        email: string;
        role: string;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        efficiency: number;
      }>;
    }>;
  },
  exportReport: async (params?: { from?: string; to?: string; format?: "csv" | "pdf" }) => {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    qs.set("format", params?.format || "csv");
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const res = await fetch(`${API_BASE_URL}/performance-report/export?${qs}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Export failed");
    const blob = await res.blob();
    const ext = params?.format === "pdf" ? "pdf" : "csv";
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  },
};

async function hrFetchFile(endpoint: string, formData: FormData) {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text();
    let msg = "Upload failed";
    try {
      const j = JSON.parse(text);
      msg = j.error || msg;
    } catch {
      msg = text || msg;
    }
    throw new Error(msg);
  }
  return res.json();
}

export const hrAPI = {
  getDashboard: () => fetchAPI("/hr/dashboard"),
  getEmployees: () => fetchAPI("/hr/employees"),
  getEmployee: (id: string) => fetchAPI(`/hr/employees/${id}`),
  updateProfile: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/hr/employees/${id}/profile`, { method: "PUT", body: JSON.stringify(data) }),
  toggleOnboarding: (id: string, key: string, completed: boolean) =>
    fetchAPI(`/hr/employees/${id}/onboarding/${key}`, {
      method: "PUT",
      body: JSON.stringify({ completed }),
    }),
  uploadDocument: (id: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return hrFetchFile(`/hr/employees/${id}/documents`, fd);
  },
  deleteDocument: (id: string, docId: string) =>
    fetchAPI(`/hr/employees/${id}/documents/${docId}`, { method: "DELETE" }),
  getLeave: (params?: { status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    return fetchAPI(`/hr/leave${qs.toString() ? `?${qs}` : ""}`);
  },
  requestLeave: (data: { type: string; startDate: string; endDate: string; reason: string }) =>
    fetchAPI("/hr/leave", { method: "POST", body: JSON.stringify(data) }),
  approveLeave: (id: string, reviewNote?: string) =>
    fetchAPI(`/hr/leave/${id}/approve`, { method: "PUT", body: JSON.stringify({ reviewNote }) }),
  rejectLeave: (id: string, reviewNote?: string) =>
    fetchAPI(`/hr/leave/${id}/reject`, { method: "PUT", body: JSON.stringify({ reviewNote }) }),
  getTodayAttendance: () => fetchAPI("/hr/attendance/today"),
  getAttendance: (params?: { from?: string; to?: string; userId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.userId) qs.set("userId", params.userId);
    return fetchAPI(`/hr/attendance${qs.toString() ? `?${qs}` : ""}`);
  },
  checkIn: () => fetchAPI("/hr/attendance/check-in", { method: "POST", body: "{}" }),
  checkOut: () => fetchAPI("/hr/attendance/check-out", { method: "POST", body: "{}" }),
  recordAttendance: (data: Record<string, unknown>) =>
    fetchAPI("/hr/attendance", { method: "POST", body: JSON.stringify(data) }),
  getTimesheets: (params?: { from?: string; to?: string; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    if (params?.status) qs.set("status", params.status);
    return fetchAPI(`/hr/timesheets${qs.toString() ? `?${qs}` : ""}`);
  },
  createTimesheet: (data: Record<string, unknown>) =>
    fetchAPI("/hr/timesheets", { method: "POST", body: JSON.stringify(data) }),
  updateTimesheet: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/hr/timesheets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTimesheet: (id: string) => fetchAPI(`/hr/timesheets/${id}`, { method: "DELETE" }),
  getTasks: (assignedTo?: string) =>
    fetchAPI(`/hr/tasks${assignedTo ? `?assignedTo=${assignedTo}` : ""}`),
  createTask: (data: Record<string, unknown>) =>
    fetchAPI("/hr/tasks", { method: "POST", body: JSON.stringify(data) }),
  updateTask: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/hr/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// Health check API
export const healthAPI = {
  check: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },
};

// Notifications API
export interface Notification {
  id: string;
  userId?: string;
  message: string;
  type: "demo" | "contact" | "quotation" | "project" | "amc" | "lead" | "signup" | "leave" | "attendance" | "timesheet" | "hr" | "system";
  relatedId?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notificationsAPI = {
  getAll: (userId?: string) => fetchAPI(`/notifications${userId ? `?userId=${userId}` : ""}`),
  getUnreadCount: (userId?: string) => fetchAPI(`/notifications/unread${userId ? `?userId=${userId}` : ""}`),
  markAsRead: (id: string) => fetchAPI(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllAsRead: (userId?: string) => fetchAPI("/notifications/read-all", {
    method: "PATCH",
    body: JSON.stringify({ userId })
  }),
  delete: (id: string) => fetchAPI(`/notifications/${id}`, { method: "DELETE" }),
  create: (data: { userId?: string; message: string; type?: string; relatedId?: string }) =>
    fetchAPI("/notifications", { method: "POST", body: JSON.stringify(data) }),
};

// Activity API
export interface ActivityLog {
  id: string;
  userName: string;
  userRole?: string;
  actionType: "Login" | "Logout" | "Create" | "Update" | "Delete" | string;
  moduleName?: string;
  description?: string;
  ipAddress?: string;
  deviceInfo?: string;
  status?: "Success" | "Failed" | string;
  createdAt: string;
  updatedAt?: string;
}

export const activityAPI = {
  // list with query params: search, actionType, module, dateFrom, dateTo, page, limit
  list: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params || {}).reduce((acc: any, [k, v]) => {
        if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
        return acc;
      }, {})
    ).toString();
    return fetchAPI(`/activities${qs ? `?${qs}` : ""}`);
  },
  // export CSV - backend may implement; fallback to client-side export
  exportCSV: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(params as any).toString();
    return fetchAPI(`/activities/export${qs ? `?${qs}` : ""}`);
  },
};

// Testimonials API
export const testimonialsAPI = {
  getAll: (admin: boolean = false) => fetchAPI(`/testimonials${admin ? "?admin=true" : ""}`),
  getById: (id: string) => fetchAPI(`/testimonials/${id}`),
  create: (data: any) => fetchAPI("/testimonials", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchAPI(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) => fetchAPI(`/testimonials/${id}`, { method: "DELETE" }),
};
