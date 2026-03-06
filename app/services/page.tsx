"use client";

import { useState, type FormEvent } from "react";
<<<<<<< HEAD
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
=======
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
>>>>>>> origin/main
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
<<<<<<< HEAD
import { motion } from "framer-motion";
=======
>>>>>>> origin/main

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

<<<<<<< HEAD
=======
      const data = await response.json();

>>>>>>> origin/main
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
<<<<<<< HEAD
      color: "text-green-700 bg-green-100",
=======
      color: "text-gray-600 bg-gray-100",
>>>>>>> origin/main
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
<<<<<<< HEAD
      color: "text-emerald-700 bg-emerald-100",
=======
      color: "text-gray-600 bg-gray-100",
>>>>>>> origin/main
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
<<<<<<< HEAD
      color: "text-red-700 bg-red-100",
=======
      color: "text-red-600 bg-red-50",
>>>>>>> origin/main
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
<<<<<<< HEAD
      color: "text-purple-700 bg-purple-100",
=======
      color: "text-purple-600 bg-purple-50",
>>>>>>> origin/main
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
<<<<<<< HEAD
      color: "text-orange-700 bg-orange-100",
=======
      color: "text-orange-600 bg-orange-50",
>>>>>>> origin/main
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
<<<<<<< HEAD
      color: "text-blue-700 bg-blue-100",
=======
      color: "text-blue-600 bg-blue-50",
>>>>>>> origin/main
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
<<<<<<< HEAD
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
=======
      <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
        {/* Background Image/Video */}
        <div className="absolute inset-0 w-full h-full">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/premium_home.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-800/30 to-slate-900/40"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 sm:mb-6 drop-shadow-2xl"
              style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 0.6), 0 2px 10px rgba(0, 0, 0, 0.5)" }}
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-white font-light drop-shadow-lg"
              style={{ textShadow: "0 2px 15px rgba(0, 0, 0, 0.5), 0 1px 5px rgba(0, 0, 0, 0.4)" }}
            >
              Comprehensive elevator solutions from installation to maintenance
            </motion.p>
>>>>>>> origin/main
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
<<<<<<< HEAD
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
=======
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`w-20 h-20 ${service.color} rounded-full flex items-center justify-center mb-6`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6 text-base sm:text-lg">
                  {service.description}
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 mb-6">
                  {service.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start gap-2 text-gray-700">
                      <IoCheckmarkCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{point}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                {service.showLearnMore && (
                  <Link
                    href="#contact"
                    className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors text-sm sm:text-base"
                  >
                    Learn More <IoArrowForward className="ml-2" />
                  </Link>
                )}
              </motion.div>
>>>>>>> origin/main
            ))}
          </div>
        </div>
      </section>

      {/* Annual Maintenance Contract Section */}
<<<<<<< HEAD
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
=======
      <section className="py-16 sm:py-20 md:py-24 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 sm:mb-8">
                Annual Maintenance Contract
              </h2>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-6">
                Our AMC services ensure your elevators operate at peak performance throughout the year. We offer comprehensive maintenance packages tailored to your specific needs.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Monthly scheduled inspections and maintenance",
                  "Priority emergency response (24/7)",
                  "Replacement of consumables and minor parts",
                  "Lubrication and cleaning services",
                  "Compliance with safety regulations",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <IoCheckmarkCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-base sm:text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-all transform hover:scale-105 shadow-lg"
              >
                Get AMC Quote
              </button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-[400px] sm:h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="/maintainance_main.jpg"
                alt="Elevator maintenance"
                className="w-full h-full object-cover"
              />
            </motion.div>
>>>>>>> origin/main
          </div>
        </div>
      </section>

      {/* Service Process Section */}
<<<<<<< HEAD
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
=======
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Our Service Process
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              A systematic approach to ensure quality and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="text-center"
              >
                {/* Step Number Circle */}
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-2xl font-bold">{step.number}</span>
                </div>
                
                {/* Step Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                {/* Step Description */}
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {step.description}
                </p>
              </motion.div>
>>>>>>> origin/main
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
<<<<<<< HEAD
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

=======
      <section id="contact" className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 sm:mb-8 px-4">
              Need Professional Elevator Services?
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-10 sm:mb-12 max-w-3xl mx-auto px-4 font-light leading-relaxed">
              Contact us today to discuss your requirements and get a customized service plan.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
              <Link
                href="/contact"
                className="px-8 py-4 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all transform hover:scale-105 shadow-lg w-full sm:w-auto"
              >
                Contact Us
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-slate-900 transition-all transform hover:scale-105 w-full sm:w-auto"
              >
                Request Service
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
>>>>>>> origin/main
      <Footer />

      {/* AMC Quote Modal */}
      {isModalOpen && (
<<<<<<< HEAD
        <div className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="premium-card !p-0 max-w-lg w-full max-h-[95vh] overflow-y-auto reveal reveal-fade-in relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 py-8 flex items-center justify-between z-20">
              <div>
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Request Quote</h2>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Maintenance & Support</p>
              </div>
=======
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Get AMC Quote</h2>
>>>>>>> origin/main
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSubmitStatus(null);
                }}
<<<<<<< HEAD
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
=======
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-2xl text-gray-500">&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <div className="flex items-center gap-2">
                    <IoCheckmarkCircle className="w-5 h-5" />
                    <span>Request submitted successfully! We'll contact you soon.</span>
                  </div>
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  Failed to submit request. Please try again.
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us about your requirements..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmitStatus(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
>>>>>>> origin/main
        </div>
      )}
    </div>
  );
}
<<<<<<< HEAD
=======

>>>>>>> origin/main
