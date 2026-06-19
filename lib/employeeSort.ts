export function parseEmployeeCodeNumber(code?: string | null): number | null {
  const trimmed = String(code || "").trim();
  const m = trimmed.match(/^(\d{4,})$/);
  return m ? parseInt(m[1], 10) : null;
}

/** Ascending by numeric employee code; missing codes last, then by name. */
export function compareByEmployeeCode(
  a: { employeeId?: string; name?: string },
  b: { employeeId?: string; name?: string }
): number {
  const na = parseEmployeeCodeNumber(a.employeeId);
  const nb = parseEmployeeCodeNumber(b.employeeId);
  if (na != null && nb != null) return na - nb;
  if (na != null) return -1;
  if (nb != null) return 1;
  return (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" });
}

export function sortByEmployeeCode<T extends { employeeId?: string; name?: string }>(list: T[]): T[] {
  return [...list].sort(compareByEmployeeCode);
}
