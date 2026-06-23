/**
 * Canonical lead funnel — same names as the Leads module (LeadsPageClient,
 * LeadStageFlowchart). Pipelines default to these so board columns match `lead.stage`.
 */
export const LEAD_FUNNEL_STAGES = [
  "New Lead",
  "Lead Contacted",
  "Not Contacted",
  "Not Interested",
  "Meeting Scheduled",
  "Meeting Completed",
  "Quotation Sent",
  "Manager Deliberation",
  "Order Closed",
  "Order Lost",
] as const;

export type LeadFunnelStage = (typeof LEAD_FUNNEL_STAGES)[number];

/** Mutable copy for pipeline create/reset state (chips can be edited). */
export const defaultPipelineStageNames = (): string[] => [...LEAD_FUNNEL_STAGES];
