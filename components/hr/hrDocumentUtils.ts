export const COMPANY_NAME = "KAS Home Elevators Pvt. Ltd.";
export const COMPANY_BRAND = "KAS CRM";
export const COMPANY_LOGO_SRC = "/kas_img.png";
export const COMPANY_ADDRESS =
  "Bangalore, Karnataka, India · www.kashomeelevators.com · hr@kashomeelevators.com";

export function formatPayrollMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m) return month;
  return new Date(y, m - 1, 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
}

export function formatInr(amount: unknown): string {
  const val = Number(amount);
  const safe = Number.isFinite(val) ? val : 0;
  return `Rs. ${safe.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatLetterDate(date?: string): string {
  if (!date) return new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
