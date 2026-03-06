"use client";
import { memo } from "react";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  IoCheckmarkCircle,
  IoPeople,
  IoFlash,
  IoBuild,
} from "react-icons/io5";
import { motion } from "framer-motion";

// Data constants
const coreValues = [
  {
    icon: <IoCheckmarkCircle className="w-12 h-12" />,
    title: "Quality First",
    description: "We never compromise on quality, ensuring every product meets the highest standards.",
    color: "text-green-500 bg-green-50",
  },
  {
    icon: <IoPeople className="w-12 h-12" />,
    title: "Customer Focus",
    description: "Our customers are at the heart of everything we do. Their satisfaction is our success.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: <IoFlash className="w-12 h-12" />,
    title: "Technology",
    description: "We leverage advanced technology and smart systems to deliver efficient, future-ready, and high-performance solutions.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: <IoBuild className="w-12 h-12" />,
    title: "Safety",
    description: "We prioritize safety at every stage, following strict standards and protocols to ensure secure, reliable, and worry-free operation.",
    color: "text-purple-600 bg-purple-50",
  },
] as const;

const stats = [
  { number: "800+", label: "Installations" },
  { number: "85+", label: "Experienced Team" },
  { number: "15+", label: "Years Experience" },
  { number: "7+", label: "Products" },
] as const;

const products = [
  {
    name: "KAS Elevate X",
    description: "Luxury home elevator with cutting-edge features and elegant design.",
  },
  {
    name: "KAS GX 630",
    description: "Compact, reliable, and perfect for modern homes.",
  },
  {
    name: "KAS 360",
    description: "Shaft Free - Home elevator for effortless installation and modern living.",
  },
  {
    name: "KAS SafeRise X5",
    description: "Advanced safety and smooth performance in every ride.",
  },
] as const;

function AboutPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/about.jpg"
          alt="About KAS"
          fill
          priority
          className="object-cover z-0 brightness-75 scale-110 blur-[1px] img-fade-in"
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-900/90 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/30 z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-block px-5 py-2 mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full">
                <span className="text-green-400 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-shadow-sm">
                  Our Legacy & Mission
                </span>
              </div>
              <h1 className="hero-title text-white mb-10">
                Pioneering <br />
                <span className="text-green-500">Vertical Mobility</span>
              </h1>
              <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
                Since 2014, KAS has been redefining the standards of safety and luxury in home elevators across the globe.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="premium-button bg-green-600 text-white min-w-[240px] shadow-2xl"
                  >
                    Partner With Us
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#company"
                    className="premium-button bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xl border-2 border-white/30 min-w-[240px]"
                  >
                    Our Journey
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Introduction Section */}
      <section id="company" className="py-24 sm:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 sm:gap-20 items-center">
            <div className="reveal reveal-fade-right">
              <div className="w-20 h-1.5 bg-green-500 mb-8 rounded-full"></div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight">
                Our Legacy in <br />
                <span className="text-green-600">Vertical Mobility</span>
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed text-xl sm:text-2xl font-light">
                KAS Home Elevators is a trusted name in high-end mobility solutions, dedicated to making every space accessible, stylish, and comfortable.
              </p>
              <div className="mb-10 space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Uncompromising Standards:</h3>
                <ul className="grid grid-cols-1 gap-4">
                  {products.map((product, index) => (
                    <li
                      key={product.name}
                      className="flex items-center gap-4 reveal reveal-fade-right p-4 rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-xl transition-all duration-300"
                      style={{ transitionDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 text-green-600">
                        <IoCheckmarkCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900">{product.name}</span>
                        <p className="text-slate-500 text-sm italic">{product.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg font-light reveal reveal-fade-up">
                At KAS, we believe an elevator is more than a convenience — it's an investment in safety and lifestyle. Our skilled team ensures a seamless experience from initial consultation to long-term maintenance.
              </p>
            </div>
            <div className="relative reveal reveal-fade-left">
              <div className="relative h-[600px] sm:h-[700px] rounded-[60px] overflow-hidden shadow-2xl scale-95 hover:scale-100 transition-transform duration-700">
                <Image
                  src="/about_home.jpg"
                  alt="Modern home elevator installation"
                  fill
                  className="object-cover img-fade-in"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-green-600 rounded-[40px] flex flex-col items-center justify-center p-8 text-white shadow-2xl rotate-3">
                <span className="text-6xl font-black italic">10+</span>
                <span className="text-sm font-bold uppercase tracking-widest text-green-100 mt-2 text-center">Years of Engineering Excellence</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section id="values" className="section-padding bg-slate-50 scroll-mt-20">
        <div className="section-container">
          <div className="text-center section-title-margin reveal reveal-fade-up">
            <h2 className="uppercase">
              Our Core Values
            </h2>
            <p className="max-w-2xl mx-auto">The principles that guide every lift we install and every service we provide.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className="premium-card group reveal reveal-fade-up"
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 ${value.color} rounded-[28px] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed text-lg font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500 rounded-full blur-[120px]"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
            {stats.map((stat, i) => (
              <div key={stat.label} className="reveal reveal-fade-up" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
                  {stat.number}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-green-400 uppercase tracking-[0.3em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="vision-mission" className="section-padding bg-white scroll-mt-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 content-gap">
            <div className="premium-card !p-10 sm:!p-16 reveal reveal-fade-right">
              <div className="w-16 h-1 bg-green-500 mb-8 rounded-full"></div>
              <h3>Our Mission</h3>
              <p>
                To provide world-class elevator solutions that enhance the quality of life. We strive to deliver innovative, safe, and reliable vertical transportation systems that exceed expectations while maintaining the highest standards of service.
              </p>
            </div>
            <div className="premium-card !p-10 sm:!p-16 !bg-green-50/50 reveal reveal-fade-left">
              <div className="w-16 h-1 bg-green-500 mb-8 rounded-full"></div>
              <h3>Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-xl font-light">
                To become the most trusted and innovative elevator solutions provider globally, recognized for excellence in engineering and customer service. We envision a future where mobility is seamless.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Bottom CTA */}
      <section className="py-24 sm:py-32 bg-slate-50 text-center border-t border-slate-100">
        <div className="container mx-auto px-4 reveal reveal-fade-up">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight italic">
              Ready to Experience <br />
              <span className="text-green-600">The KAS Touch?</span>
            </h2>
            <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
              Whether you're looking for a new installation or specialized maintenance, our experts are just a click away to guide you through the process.
            </p>
            <div className="pt-6">
              <Link
                href="/contact"
                className="premium-button bg-green-600 text-white min-w-[280px]"
              >
                Book a Site Evaluation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default memo(AboutPage);
