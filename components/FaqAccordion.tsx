"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  // We pass a rendering helper so that the SEO keyword links continue to work inside the client component
  renderAnswer: (text: string) => React.ReactNode;
}

export default function FaqAccordion({ faqs, renderAnswer }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {faqs.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-green-700 focus:outline-none transition-colors"
            >
              <span className="text-base sm:text-lg pr-4">
                {index + 1}. {item.question}
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
                {renderAnswer(item.answer)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
