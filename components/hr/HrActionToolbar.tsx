"use client";

import { IoDownloadOutline, IoLogoGoogle, IoMailOutline, IoEyeOutline, IoDocumentTextOutline } from "react-icons/io5";

type Action = {
  id: string;
  label: string;
  onClick: () => void;
  icon?: "preview" | "download" | "gmail" | "email" | "document";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  hidden?: boolean;
};

const icons = {
  preview: IoEyeOutline,
  download: IoDownloadOutline,
  gmail: IoLogoGoogle,
  email: IoMailOutline,
  document: IoDocumentTextOutline,
};

type Props = {
  actions: Action[];
  /** `row` — compact single-row toolbar */
  layout?: "wrap" | "row";
};

export default function HrActionToolbar({ actions, layout = "wrap" }: Props) {
  const visible = actions.filter((a) => !a.hidden);
  if (visible.length === 0) return null;

  const btnClass = (a: Action) => {
    if (a.variant === "primary") {
      return "bg-green-600 text-white border-green-600 hover:bg-green-700";
    }
    return "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400";
  };

  if (layout === "row") {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
        <div className="flex flex-nowrap items-center gap-2">
          {visible.map((a) => {
            const Icon = a.icon ? icons[a.icon] : null;
            return (
              <button
                key={a.id}
                type="button"
                onClick={a.onClick}
                disabled={a.disabled}
                className={`flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-2 py-2 text-xs font-medium border rounded-lg transition-colors disabled:opacity-45 disabled:pointer-events-none whitespace-nowrap ${btnClass(a)}`}
              >
                {Icon ? <Icon className="w-3.5 h-3.5 shrink-0" /> : null}
                <span className="truncate">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-lg border border-gray-200 bg-gray-50">
      {visible.map((a) => {
        const Icon = a.icon ? icons[a.icon] : null;
        return (
          <button
            key={a.id}
            type="button"
            onClick={a.onClick}
            disabled={a.disabled}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-lg transition-colors disabled:opacity-50 ${btnClass(a)}`}
          >
            {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
            {a.label}
          </button>
        );
      })}
    </div>
  );
}
