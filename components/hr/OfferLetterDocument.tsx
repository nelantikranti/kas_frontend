"use client";

import Image from "next/image";
import EmployeeCodeBadge from "./EmployeeCodeBadge";
import { formatInr, formatLetterDate } from "./hrDocumentUtils";
import {
  OFFER_COMPANY_LEGAL,
  OFFER_OFFICE_LOCATION,
  OFFER_STATIC_SECTIONS,
  OFFER_TAGLINE,
  PDF_FOOTER_SRC,
  PDF_HEADER_SRC,
  annualCtc,
  formatOfferDate,
  offerIntroParagraph,
} from "@/lib/offerLetterContent";

export type OfferLetterDocumentData = {
  candidateName: string;
  role: string;
  department?: string;
  monthlyGross: number | string;
  joinDate: string;
  notes?: string;
  employeeId?: string;
};

function OfferHeader() {
  return (
    <div className="w-full">
      <Image
        src={PDF_HEADER_SRC}
        alt="KAS Home Elevators — Employment Offer Letter"
        width={875}
        height={197}
        className="w-full h-auto"
        priority
      />
    </div>
  );
}

function OfferFooter() {
  return (
    <div className="w-full">
      <Image
        src={PDF_FOOTER_SRC}
        alt={OFFER_TAGLINE}
        width={707}
        height={82}
        className="w-full h-auto"
      />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="font-bold text-[#1B4F8C] mb-2">{children}</p>;
}

export default function OfferLetterDocument({ data }: { data: OfferLetterDocumentData }) {
  const gross = Number(data.monthlyGross) || 0;
  const salutation =
    data.candidateName.startsWith("Mr.") || data.candidateName.startsWith("Ms.")
      ? `Dear ${data.candidateName},`
      : `Dear Mr./Ms. ${data.candidateName || "Candidate"},`;

  return (
    <div className="bg-white border border-gray-300 max-w-[210mm] mx-auto font-serif text-gray-900 text-sm leading-relaxed shadow-sm print:shadow-none">
      <OfferHeader />

      <div className="px-8 py-6 space-y-4">
        <p className="text-sm text-right">Date: {formatOfferDate()}</p>
        <p>{salutation}</p>
        <p className="text-justify">{offerIntroParagraph(data.role || "—", data.department)}</p>

        <div>
          <SectionTitle>1. POSITION &amp; COMPENSATION</SectionTitle>
          <div className="space-y-1 text-sm">
            {data.employeeId ? (
              <p>
                <span className="font-semibold">Employee ID:</span>{" "}
                <EmployeeCodeBadge code={data.employeeId} className="inline text-sm" />
              </p>
            ) : null}
            <p>
              <span className="font-semibold">Designation:</span> {data.role || "—"}
            </p>
            {data.department ? (
              <p>
                <span className="font-semibold">Department:</span> {data.department}
              </p>
            ) : null}
            <p>
              <span className="font-semibold">Location:</span> {OFFER_OFFICE_LOCATION}
            </p>
            <p>
              <span className="font-semibold">Reporting:</span> As per organizational structure
            </p>
            <p>
              <span className="font-semibold">Annual CTC:</span> {gross > 0 ? formatInr(annualCtc(gross)) : "—"}
            </p>
            <p>
              <span className="font-semibold">Monthly Gross Salary:</span> {gross > 0 ? formatInr(gross) : "—"}
            </p>
            <p>
              <span className="font-semibold">Date of Joining:</span>{" "}
              {data.joinDate ? formatLetterDate(data.joinDate) : "To be confirmed"}
            </p>
          </div>
        </div>

        {OFFER_STATIC_SECTIONS.map((section) => (
          <div key={section.title}>
            <SectionTitle>{section.title}</SectionTitle>
            {"body" in section && section.body
              ? section.body.map((paragraph) => (
                  <p key={paragraph} className="text-justify mb-2">
                    {paragraph}
                  </p>
                ))
              : null}
            {"bullets" in section && section.bullets ? (
              <ul className="list-disc pl-5 space-y-1 mb-2">
                {section.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {"closing" in section && section.closing ? (
              <p className="text-justify">{section.closing}</p>
            ) : null}
          </div>
        ))}

        {data.notes?.trim() ? (
          <div>
            <SectionTitle>10. Additional Terms</SectionTitle>
            <p className="whitespace-pre-wrap text-justify">{data.notes}</p>
          </div>
        ) : null}

      </div>
      <OfferFooter />

      <div className="px-8 pb-8 space-y-5">
        <OfferHeader />
        <div className="space-y-4">
          <p className="text-center font-bold underline">Acceptance of Offer</p>
          <p className="text-justify">
            Please sign and return a copy of this letter as confirmation of your acceptance.
          </p>
          <p className="text-justify">
            We look forward to having you as part of our team and are confident in your contribution to our continued
            growth and success.
          </p>

          <div className="pt-2">
            <p className="font-semibold">For {OFFER_COMPANY_LEGAL}</p>
            <div className="mt-12 border-t border-gray-500 pt-1 max-w-[220px]">
              <p>Authorized Signatory</p>
            </div>
          </div>

          <p className="text-center font-bold italic underline pt-4">Employee Acknowledgment</p>
          <p className="text-justify">
            I, {data.candidateName || "____________________"}, have read and understood the terms and conditions
            mentioned in this letter and hereby accept this offer of employment.
          </p>

          <div className="space-y-6 pt-2">
            <div>
              <p className="font-semibold">Employee Signature:</p>
              <div className="mt-10 border-t border-gray-500 max-w-[260px]" />
            </div>
            <div>
              <p className="font-semibold">Date:</p>
              <div className="mt-10 border-t border-gray-500 max-w-[180px]" />
            </div>
          </div>

        </div>
      </div>
      <OfferFooter />
    </div>
  );
}
