"use client";

import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { IoCheckmarkCircle, IoArrowForward } from "react-icons/io5";
import { motion } from "framer-motion";

export default function ProductsPage() {

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/product.jpg"
          alt="Our Products"
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-block px-5 py-2 mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full">
                <span className="text-green-400 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-shadow-sm">
                  Vertical Excellence Range
                </span>
              </div>
              <h1 className="hero-title text-white mb-10">
                World-Class <br />
                <span className="text-green-500">Elevators</span>
              </h1>
              <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
                Explore our comprehensive range of high-performance lifts engineered for absolute safety, refined comfort, and reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="premium-button bg-green-600 text-white min-w-[240px] shadow-2xl"
                  >
                    Get Free Quote
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#products"
                    className="premium-button bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xl border-2 border-white/30 min-w-[240px]"
                  >
                    Explore Range
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section id="products" className="section-padding bg-green-50/30">
        <div className="section-container">
          <div className="space-y-12 sm:space-y-16 rounded-3xl p-8 sm:p-12" style={{ backgroundColor: 'rgba(206, 245, 219, 0.5)' }}>
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
                image: "/Pneumatic.jpeg",
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
              <div
                key={service.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center bg-green-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-10 reveal reveal-fade-up ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
              >
                {/* Image side */}
                <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer reveal reveal-fade-right">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 img-fade-in"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </div>

                {/* Content side */}
                <div className="reveal reveal-fade-left">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
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
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-700 font-bold rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mt-2 uppercase tracking-widest text-xs"
                  >
                    Inquire Now
                    <IoArrowForward className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-green-50/30">
        <div className="section-container">
          <div className="text-center section-title-margin reveal reveal-fade-up">
            <h2>
              Why Choose Our Products?
            </h2>
            <p className="max-w-2xl mx-auto">
              Advanced technology meets exceptional craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Advanced Safety Systems",
                description: "Multiple safety mechanisms including emergency brakes, backup power, and 24/7 monitoring.",
              },
              {
                title: "Energy Efficient",
                description: "Eco-friendly designs that reduce energy consumption by up to 40% compared to traditional systems.",
              },
              {
                title: "Smart Technology",
                description: "IoT-enabled elevators with predictive maintenance and intelligent destination control.",
              },
              {
                title: "Customizable Design",
                description: "Wide range of finishes, materials, and design options to match your aesthetic preferences.",
              },
              {
                title: "Quick Installation",
                description: "Streamlined installation process with minimal disruption to your daily operations.",
              },
              {
                title: "Comprehensive Warranty",
                description: "Industry-leading warranty coverage with dedicated support throughout the product lifecycle.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 bg-green-50 rounded-xl border border-green-100/50 hover:shadow-2xl transition-all duration-300 hover:border-green-400 relative overflow-hidden reveal reveal-fade-up"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="relative z-10">
                  <h3 className="mb-3 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-green-600 via-green-500 to-green-400 text-white">
        <div className="section-container text-center reveal reveal-fade-up">
          <h2 className="text-white">
            Find Your Perfect Solution
          </h2>
          <p className="text-slate-100 max-w-3xl mx-auto">
            Not sure which lift fits your space? Our technical experts offer free site consultations to guide your choice.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all transform hover:-translate-y-1 shadow-2xl uppercase tracking-widest text-sm"
          >
            Book Free Inspection
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
