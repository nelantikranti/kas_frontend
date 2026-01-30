"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  IoArrowForward,
  IoCheckmarkCircle,
} from "react-icons/io5";

export default function LandingPage() {
  const router = useRouter();
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [demoForm, setDemoForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  // Validation helper functions
  const handlePhoneChange = (value: string, setDemoFormFn: any, demoFormObj: any) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Allow only up to 10 digits
    if (cleaned.length <= 10) {
      setDemoFormFn({ ...demoFormObj, phone: cleaned });
    }
  };

  const validatePhone = (phone: string): boolean => {
    // Must be exactly 10 digits
    return /^\d{10}$/.test(phone);
  };

  const features = [
    {
      title: "World's Safest Home Elevators",
      subtitle: "(Gearless, Machine-room-less, Pitless design)",
    },
    {
      title: "Patented Belt-Driven Technology",
      subtitle: "(Ensures silent, vibration-free operation)",
    },
    {
      title: "Energy Efficient Systems",
      subtitle: "(Low power consumption)",
    },
    {
      title: "24/7 Remote Monitoring",
      subtitle: "(Real-time error detection system)",
    },
    {
      title: "Premium Aesthetics & Space-Saving Design",
      subtitle: "(Ideal for any homes)",
    },
  ];

  // Cycle through banners automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % features.length);
    }, 3000); // Change banner every 3 seconds

    return () => clearInterval(interval);
  }, [features.length]);

  const handleDemoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Validation
    if (demoForm.phone && !validatePhone(demoForm.phone)) {
      setSubmitStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(demoForm),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setDemoForm({ name: "", email: "", phone: "", company: "", message: "" });
        // Close modal after 2 seconds
        setTimeout(() => {
          setIsDemoModalOpen(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
        console.error("Submission error:", data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Failed to submit demo request:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#cef5db' }}>
      <Navigation />

      {/* Hero Banner Section */}
      <section className="relative min-h-[90vh] sm:min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          {/* Fallback Background Image (shown if video fails to load) */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/all.jpg')",
            }}
            aria-hidden="true"
          />
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src="/latest_home.mp4" type="video/mp4" />
          </video>
          {/* Enhanced Overlay - Lighter for better video visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Animated Feature Banner - Show one at a time, text only */}
            <div className="min-h-[220px] sm:min-h-[260px] md:min-h-[300px] flex flex-col items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentBannerIndex}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ 
                    duration: 0.7, 
                    ease: [0.22, 0.61, 0.36, 1] // smoother, professional ease
                  }}
                  className="text-center"
                >
                  <motion.h2 
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 md:mb-5 leading-tight relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.15, 
                      duration: 0.7,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={{
                      background: "linear-gradient(135deg, #ffffff 0%, #f8f8f8 25%, #ffffff 50%, #f0f0f0 75%, #ffffff 100%)",
                      backgroundSize: "200% 200%",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 4px 20px rgba(255, 255, 255, 0.25))",
                      animation: "gradientShift 5s linear infinite",
                    }}
                  >
                    {features[currentBannerIndex].title}
                  </motion.h2>
                  <style jsx>{`
                    @keyframes gradientShift {
                      0%, 100% { background-position: 0% 50%; }
                      50% { background-position: 100% 50%; }
                    }
                  `}</style>
                  <motion.p 
                    className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-100 font-semibold tracking-wide"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.3, 
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={{
                      textShadow: "0 2px 15px rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {features[currentBannerIndex].subtitle}
                  </motion.p>
                  {/* Decorative indicators */}
                  <motion.div
                    className="flex justify-center items-center gap-2 mt-4 sm:mt-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.45, 
                      duration: 0.5,
                      ease: [0.34, 1.56, 0.64, 1] // Bounce effect for dots
                    }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/70"
                        initial={{ opacity: 0.5, scale: 0.8 }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          delay: i * 0.25,
                          ease: [0.4, 0, 0.6, 1], // Smooth ease-in-out
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Hero Request Demo button (static, separate from banner animation) */}
              <div className="mt-10 sm:mt-12 flex justify-center">
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="relative flex items-center px-10 py-4 overflow-hidden font-semibold text-lg transition-all bg-green-600 rounded-lg group shadow-2xl hover:shadow-green-500/50 hover:scale-105"
                  style={{
                    clipPath:
                      'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
                  }}
                >
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-700 rounded group-hover:-mr-3 group-hover:-mt-3">
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                  </span>
                  <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-700 rounded group-hover:-ml-3 group-hover:-mb-3">
                    <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-green-700 rounded-lg group-hover:translate-x-0" />
                  <span className="relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                    Request Demo
                  </span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.2, 
              ease: [0.4, 0, 0.6, 1] 
            }}
            className="w-7 h-12 border-2 border-white/70 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-white/10 shadow-lg"
          >
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ 
                repeat: Infinity, 
                duration: 2.2, 
                ease: [0.4, 0, 0.6, 1],
                delay: 0.1
              }}
              className="w-2 h-2 bg-white rounded-full shadow-lg"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 sm:mb-8">
                Welcome To KAS
              </h2>
              <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-base sm:text-lg">
                <p>
                KAS is a leading elevator manufacturer committed to quality, safety, and innovation. Our advanced manufacturing processes and cutting-edge technology have shaped vertical transportation across the globe. Known for reliability and precision, our elevators deliver an exceptional ride experience.                </p>
                <p>
                We design elevators for residential, industrial, and hospitality sectors, offering space-saving and versatile solutions tailored to modern needs. With a strong focus on sustainability, KAS uses eco-friendly technologies to conserve energy and reduce environmental impact. Our elevators are built with the highest safety standards, ensuring quick response in emergencies.                </p>
                <p>
                Globally recognised and customer-focused, KAS is your trusted partner in vertical transportation—elevating your world with convenience and confidence                </p>
                <p>
                  KAS, the best elevator company is a globally recognised partner for vertical transport. With products for various sectors and the best customer service, we promise to elevate your world with convenience.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 sm:mt-8"
              >
                <Link
                  href="/about"
                  className="inline-block px-8 py-4 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-all transform hover:scale-105 shadow-lg"
                >
                  DISCOVER MORE
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative h-[500px] sm:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/premium_lift.jpg"
                  alt="Luxury elevator lobby"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                  — Kas elevators
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/premium_lift2.jpg"
                  alt="Elevator interior"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="pt-[62px] pb-16 sm:pt-[78px] sm:pb-20 md:pt-[94px] md:pb-24" style={{ backgroundColor: '#cef5db' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-green-50 rounded-2xl shadow-lg p-8 sm:p-12 mb-20 border border-green-100/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { number: "1100+", label: "PROJECTS COMPLETED" },
              { number: "800+", label: "HAPPY CLIENTS" },
              { number: "500+", label: "DESIGN MADE" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="text-center relative"
              >
                <div className="text-9xl sm:text-[12rem] font-extrabold text-gray-200/30 leading-none mb-4">
                  {index + 1}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-3">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-gray-600 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
            </div>
          </div>

          {/* Our Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-4"></div>
            <p className="text-sm sm:text-base font-semibold text-gray-600 uppercase tracking-wider mb-2">
              WHAT CAN WE OFFER
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900">
              Our Products
            </h2>
          </motion.div>

          <div className="space-y-12 sm:space-y-16">
            {[
              {
                title: "Hydraulic Elevator",
                description:
                  "Reliable and cost-effective elevator solution for low to mid-rise buildings, engineered for smooth and stable performance in everyday use.",
                image: "/premium_lift7.jpeg",
                points: [
                  "Ideal for residential and commercial low to mid-rise buildings",
                  "Smooth ride quality with powerful hydraulic drive",
                  "Lower initial cost and easy installation",
                  "High load capacity for regular passenger movement",
                ],
              },
              {
                title: "Traction Elevators",
                description:
                  "Specialized elevator designed for hospitals and medical facilities, with wide cabins and safe, jerk-free movement for patients and medical staff.",
                image: "/premium_lift3.jpg",
                points: [
                  "Extra-wide cabin to accommodate stretchers and wheelchairs",
                  "Smooth acceleration and deceleration for patient comfort",
                  "Anti-skid flooring and strong handrails for safety",
                  "Suitable for hospitals, clinics, and healthcare centers",
                ],
              },
              {
                title: "Pneumatic Elevator",
                description:
                  "Compact, air-powered home elevator with minimal civil work, perfect for modern villas and low-rise homes.",
                image: "/pneumatic.webp",
                points: [
                  "Space-saving cylindrical design for tight spaces",
                  "Works on air pressure technology with low power consumption",
                  "Quick installation with minimal shaft and pit requirements",
                  "Perfect for duplex homes, bungalows, and private residences",
                ],
              },
              {
                title: "MRL (Machine Room-Less) Elevator",
                description:
                  "Energy-efficient elevator without a separate machine room, designed for modern buildings that demand both space savings and premium aesthetics.",
                image: "/premium_lift5.jpg",
                points: [
                  "No dedicated machine room required – saves building space",
                  "Efficient gearless technology for smooth and quiet ride",
                  "Flexible design options for residential and commercial use",
                  "Ideal for apartments, offices, malls, and premium buildings",
                ],
              },
            ].map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center bg-green-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-10 ${
                  index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image side */}
                <motion.div 
                  className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                  initial={{ 
                    opacity: 0,
                    x: index % 2 === 0 ? -60 : 60,
                    scale: 0.95
                  }}
                  whileInView={{ 
                    opacity: 1,
                    x: 0,
                    scale: 1
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    delay: index * 0.1 + 0.2,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
                    }}
                  />
                  {/* Overlay gradient on hover */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Shine effect */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
                  />
                </motion.div>

                {/* Content side */}
                <motion.div
                  initial={{ 
                    opacity: 0,
                    x: index % 2 === 0 ? 60 : -60,
                    y: 20
                  }}
                  whileInView={{ 
                    opacity: 1,
                    x: 0,
                    y: 0
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    delay: index * 0.1 + 0.3,
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                    {service.description}
                  </p>
                  <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 space-y-1 sm:space-y-2 mb-6 sm:mb-8">
                    {service.points.map((point, pointIndex) => (
                      <motion.li 
                        key={point}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          delay: index * 0.1 + 0.3 + (pointIndex * 0.1),
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      >
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                  <Link
                    href="/products"
                    className="inline-flex items-center text-sm sm:text-base font-semibold uppercase tracking-wide border-b-2 pb-2 transition-colors text-gray-900 border-green-600 hover:border-green-700"
                  >
                    READ MORE
                    <IoArrowForward className="ml-2" />
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Elevate Experience Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-green-50 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <motion.div
                className="relative h-[500px] sm:h-[600px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer"
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                }}
              >
                <motion.img
                  src="./display.jpg"
                  alt="KAS Elevator"
                  className="w-full h-full object-cover"
                  whileHover={{
                    scale: 1.06,
                    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                  }}
                />
                {/* Soft gradient overlay on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Subtle shine sweep on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 sm:mb-8">
              Modern Passenger Elevator.
              </h2>
              <div className="space-y-5 sm:space-y-6 text-gray-700 leading-relaxed text-base sm:text-lg">
                <p>
                Experience smooth and modern lift operation with our advanced touchscreen control panel, designed for comfort, safety, and elegance.
                </p>
                <p> • Sleek touchscreen interface for effortless floor selection
                  <br />

• Bright LED-illuminated display for clear visibility
<br />
• Instant floor confirmation with highlighted selection
<br />
• Modern, minimalist design for premium interiors

                </p>
                <p>
                <b>Ideal for:</b>
                <br />
                Apartments, offices, hotels, hospitals, and commercial <br /> spaces where comfort, safety, and style matter.
                </p>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-green-50 to-green-100">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 sm:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Why Choose KAS Elevators?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Built with precision, designed for excellence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: <IoCheckmarkCircle className="w-12 h-12" />,
                title: "Advanced Safety",
                description: "State-of-the-art safety systems with emergency backup and fail-safe mechanisms.",
                color: "text-green-600 bg-green-50",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: <IoCheckmarkCircle className="w-12 h-12" />,
                title: "Smart Control",
                description: "Intuitive touch controls and smartphone integration for seamless operation.",
                color: "text-green-600 bg-green-50",
                gradient: "from-green-500 to-green-600",
              },
              {
                icon: <IoCheckmarkCircle className="w-12 h-12" />,
                title: "Durable Engineering",
                description: "Built to last with premium materials and rigorous quality testing.",
                color: "text-orange-600 bg-orange-50",
                gradient: "from-orange-500 to-orange-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.7, ease: "easeOut" }}
                className="group relative p-8 sm:p-10 rounded-3xl bg-green-50 border border-green-100/50 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                <div className={`relative w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Animated background elements */}
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
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Ready To Book Your Design?
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-10 sm:mb-12 max-w-3xl mx-auto px-4 font-light leading-relaxed">
            Upgrade your home with premium elevator cabins that combine comfort, safety, and elegant design..
            </p>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="relative flex items-center px-10 py-5 overflow-hidden font-semibold text-lg transition-all bg-green-600 rounded-lg group shadow-2xl hover:shadow-green-500/50 hover:scale-105"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                }}
              >
                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                </span>
                <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-green-700 rounded group-hover:-ml-4 group-hover:-mb-4">
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white" />
                </span>
                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-green-700 rounded-lg group-hover:translate-x-0" />
                <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                Request Demo
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <section>
        <Footer />
      </section>

      {/* Demo Request Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Request Demo</h2>
              <button
                onClick={() => {
                  setIsDemoModalOpen(false);
                  setSubmitStatus(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-2xl text-gray-500">&times;</span>
              </button>
            </div>
            <form onSubmit={handleDemoSubmit} className="p-6 space-y-4">
              {submitStatus === "success" && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  <div className="flex items-center gap-2">
                    <IoCheckmarkCircle className="w-5 h-5" />
                    <span>Demo request submitted successfully! We'll contact you soon.</span>
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
                  value={demoForm.name}
                  onChange={(e) => setDemoForm({ ...demoForm, name: e.target.value })}
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
                  value={demoForm.email}
                  onChange={(e) => setDemoForm({ ...demoForm, email: e.target.value })}
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
                  value={demoForm.phone}
                  onChange={(e) => handlePhoneChange(e.target.value, setDemoForm, demoForm)}
                  maxLength={10}
                  pattern="[0-9]{10}"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter 10 digit phone number"
                />
                {demoForm.phone && demoForm.phone.length !== 10 && (
                  <p className="text-xs text-red-600 mt-1">Phone number must be exactly 10 digits</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={demoForm.company}
                  onChange={(e) => setDemoForm({ ...demoForm, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter company name (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={demoForm.message}
                  onChange={(e) => setDemoForm({ ...demoForm, message: e.target.value })}
                  rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Any specific requirements or questions?"
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
                    setIsDemoModalOpen(false);
                    setSubmitStatus(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
