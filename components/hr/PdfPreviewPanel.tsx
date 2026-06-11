"use client";

import { useEffect, useState } from "react";

type Props = {
  loadPdf: () => Promise<Blob>;
  title?: string;
  emptyHint?: string;
  refreshKey?: string | number;
};

export default function PdfPreviewPanel({ loadPdf, title = "PDF preview", emptyHint, refreshKey }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl: string | null = null;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const blob = await loadPdf();
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return objectUrl;
        });
      } catch (e: unknown) {
        if (active) setError(e instanceof Error ? e.message : "Failed to load PDF");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (refreshKey !== undefined && refreshKey !== "") run();
    else if (refreshKey === undefined) run();

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [refreshKey, loadPdf]);

  if (loading) {
    return (
      <div className="h-full min-h-[420px] rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-500">
        Generating PDF preview…
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[420px] rounded-xl border border-red-200 bg-red-50 flex items-center justify-center text-sm text-red-700 px-4 text-center">
        {error}
      </div>
    );
  }

  if (!url) {
    return (
      <div className="h-full min-h-[420px] rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400 px-6 text-center">
        {emptyHint || "Preview will appear here"}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-100 shadow-inner">
      <div className="px-3 py-2 bg-gray-800 text-white text-xs font-medium">{title}</div>
      <iframe src={url} className="w-full h-[480px] bg-white" title={title} />
    </div>
  );
}
