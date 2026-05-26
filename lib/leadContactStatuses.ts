/** Contact outcome statuses (Leads "Status" column — separate from funnel stage). */
export const LEAD_CONTACT_STATUSES = [
  "Ask To call back",
  "DNP",
  "Not required",
] as const;

export type LeadContactStatus = (typeof LEAD_CONTACT_STATUSES)[number];

export const isLeadContactStatus = (value: string): value is LeadContactStatus =>
  (LEAD_CONTACT_STATUSES as readonly string[]).includes(value);
