export type AttendanceExportRow = {
  id: string;
  userId: string;
  userName: string;
  role?: string;
  employeeId?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
};

export type LeaveExportRow = {
  userId: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
};

export type EmployeeExportOption = {
  id: string;
  name: string;
  employeeId?: string;
  role: string;
  joinDate?: string | null;
};

const LATE_CUTOFF_MINUTES = 9 * 60 + 10;

export function isLateCheckIn(checkIn?: string | null): boolean {
  if (!checkIn) return false;
  const d = new Date(checkIn);
  if (Number.isNaN(d.getTime())) return false;
  return d.getHours() * 60 + d.getMinutes() > LATE_CUTOFF_MINUTES;
}

function parseYmd(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatYmd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function eachDayInRange(from: string, to: string): Date[] {
  const start = parseYmd(from);
  const end = parseYmd(to);
  const days: Date[] = [];
  for (const cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 1)) {
    days.push(new Date(cur));
  }
  return days;
}

function isWorkingDay(d: Date): boolean {
  return d.getDay() !== 0;
}

function countOverlapWorkingLeaveDays(
  rangeStart: Date,
  rangeEnd: Date,
  leaveStart: string,
  leaveEnd: string
): number {
  const ls = parseYmd(leaveStart);
  const le = parseYmd(leaveEnd);
  const s = ls > rangeStart ? ls : rangeStart;
  const e = le < rangeEnd ? le : rangeEnd;
  if (e < s) return 0;
  let count = 0;
  for (const cur = new Date(s); cur <= e; cur.setDate(cur.getDate() + 1)) {
    if (isWorkingDay(cur)) count += 1;
  }
  return count;
}

