"use client";

import { useCallback, useEffect, useState } from "react";
import { hrAPI } from "@/lib/api";
import { canEmployeeCheckInOut, getEffectivePermissions } from "@/lib/permissions";
import { toast } from "@/components/Toast";
import { IoLogIn, IoLogOut } from "react-icons/io5";

type TodayStatus = {
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  canCheckIn: boolean;
  canCheckOut: boolean;
};

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function readUserFromStorage(): { role: string; permissions: string[] } {
  if (typeof window === "undefined") return { role: "", permissions: [] };
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { role: "", permissions: [] };
    const user = JSON.parse(raw);
    return {
      role: String(user.role || "").trim(),
      permissions: getEffectivePermissions(user),
    };
  } catch {
    return { role: "", permissions: [] };
  }
}

/** Check-in/out on home dashboard — all employee roles, not Admin */
export default function AttendanceTodayCard() {
  const [show, setShow] = useState(false);
  const [today, setToday] = useState<TodayStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const syncUser = useCallback(() => {
    const { role, permissions } = readUserFromStorage();
    setShow(canEmployeeCheckInOut(role, permissions));
  }, []);

  useEffect(() => {
    syncUser();
    window.addEventListener("userPermissionsUpdated", syncUser);
    window.addEventListener("storage", syncUser);
    return () => {
      window.removeEventListener("userPermissionsUpdated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [syncUser]);

  const refresh = useCallback(() => {
    hrAPI
      .getTodayAttendance()
      .then((data) => setToday(data as TodayStatus))
      .catch(() => setToday(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!show) {
      setLoading(false);
      return;
    }
    refresh();
  }, [show, refresh]);

  if (!show) return null;

  const checkIn = async () => {
    setBusy(true);
    try {
      await hrAPI.checkIn();
      toast.success("Checked in");
      refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Check-in failed");
    } finally {
      setBusy(false);
    }
  };

  const checkOut = async () => {
    setBusy(true);
    try {
      await hrAPI.checkOut();
      toast.success("Checked out");
      refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Check-out failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-4 sm:mb-6 rounded-xl border border-green-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
            Today&apos;s attendance
          </p>
          {loading ? (
            <p className="text-sm text-gray-500 mt-1">Loading…</p>
          ) : (
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-medium text-gray-900">In {formatTime(today?.checkIn ?? null)}</span>
              <span className="mx-2 text-gray-300">·</span>
              <span className="font-medium text-gray-900">Out {formatTime(today?.checkOut ?? null)}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={checkIn}
            disabled={busy || loading || today?.canCheckIn === false}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoLogIn className="w-4 h-4" />
            Check in
          </button>
          <button
            type="button"
            onClick={checkOut}
            disabled={busy || loading || today?.canCheckOut === false}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoLogOut className="w-4 h-4" />
            Check out
          </button>
        </div>
      </div>
    </div>
  );
}
