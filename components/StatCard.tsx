"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  color?: "blue" | "green" | "purple" | "orange" | "red";
  compact?: boolean;
}

export default function StatCard({ title, value, icon, trend, color = "blue", compact = false }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: compact ? 10 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
        compact ? "p-3" : "p-6"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-gray-600 ${compact ? "text-xs mb-0.5" : "text-sm mb-1"}`}>{title}</p>
          <p className={`font-bold text-gray-900 ${compact ? "text-lg" : "text-2xl"}`}>{value}</p>
          {trend && (
            <p className={`text-gray-500 truncate ${compact ? "text-[10px] mt-0.5" : "text-xs mt-1"}`}>{trend}</p>
          )}
        </div>
        <div className={`rounded-lg border shrink-0 ${colorClasses[color]} ${compact ? "p-1.5 [&_svg]:w-4 [&_svg]:h-4" : "p-3"}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}