function formatTime(iso?: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function workDuration(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return "—";
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  if (ms <= 0) return "—";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export function resolveExportRange(from: string, to: string, fallbackTo: string) {
  const end = to || fallbackTo;
  const start =
    from ||
    (() => {
      const d = parseYmd(end);
      d.setDate(d.getDate() - 30);
      return formatYmd(d);
    })();
  return { start, end };
}

function resolveEmployeeExportRange(
  emp: EmployeeExportOption,
  attendance: AttendanceExportRow[],
  globalFrom: string,
  globalTo: string,
  perEmployeeRange: boolean,
  fallbackTo: string
) {
  if (!perEmployeeRange) return { from: globalFrom, to: globalTo };

  const to = fallbackTo;
  const empDates = attendance
    .filter((r) => r.userId === emp.id)
    .map((r) => r.date)
    .sort();
  const earliestAttendance = empDates[0];
  const globalEarliest = attendance
    .map((r) => r.date)
    .sort()[0];

  let from: string;
  if (emp.joinDate) {
    from = emp.joinDate;
  } else if (earliestAttendance) {
    from = earliestAttendance;
  } else if (globalEarliest) {
    from = globalEarliest;
  } else {
    from = to;
  }
  return { from: from > to ? to : from, to };
}

function resolveDetailStatus(day: Date, record?: AttendanceExportRow): string {
  if (day.getDay() === 0) return "Off";
  if (!record) return "absent";
  if (record.checkIn || record.checkOut) return record.status || "present";
  if (record.status && record.status !== "present") return record.status;
  return "absent";
}

function buildDetailRows(
  employees: EmployeeExportOption[],
  attendance: AttendanceExportRow[],
  from: string,
  to: string,
  perEmployeeRange: boolean,
  fallbackTo: string
) {
  const attendanceByKey = new Map<string, AttendanceExportRow>();
  for (const r of attendance) {
    attendanceByKey.set(`${r.userId}|${r.date}`, r);
  }

  const rows: {
    row: (string | number)[];
    checkInCol: number;
    isLate: boolean;
  }[] = [];

  for (const emp of employees) {
    const { from: empFrom, to: empTo } = resolveEmployeeExportRange(
      emp,
      attendance,
      from,
      to,
      perEmployeeRange,
      fallbackTo
    );
    for (const day of eachDayInRange(empFrom, empTo)) {
      const dateStr = formatYmd(day);
      const record = attendanceByKey.get(`${emp.id}|${dateStr}`);
      const status = resolveDetailStatus(day, record);
      rows.push({
        row: [
          dateStr,
          emp.name,
          emp.employeeId || "—",
          record?.checkIn ? formatTime(record.checkIn) : "—",
          record?.checkOut ? formatTime(record.checkOut) : "—",
          record?.checkIn && record?.checkOut ? workDuration(record.checkIn, record.checkOut) : "—",
          status,
        ],
        checkInCol: 3,
        isLate: record ? isLateCheckIn(record.checkIn) : false,
      });
    }
  }

  return rows.sort(
    (a, b) =>
      String(a.row[0]).localeCompare(String(b.row[0])) ||
      String(a.row[1]).localeCompare(String(b.row[1]))
  );
}

export function computeAttendanceSummary(
  employeeId: string,
  attendance: AttendanceExportRow[],
  leaves: LeaveExportRow[],
  from: string,
  to: string
) {
  const rangeStart = parseYmd(from);
  const rangeEnd = parseYmd(to);
  const days = eachDayInRange(from, to);

  let weeklyOff = 0;
  let workingDays = 0;
  for (const d of days) {
    if (d.getDay() === 0) weeklyOff += 1;
    else workingDays += 1;
  }

  const empAttendance = attendance.filter(
    (r) => r.userId === employeeId && r.date >= from && r.date <= to
  );
  const empLeaves = leaves.filter((l) => l.userId === employeeId && l.status === "approved");

  let present = 0;
  let holidays = 0;
  for (const r of empAttendance) {
    if (r.status === "present") present += 1;
    else if (r.status === "half_day") present += 0.5;
    else if (r.status === "holiday") holidays += 1;
  }

  let paidLeave = 0;
  let unpaidLeave = 0;
  for (const lv of empLeaves) {
    const overlap = countOverlapWorkingLeaveDays(rangeStart, rangeEnd, lv.startDate, lv.endDate);
    if (lv.type === "unpaid") unpaidLeave += overlap;
    else paidLeave += overlap;
  }

  const absent = Math.max(0, workingDays - present - paidLeave - holidays);
  const lop = unpaidLeave + absent;

  return {
    workingDays,
    present,
    leave: paidLeave,
    absent,
    weeklyOff,
    holidays,
    lop,
  };
}

type SummaryRow = {
  name: string;
  employeeId: string;
  workingDays: number;
  present: number;
  leave: number;
  absent: number;
  weeklyOff: number;
  holidays: number;
  lop: number;
};

export async function buildAttendanceWorkbook(opts: {
  title: string;
  employees: EmployeeExportOption[];
  attendance: AttendanceExportRow[];
  leaves: LeaveExportRow[];
  from: string;
  to: string;
  perEmployeeRange?: boolean;
  fallbackTo: string;
}) {
  const XLSXModule = await import("xlsx-js-style");
  const XLSX = (XLSXModule as unknown as { default?: typeof XLSXModule }).default ?? XLSXModule;

  const summaryHeaders = [
    "Employee Name",
    "Emp ID",
    "Working Days",
    "Present",
    "Leave",
    "Absent",
    "Weekly Off",
    "Holidays",
    "LOP",
  ];

  const perEmployeeRange = opts.perEmployeeRange ?? false;

  const summaryRows: SummaryRow[] = opts.employees.map((emp) => {
    const { from, to } = resolveEmployeeExportRange(
      emp,
      opts.attendance,
      opts.from,
      opts.to,
      perEmployeeRange,
      opts.fallbackTo
    );
    const stats = computeAttendanceSummary(emp.id, opts.attendance, opts.leaves, from, to);
    return {
      name: emp.name,
      employeeId: emp.employeeId || "—",
      ...stats,
    };
  });

  const detailHeaders = [
    "Date",
    "Employee Name",
    "Emp ID",
    "Check In",
    "Check Out",
    "Duration",
    "Status",    
  ];

  const detailRows = buildDetailRows(
    opts.employees,
    opts.attendance,
    opts.from,
    opts.to,
    perEmployeeRange,
    opts.fallbackTo
  );

  const sheetData: (string | number)[][] = [
    [opts.title],
    [],
    summaryHeaders,
    ...summaryRows.map((r) => [
      r.name,
      r.employeeId,
      r.workingDays,
      r.present,
      r.leave,
      r.absent,
      r.weeklyOff,
      r.holidays,
      r.lop,
    ]),
    [],
    detailHeaders,
    ...detailRows.map((d) => d.row),
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: summaryHeaders.length - 1 } }];

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "1B4F8C" } },
    alignment: { horizontal: "center" },
  };
  const lateStyle = { font: { color: { rgb: "FF0000" }, bold: true } };
  const titleStyle = { font: { bold: true, sz: 14 } };

  const titleCell = ws[XLSX.utils.encode_cell({ r: 0, c: 0 })];
  if (titleCell) titleCell.s = titleStyle;

  for (let c = 0; c < summaryHeaders.length; c += 1) {
    const addr = XLSX.utils.encode_cell({ r: 2, c });
    if (ws[addr]) ws[addr].s = headerStyle;
  }
  for (let c = 0; c < detailHeaders.length; c += 1) {
    const addr = XLSX.utils.encode_cell({ r: summaryRows.length + 4, c });
    if (ws[addr]) ws[addr].s = headerStyle;
  }

  const detailStartRow = summaryRows.length + 5;
  detailRows.forEach((d, idx) => {
    if (!d.isLate) return;
    const rowIndex = detailStartRow + idx;
    const checkInAddr = XLSX.utils.encode_cell({ r: rowIndex, c: d.checkInCol });
    if (ws[checkInAddr]) ws[checkInAddr].s = lateStyle;
  });

  ws["!cols"] = [
    { wch: 22 },
    { wch: 12 },
    { wch: 14 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 8 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Attendance");
  return XLSX.write(wb, { bookType: "xlsx", type: "array", cellStyles: true });
}
