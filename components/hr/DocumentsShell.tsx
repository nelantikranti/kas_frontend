"use client";

import Link from "next/link";

export type DocumentTab = {
  id: string;
  label: string;
  href: string;
};

/** Add future document types here (e.g. appointment letters, NOC) */
export const DOCUMENT_TABS: DocumentTab[] = [
  { id: "offers", label: "Offer Letters", href: "/dashboard/hr/offers" },
];

type Props = {
  activeTab: string;
  description?: string;
  children: React.ReactNode;
};

export default function DocumentsShell({ activeTab, description, children }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Documents</h1>
          {description ? (
            <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">{description}</p>
          ) : null}
        </div>
        <nav
          className="flex gap-0 mt-4 px-3 sm:px-4 border-t border-gray-100 overflow-x-auto"
          aria-label="Document types"
        >
          {DOCUMENT_TABS.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-green-600 text-green-700 bg-green-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
