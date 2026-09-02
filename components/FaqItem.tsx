"use client";

import { useState } from "react";

interface FaqItemProps {
  question: string;
  index: number;
  children: React.ReactNode;
}

export default function FaqItem({ question, index, children }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-green-700 focus:outline-none transition-colors"
      >
        <span className="text-base sm:text-lg pr-4">
          {index + 1}. {question}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-green-600" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-gray-50" : "max-h-0"
        }`}
      >
        <div className="p-5 text-sm sm:text-base text-gray-700 leading-relaxed bg-gray-50/50">
          {children}
        </div>
      </div>
    </div>
  );
}
