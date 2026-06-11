"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useRoles() {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    fetch(`${API}/roles/names`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setRoles(Array.isArray(d?.roles) ? d.roles : []))
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading };
}
