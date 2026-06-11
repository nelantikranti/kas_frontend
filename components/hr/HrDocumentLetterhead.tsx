"use client";

import Image from "next/image";
import { COMPANY_ADDRESS, COMPANY_LOGO_SRC, COMPANY_NAME } from "./hrDocumentUtils";

type Props = {
  title: string;
  subtitle?: string;
};

export default function HrDocumentLetterhead({ title, subtitle }: Props) {
  return (
    <div className="border-b-2 border-gray-900 px-8 py-4 flex gap-5 items-center">
      <div className="shrink-0">
        <Image
          src={COMPANY_LOGO_SRC}
          alt="KAS Home Elevators"
          width={120}
          height={64}
          className="h-14 w-auto object-contain"
          priority
        />
      </div>
      <div className="flex-1 min-w-0 text-right">
        <h2 className="text-base font-bold text-gray-900 leading-snug">{COMPANY_NAME}</h2>
        <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">{COMPANY_ADDRESS}</p>
        <p className="text-xs font-semibold mt-2 uppercase tracking-wide text-gray-900">{title}</p>
        {subtitle ? <p className="text-[10px] text-gray-600 mt-0.5">{subtitle}</p> : null}
      </div>
    </div>
  );
}
