"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  IoCheckmarkCircle,
  IoArrowForward,
  IoHammer,
  IoShieldCheckmark,
  IoTime,
  IoPeople,
  IoDocumentText,
  IoConstruct,
} from "react-icons/io5";
import { motion } from "framer-motion";

export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/amc-quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Failed to submit request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: <IoHammer className="w-12 h-12" />,
      title: "Installation Services",
      description: "Professional installation by certified technicians ensuring optimal performance and safety compliance.",
      points: [
        "Expert installation team",
        "Minimal disruption",
        "Quality assurance",
        "Post-installation support",
      ],
      color: "text-green-700 bg-green-100",
      showLearnMore: true,
    },
    {
      icon: <IoShieldCheckmark className="w-12 h-12" />,
      title: "AMC & Maintenance",
      description: "Comprehensive Annual Maintenance Contracts to keep your elevators running smoothly and safely.",
      points: [
        "Regular inspections",
        "Preventive maintenance",
        "24/7 support",
        "Priority service",
      ],
      color: "text-emerald-700 bg-emerald-100",
      showLearnMore: true,
    },
    {
      icon: <IoTime className="w-12 h-12" />,
      title: "Emergency Repairs",
      description: "Round-the-clock emergency repair services to minimize downtime and ensure safety.",
      points: [
        "24/7 availability",
        "Rapid response",
        "Expert technicians",
        "Genuine parts",
      ],
      color: "text-red-700 bg-red-100",
      showLearnMore: true,
    },
    {
      icon: <IoPeople className="w-12 h-12" />,
      title: "Modernization",
      description: "Upgrade your existing elevators with latest technology for improved performance and efficiency.",
      points: [
        "Technology upgrade",
        "Energy efficiency",
        "Enhanced safety",
        "Extended lifespan",
      ],
      color: "text-purple-700 bg-purple-100",
      showLearnMore: true,
    },
    {
      icon: <IoDocumentText className="w-12 h-12" />,
      title: "Consultation Services",
      description: "Expert guidance on elevator selection, design, and compliance with building codes.",
      points: [
        "Technical consultation",
        "Design assistance",
        "Code compliance",
        "Cost optimization",
      ],
      color: "text-orange-700 bg-orange-100",
      showLearnMore: true,
    },
    {
      icon: <IoConstruct className="w-12 h-12" />,
      title: "Spare Parts Supply",
      description: "Genuine spare parts and components available for all our elevator models.",
      points: [
        "Original parts",
        "Quick delivery",
        "Competitive pricing",
        "Quality guarantee",
      ],
      color: "text-blue-700 bg-blue-100",
      showLearnMore: true,
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Request",
      description: "Contact us with your service requirements",
    },
    {
      number: "02",
      title: "Assessment",
      description: "Our experts evaluate your needs and provide a quote",
    },
    {
      number: "03",
      title: "Service",
      description: "Professional execution by certified technicians",
    },
    {
      number: "04",
      title: "Follow-up",
      description: "Quality check and ongoing support",
    },
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/maintainance_main.jpg"
          alt="Our Services"
          fill
          priority
          className="object-cover z-0 brightness-75 scale-110 blur-[2px] img-fade-in"
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-block px-5 py-2 mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full">
                <span className="text-green-400 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-shadow-sm">
                  Technical Service Excellence
                </span>
              </div>
              <h1 className="hero-title text-white mb-10">
                Engineered for <br />
                <span className="text-green-500">Perfection</span>
              </h1>
              <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
                Comprehensive maintenance, rapid response repairs, and precision installation by our global technical experts.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="premium-button bg-green-600 text-white min-w-[240px] shadow-2xl"
                  >
                    Get Priority Quote
                  </button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#process"
                    className="premium-button bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xl border-2 border-white/30 min-w-[240px]"
                  >
                    Service Workflow
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 content-gap">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="premium-card group reveal reveal-fade-up"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 ${service.color} rounded-[28px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {service.icon}
                </div>
                <h3 className="mb-6">
                  {service.title}
                </h3>
                <p className="mb-8">
                  {service.description}
                </p>
                <ul className="space-y-4 mb-10">
                  {service.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-center gap-3 text-slate-700 font-medium">
                      <IoCheckmarkCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      <span className="text-base">{point}</span>
                    </li>
                  ))}
                </ul>
                {service.showLearnMore && (
                  <Link
                    href="#contact"
                    className="inline-flex items-center text-green-600 font-bold hover:text-green-700 transition-all gap-2 text-sm uppercase tracking-widest"
                  >
                    Explore Details <IoArrowForward className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annual Maintenance Contract Section */}
      <section className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="reveal reveal-fade-right">
              <div className="w-20 h-1.5 bg-green-500 mb-8 rounded-full"></div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight italic">
                Life Cycle <br />
                <span className="text-green-600">Assurance</span>
              </h2>
              <p className="text-slate-600 leading-relaxed text-xl sm:text-2xl font-light mb-10">
                Our Annual Maintenance Contract (AMC) is engineered to provide complete peace of mind, ensuring your vertical assets operate with zero downtime and maximum safety.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  "Monthly Precision Inspections",
                  "24/7 Priority Emergency Support",
                  "Smart Maintenance Scheduling",
                  "Full Safety Compliance Audit",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-slate-700 font-bold group">
                    <IoCheckmarkCircle className="w-6 h-6 text-green-600 group-hover:scale-125 transition-transform" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="premium-button bg-slate-900 text-white min-w-[280px] shadow-2xl shadow-slate-900/20"
              >
                Request Custom Quote
              </button>
            </div>
            <div className="relative group reveal reveal-fade-left">
              <div className="relative h-[600px] rounded-[60px] overflow-hidden shadow-2xl scale-95 group-hover:scale-100 transition-transform duration-700">
                <Image
                  src="/maintainance_main.jpg"
                  alt="Elevator maintenance"
                  fill
                  className="object-cover img-fade-in"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white border border-slate-100 rounded-[40px] shadow-2xl flex flex-col items-center justify-center p-6 text-slate-900 rotate-6 group-hover:rotate-0 transition-transform duration-500">
                <span className="text-4xl font-black italic text-green-600">99.9%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2 text-center">Uptime Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section id="process" className="py-24 sm:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto mb-20 reveal reveal-fade-up">
            <h2 className="text-5xl sm:text-6xl font-black text-slate-900 mb-8 italic tracking-tight">
              Our Precise Workflow
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light leading-relaxed">
              A systematic approach engineered to deliver consistency, quality, and complete customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className="premium-card !p-12 text-center group reveal reveal-fade-up"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="w-24 h-24 bg-slate-900 text-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:scale-110 group-hover:bg-green-600 transition-all duration-500">
                  <span className="text-4xl font-black italic">{step.number}</span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 italic">
                  {step.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-lg font-light">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-24 sm:py-32 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 reveal reveal-fade-up">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-10 italic leading-tight">
            Need Expert <br />
            <span className="text-green-500">Technical Help?</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-200 mb-16 max-w-3xl mx-auto font-light leading-relaxed">
            Our teams are available 24/7 for emergency repairs and high-precision maintenance. Let's keep your operations seamless.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
            <Link
              href="/contact"
              className="premium-button bg-green-600 text-white min-w-[300px] !py-6 shadow-2xl shadow-green-600/20"
            >
              Contact Global Support
            </Link>
            <button
              onClick={() => setIsModalOpen(true)}
              className="premium-button bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border-2 border-white/30 text-white min-w-[300px] !py-6 shadow-2xl"
            >
              Request Immediate Service
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* AMC Quote Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="premium-card !p-0 max-w-lg w-full max-h-[95vh] overflow-y-auto reveal reveal-fade-in relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-8 flex items-center justify-between z-20">
              <div>
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Request Quote</h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Maintenance & Support</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSubmitStatus(null);
                }}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center transition-all duration-300 group"
              >
                <span className="text-3xl text-slate-400 group-hover:text-slate-900 transition-colors">&times;</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              {submitStatus === "success" && (
                <div className="p-6 bg-green-50 border border-green-200 rounded-[28px] text-green-800 text-center">
                  <IoCheckmarkCircle className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-black text-xl italic mb-2">Request Received</p>
                  <p className="text-sm font-medium">Our engineers will analyze your requirements and contact you within 4 business hours.</p>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-[28px] text-red-800 text-sm font-bold">
                  Failed to transmit request. Please verify details and try again.
                </div>
              )}

              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-slate-900 font-bold"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-slate-900 font-bold"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-slate-900 font-bold"
                      placeholder="Mobile number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Details</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-slate-900 font-bold resize-none"
                    placeholder="Describe your elevator systems..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="premium-button w-full bg-slate-900 text-white !py-5 shadow-2xl shadow-slate-900/20"
              >
                {isSubmitting ? "Submitting Inquiry..." : "Analyze & Get Quote"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
