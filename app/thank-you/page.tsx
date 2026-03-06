"use client";

import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { IoCheckmarkCircle, IoArrowBack, IoHome } from "react-icons/io5";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      {/* Thank You Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/premium_lift.jpg"
          alt="Thank You"
          fill
          priority
          className="object-cover z-0 brightness-75 blur-[1px] img-fade-in"
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <div className="flex justify-center mb-6 reveal reveal-scale-up active delay-200">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full flex items-center justify-center">
                <IoCheckmarkCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600" />
              </div>
            </div>

            {/* Thank You Message */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Thank You!
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-8">
              Your message has been sent successfully.
            </p>

            <p className="text-base sm:text-lg text-slate-300 mb-12 leading-relaxed">
              We've received your message and our team will get back to you soon.
              We appreciate your interest in KAS Home Elevators and look forward to assisting you.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <IoHome className="w-5 h-5" />
                Back to Home
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xl border border-white/30 rounded-lg font-semibold transition-colors"
              >
                <IoArrowBack className="w-5 h-5" />
                Back to Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
