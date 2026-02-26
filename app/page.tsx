"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { products as productList } from "@/data/products";
import TestimonialsScroller from "../components/TestimonialsScroller";
import {
  IoArrowForward,
  IoCheckmarkCircle,
} from "react-icons/io5";

export default function LandingPage() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Validation helpers (kept for other forms)

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

  

 

  // Avoid hydration mismatch by rendering testimonials only after client mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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

              {/* Hero CTA removed */}
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
            {productList.map((service, index) => (
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
                    href={`/products/${service.slug}`}
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
                color: "text-green-600 bg-green-50",
                gradient: "from-green-500 to-green-600",
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
              {/* CTA removed */}
            </div>
          </motion.div>
        </div>
      </section>

      <TestimonialsScroller />

      {/* Footer Section */}
      <section>
        <Footer />
      </section>
    </div>
  );
}
