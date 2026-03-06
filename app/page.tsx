"use client";

import { useState, useEffect, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { products as productList } from "@/data/products";
import TestimonialsScroller from "../components/TestimonialsScroller";
import {
  IoArrowForward,
  IoCheckmarkCircle,
  IoShieldCheckmark,
  IoFlash,
  IoTime,
  IoConstruct,
  IoChevronDown,
  IoStar,
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
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          {/* Fallback Background Image (shown if video fails to load) */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))",
            }}
            aria-hidden="true"
          >
            <Image
              src="/all.jpg"
              alt="Background"
              fill
              className="object-cover z-0 img-fade-in"
              priority
              quality={85}
              sizes="100vw"
            />
          </div>
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
          {/* Enhanced Overlay - Darker for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-900/80 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20 z-10"></div>
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
            <div className="flex flex-col items-center justify-center text-center px-4 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="mb-12"
              >
                <div className="inline-block px-4 py-1.5 mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full">
                  <span className="text-green-400 text-xs sm:text-sm font-bold uppercase tracking-[0.3em] text-shadow-sm">
                    Premium Vertical Solutions
                  </span>
                </div>
                <h1 className="hero-title text-white mb-8">
                  Reliable Lifts <br />
                  <span className="text-green-500">
                    Made for Life
                  </span>
                </h1>
                <p className="hero-subtitle max-w-2xl mx-auto mb-12">
                  Experience elite vertical mobility solutions engineered for absolute safety, comfort, and lifelong reliability.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-400 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        href="/contact"
                        className="premium-button bg-green-600 text-white min-w-[240px] shadow-2xl relative"
                      >
                        Get Free Quote
                      </Link>
                    </motion.div>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/services"
                      className="premium-button bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xl border-2 border-white/40 min-w-[240px] shadow-2xl transition-all duration-500"
                    >
                      View Services
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              {/* Micro-features indicator */}
              <div className="flex flex-wrap justify-center gap-8 mt-16">
                {["Pitless Design", "Gearless Technology", "Silent Operation"].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + (i * 0.2) }}
                    className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium tracking-wider"
                  >
                    <IoCheckmarkCircle className="text-green-400" />
                    {item.toUpperCase()}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>


      </section>

      {/* Welcome Section */}
      <section id="welcome" className="py-16 sm:py-20 md:py-24 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="reveal reveal-fade-right">
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
              <div className="mt-8 reveal reveal-fade-up">
                <Link
                  href="/about"
                  className="premium-button bg-slate-900 text-white"
                >
                  DISCOVER MORE
                </Link>
              </div>
            </div>
            <div className="relative reveal reveal-fade-left">
              <div className="relative h-[500px] sm:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/premium_lift.jpg"
                  alt="Luxury elevator lobby"
                  fill
                  className="object-cover img-fade-in"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-4 left-4 text-white text-sm font-medium">
                  — Kas elevators
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/premium_lift2.jpg"
                  alt="Elevator interior"
                  fill
                  className="object-cover img-fade-in"
                  sizes="(max-width: 640px) 256px, 320px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Pillars */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 reveal reveal-fade-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Our Core Value Pillars
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We stand by our commitment to excellence through these four fundamental principles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <IoShieldCheckmark className="w-8 h-8" />,
                title: "Safety First",
                desc: "Full-height light curtains and emergency ARD for total peace of mind.",
                bg: "bg-blue-50 text-blue-600",
              },
              {
                icon: <IoConstruct className="w-8 h-8" />,
                title: "Expert Installation",
                desc: "Certified in-house technicians delivering precision and quality.",
                bg: "bg-green-50 text-green-600",
              },
              {
                icon: <IoFlash className="w-8 h-8" />,
                title: "Energy Efficient",
                desc: "Advanced gearless motors reducing energy costs by up to 40%.",
                bg: "bg-orange-50 text-orange-600",
              },
              {
                icon: <IoTime className="w-8 h-8" />,
                title: "Fast Support",
                desc: "24/7 priority maintenance and rapid emergency response teams.",
                bg: "bg-purple-50 text-purple-600",
              },
            ].map((pillar, i) => (
              <div key={pillar.title} className="premium-card group reveal reveal-fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={`w-16 h-16 ${pillar.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {pillar.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="products" className="pt-[62px] pb-16 sm:pt-[78px] sm:pb-20 md:pt-[94px] md:pb-24" style={{ backgroundColor: '#cef5db' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-green-50 rounded-2xl shadow-lg p-8 sm:p-12 mb-20 border border-green-100/50">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
              {[
                { number: "10+", label: "YEARS OF EXPERIENCE" },
                { number: "500+", label: "LIFTS INSTALLED" },
                { number: "450+", label: "HAPPY CUSTOMERS" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center relative reveal reveal-fade-up"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="absolute inset-x-0 -top-8 text-7xl sm:text-8xl font-black text-gray-900/5 leading-none select-none">
                    {stat.number}
                  </div>
                  <div className="relative">
                    <div className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-[10px] sm:text-xs font-bold text-green-600 uppercase tracking-[0.2em]">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Our Products Section */}
          <div className="text-center section-title-margin reveal reveal-fade-in">
            <div className="w-24 h-1 bg-green-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-sm font-bold text-green-700 uppercase tracking-[0.3em] mb-3">
              EXPLORE OUR RANGE
            </p>
            <h2>
              Our Premium Products
            </h2>
          </div>

          <div className="space-y-12 sm:space-y-16">
            {productList.map((service, index) => (
              <div
                key={service.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center bg-green-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-10 reveal reveal-fade-up ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
              >
                {/* Image side */}
                <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer reveal reveal-fade-up">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110 img-fade-in"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>

                {/* Content side */}
                <div className="reveal reveal-fade-in lg:px-6">
                  <h3 className="mb-4 sm:mb-6">
                    {service.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                    {service.description}
                  </p>
                  <ul className="list-none text-sm sm:text-base text-gray-700 space-y-3 mb-8">
                    {service.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="reveal reveal-fade-right flex items-center gap-2" style={{ transitionDelay: `${pointIndex * 0.05}s` }}>
                        <IoCheckmarkCircle className="text-green-600 w-5 h-5 flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/products/${service.slug}`}
                    className="premium-button bg-green-600 text-white mt-8"
                  >
                    LEARN MORE
                    <IoArrowForward className="ml-2 w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Completed Projects Section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center section-title-margin reveal reveal-fade-up">
            <h2>
              Recently Completed Projects
            </h2>
            <p className="max-w-2xl mx-auto">
              Take a look at how we've transformed homes and offices across the region.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "/premium_lift.jpg", title: "Modern Penthouse", loc: "Luxury Villa, Mumbai" },
              { img: "/premium_lift2.jpg", title: "Glass Panoramic", loc: "Corporate Tower, Delhi" },
              { img: "/maintainance_main.jpg", title: "Residential Classic", loc: "Hitech City, Hyderabad" },
            ].map((proj, i) => (
              <div key={i} className="group relative overflow-hidden rounded-[32px] shadow-xl reveal reveal-fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="aspect-[4/3] relative">
                  <Image src={proj.img} alt={proj.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="w-12 h-1 bg-green-500 mb-4 rounded-full"></div>
                  <h4 className="text-2xl font-black mb-1">{proj.title}</h4>
                  <p className="text-sm text-gray-300 font-medium uppercase tracking-widest">{proj.loc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="text-center section-title-margin reveal reveal-fade-up">
            <h2>
              Featured Solutions
            </h2>
            <p className="max-w-2xl mx-auto">
              Tailored elevator systems designed for specific building requirements and safety standards.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: "/premium_lift.jpg",
                title: "Residential Lifts",
                desc: "Compact, silent, and elegant lifts perfectly suited for modern homes and villas.",
              },
              {
                img: "/display.jpg",
                title: "Commercial Lifts",
                desc: "High-traffic vertical solutions for hotels, hospitals, and corporate offices.",
              },
              {
                img: "/maintainance_main.jpg",
                title: "Maintenance Packages",
                desc: "Comprehensive AMC services ensuring 24/7 reliability and priority support.",
              },
            ].map((service, i) => (
              <div key={service.title} className="bg-green-50 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 reveal reveal-fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="aspect-video relative">
                  <Image src={service.img} alt={service.title} fill className="object-cover" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">{service.desc}</p>
                  <Link href="/services" className="text-green-600 font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                    Learn More <IoArrowForward />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-green-50 to-green-100">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20 reveal reveal-fade-up">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6">
              Why Choose KAS Elevators?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto font-light">
              Built with precision, designed for excellence
            </p>
          </div>

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
              <div
                key={feature.title}
                className="premium-card group reveal reveal-fade-up"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={`relative w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 group-hover:text-green-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <div className="text-center mb-16 reveal reveal-fade-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know about our lifts and services.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { q: "How much space is required for a home lift?", a: "Our pitless home elevators can be installed in as little as 1 square meter of space, making them ideal for existing homes." },
              { q: "What happens during a power outage?", a: "Every KAS elevator comes equipped with an Automatic Rescue Device (ARD) that safely brings the lift to the nearest floor and opens the doors during a blackout." },
              { q: "Do these lifts require regular maintenance?", a: "Yes, we recommend quarterly check-ups. Our maintenance contracts ensure 24/7 support and priority service for all our clients." },
              { q: "How long does the installation take?", a: "A typical home elevator installation takes between 7 to 10 working days, depending on the model and site conditions." },
            ].map((faq, i) => (
              <details key={i} className="group premium-card !p-0 cursor-pointer overflow-hidden reveal reveal-fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <summary className="flex items-center justify-between font-bold text-gray-900 list-none p-6 sm:p-8 hover:bg-slate-50 transition-colors">
                  <span className="text-lg sm:text-xl pr-4">{faq.q}</span>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-open:bg-green-600 group-open:text-white transition-all duration-300">
                    <IoChevronDown className="w-6 h-6 transition-transform duration-300 group-open:rotate-180" />
                  </div>
                </summary>
                <div className="px-6 sm:px-8 pb-8 text-gray-600 leading-relaxed text-base sm:text-lg font-light border-t border-slate-50 pt-6">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 reveal reveal-fade-up">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 sm:mb-8 px-4">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Request a Free Site Visit
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-10 sm:mb-12 max-w-3xl mx-auto px-4 font-light leading-relaxed">
            Take the first step towards a safer and more convenient home with a free consultation and site measurements.
          </p>
          <div className="max-w-md mx-auto mb-12 text-slate-400 text-sm font-bold flex flex-wrap justify-center gap-x-8 gap-y-4">
            <span className="flex items-center gap-2"><IoCheckmarkCircle className="text-green-500 w-5 h-5" /> NO HIDDEN COSTS</span>
            <span className="flex items-center gap-2"><IoCheckmarkCircle className="text-green-500 w-5 h-5" /> EXPERT INSTALLATION</span>
          </div>
          <Link
            href="/contact"
            className="premium-button bg-green-600 text-white px-16 py-5 shadow-2xl shadow-green-600/20"
          >
            Book Free Inspection
          </Link>
        </div>
      </section>

      <TestimonialsScroller />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
