"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface LeadFormProps {
  variant?: "hero" | "standalone";
}

const locations = [
  "Banjara Hills",
  "Jubilee Hills",
  "Gachibowli",
  "Madhapur",
  "Kondapur",
  "Kukatpally",
  "Miyapur",
  "HITEC City",
  "Kompally",
  "Manikonda",
  "Tellapur",
  "Other Hyderabad Area",
];

const liftTypesHero = [
  "Hydraulic",
  "MRL",
  "Gearless",
  "Glass / Panoramic",
  "Not Sure",
];

const liftTypesStandalone = [
  "MRL Lift (₹5L–₹10L)",
  "Hydraulic Lift (₹6L–₹12L)",
  "Gearless Premium (₹8L–₹16L)",
  "Glass / Panoramic (₹10L–₹18L)",
  "Not Sure — Need Recommendation",
];

const propertyTypes = [
  "Under Construction Villa",
  "Existing Independent House",
  "Duplex Apartment",
  "Penthouse / Gated Community",
  "Commercial / Other",
];

const timelines = [
  "Immediately (within 1 month)",
  "1–3 months",
  "3–6 months",
  "Planning / Researching",
];

export default function LeadForm({ variant = "standalone" }: LeadFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    propertyType: "",
    liftType: "",
    timeline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      setFormData({ ...formData, phone: cleaned });
    }
  };

  const handleNameChange = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z\s\.\-']/g, "");
    setFormData({ ...formData, name: cleaned });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    if (formData.phone.length !== 10) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      setIsSubmitting(false);
      setSubmitStatus("error");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const payload = {
        name: formData.name,
        email: `${formData.phone}@kashomeelevators.com`,
        phone: formData.phone,
        city: formData.location,
        subject: "Home Lift Lead (Hyderabad)",
        message: `Property Type: ${formData.propertyType || "N/A"} | Selected Lift Type: ${formData.liftType} | Timeline: ${formData.timeline || "N/A"}`,
      };

      const response = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          name: "",
          phone: "",
          location: "",
          propertyType: "",
          liftType: "",
          timeline: "",
        });
        router.push("/thank-you");
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to submit. Please try again.");
      }
    } catch (err: any) {
      console.error("Lead form submission failed:", err);
      setSubmitStatus("error");
      setErrorMessage("Unable to connect. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isHero = variant === "hero";

  return (
    <div
      className={`rounded-2xl border ${
        isHero
          ? "bg-white/5 backdrop-blur-md border-green-500/20 text-white p-5 w-full mx-auto shadow-2xl"
          : "bg-slate-800/90 border-slate-700/80 text-white p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto"
      }`}
    >
      {isHero && (
        <h3 className="text-xl font-bold mb-4 text-green-400">
          Get Free Site Inspection
        </h3>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitStatus === "error" && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-200 text-xs">
            {errorMessage || "An error occurred. Please try again."}
          </div>
        )}

        <div className={isHero ? "space-y-4" : "grid sm:grid-cols-2 gap-4"}>
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full h-11 px-3 text-sm rounded-xl border bg-slate-950/40 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-300 transition-shadow"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              maxLength={10}
              className="w-full h-11 px-3 text-sm rounded-xl border bg-slate-950/40 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-300 transition-shadow"
              placeholder="10-digit mobile number"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              Installation Location *
            </label>
            <select
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full h-11 px-3 text-sm rounded-xl border bg-slate-950/40 border-slate-700 text-white [&>option]:bg-slate-900 [&>option]:text-white focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-300 transition-shadow"
            >
              <option value="" disabled>
                Select installation location
              </option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {!isHero && (
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                Property Type *
              </label>
              <select
                required
                value={formData.propertyType}
                onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                className="w-full h-11 px-3 text-sm rounded-xl border bg-slate-950/40 border-slate-700 text-white [&>option]:bg-slate-900 [&>option]:text-white focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-300 transition-shadow"
              >
                <option value="" disabled>
                  Select property type
                </option>
                {propertyTypes.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-300">
              {isHero ? "Home Lift Type *" : "Preferred Lift Type *"}
            </label>
            <select
              required
              value={formData.liftType}
              onChange={(e) => setFormData({ ...formData, liftType: e.target.value })}
              className="w-full h-11 px-3 text-sm rounded-xl border bg-slate-950/40 border-slate-700 text-white [&>option]:bg-slate-900 [&>option]:text-white focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-300 transition-shadow"
            >
              <option value="" disabled>
                Select lift type
              </option>
              {(isHero ? liftTypesHero : liftTypesStandalone).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {!isHero && (
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                Expected Timeline *
              </label>
              <select
                required
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full h-11 px-3 text-sm rounded-xl border bg-slate-950/40 border-slate-700 text-white [&>option]:bg-slate-900 [&>option]:text-white focus:outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-300 transition-shadow"
              >
                <option value="" disabled>
                  Select timeline
                </option>
                {timelines.map((tl) => (
                  <option key={tl} value={tl}>
                    {tl}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30 text-base mt-2"
        >
          {isSubmitting
            ? "Submitting..."
            : isHero
            ? "Get Free Site Inspection"
            : "Book Free Site Visit & Get Quote"}
        </button>

        {!isHero && (
          <p className="text-center text-xs text-slate-400 pt-2">
            🔒 100% Privacy Guaranteed. No spam. Free site visit anywhere in Hyderabad.
          </p>
        )}
      </form>
    </div>
  );
}
