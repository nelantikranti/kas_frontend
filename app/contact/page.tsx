"use client";

<<<<<<< HEAD
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
=======
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
>>>>>>> origin/main
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  IoCall,
  IoMail,
  IoLocation,
  IoTime,
} from "react-icons/io5";
<<<<<<< HEAD
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactPage() {
  const router = useRouter();

  // Validation helper functions
  const handlePhoneChange = (value: string, setFormDataFn: any, formDataObj: any) => {
    const cleaned = value.replace(/\D/g, '');
=======

export default function ContactPage() {
  const router = useRouter();
  
  // Validation helper functions
  const handlePhoneChange = (value: string, setFormDataFn: any, formDataObj: any) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    // Allow only up to 10 digits
>>>>>>> origin/main
    if (cleaned.length <= 10) {
      setFormDataFn({ ...formDataObj, phone: cleaned });
    }
  };

  const handleTextChange = (field: string, value: string, setFormDataFn: any, formDataObj: any) => {
<<<<<<< HEAD
=======
    // Allow only letters, spaces, and common punctuation for names
>>>>>>> origin/main
    const cleaned = value.replace(/[^a-zA-Z\s\.\-'']/g, '');
    setFormDataFn({ ...formDataObj, [field]: cleaned });
  };

  const validatePhone = (phone: string): boolean => {
<<<<<<< HEAD
=======
    // Must be exactly 10 digits
>>>>>>> origin/main
    return /^\d{10}$/.test(phone);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
<<<<<<< HEAD
    service: "",
=======
>>>>>>> origin/main
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

<<<<<<< HEAD
=======
    // Validation
>>>>>>> origin/main
    if (/\d/.test(formData.name)) {
      setErrorMessage("Name should only contain letters and spaces.");
      setIsSubmitting(false);
      setSubmitStatus("error");
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      setErrorMessage("Phone number must be exactly 10 digits.");
      setIsSubmitting(false);
      setSubmitStatus("error");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
<<<<<<< HEAD
        setFormData({ name: "", email: "", phone: "", service: "", subject: "", message: "" });
=======
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        // Redirect to thank you page
>>>>>>> origin/main
        router.push("/thank-you");
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.error || "Failed to send message. Please try again.");
<<<<<<< HEAD
=======
        console.error("Submission error:", data.error || "Unknown error");
>>>>>>> origin/main
      }
    } catch (error: any) {
      console.error("Failed to submit contact form:", error);
      setSubmitStatus("error");
<<<<<<< HEAD
      setErrorMessage("Failed to send message. Please try again.");
=======
      if (error.message?.includes("fetch") || error.name === "TypeError") {
        setErrorMessage("Cannot connect to server. Please ensure the backend server is running on port 5000.");
      } else {
        setErrorMessage("Failed to send message. Please try again.");
      }
>>>>>>> origin/main
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />
<<<<<<< HEAD

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/Contact.jpg"
          alt="Contact Us"
          fill
          priority
          className="object-cover z-0 brightness-75 scale-110 blur-[2px] img-fade-in"
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            <div className="inline-block px-5 py-2 mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full">
              <span className="text-green-400 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-shadow-sm">
                Global Support Hub
              </span>
            </div>
            <h1 className="hero-title text-white mb-10">
              Let's Start a <br />
              <span className="text-green-500">Conversation</span>
            </h1>
            <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
              Our experts are ready to personalize your vertical mobility journey with safety, precision, and care.
            </p>
            <div className="flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="#contact-form"
                  className="premium-button bg-green-600 text-white min-w-[260px] shadow-2xl"
                >
                  Send a Message
                </Link>
              </motion.div>
            </div>
=======
      
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-44 pb-20 sm:pb-28 md:pb-32 lg:pb-40 bg-cover bg-center bg-no-repeat text-white" 
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/Contact.jpg')",
        }}>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">Contact Us</h1>
            <p className="text-base sm:text-lg md:text-xl text-white">
              Get in touch with our team - we're here to help
            </p>
>>>>>>> origin/main
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
<<<<<<< HEAD
      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 content-gap">
            {/* Contact Form */}
            <div className="reveal reveal-fade-right">
              <div className="premium-card !p-8 sm:!p-12">
                <div className="mb-10">
                  <div className="w-16 h-1 bg-green-500 mb-6 rounded-full"></div>
                  <h2 className="mb-3">Send us a Message</h2>
                  <p className="text-slate-500 font-medium italic">
                    “Tell us how we can help — we’ll get back to you quickly.”
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">
                      <p className="font-bold mb-1">Could not send message</p>
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleTextChange('name', e.target.value, setFormData, formData)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300 text-slate-900 font-medium"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300 text-slate-900 font-medium"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handlePhoneChange(e.target.value, setFormData, formData)}
                        maxLength={10}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300 text-slate-900 font-medium"
                        placeholder="10 digit number"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Service Required *</label>
                      <select
                        required
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300 text-slate-900 font-medium cursor-pointer appearance-none"
                      >
                        <option value="" disabled>Select a purpose</option>
                        <option value="New Lift Installation">New Lift Installation</option>
                        <option value="Lift Maintenance & Service">Lift Maintenance & Service</option>
                        <option value="Modernization">Elevator Modernization</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Subject *</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300 text-slate-900 font-medium"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Your Message *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-300 text-slate-900 font-medium resize-none"
                      placeholder="Provide some details about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="premium-button w-full bg-slate-900 text-white !py-5 shadow-2xl"
                  >
                    {isSubmitting ? "Processing Inquiry..." : "Submit Message"}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="reveal reveal-fade-left lg:pl-10">
              <div className="mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-6 italic tracking-tight">Our Presence</h2>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  We're here to answer your questions and help you find the perfect elevator solution. Connect with our technical experts globally.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: <IoCall />, title: "Technical Support", val: "+91 8019219911", sub: "Available Mon - Sat, 9:00 - 18:00", bg: "bg-blue-50 text-blue-600" },
                  { icon: <IoMail />, title: "General Inquiries", val: "assist@kashomeelevators.com", sub: "We'll respond within 24 hours", bg: "bg-green-50 text-green-600" },
                  { icon: <IoLocation />, title: "Global Headquarters", val: "KAS Home Elevators, India", sub: "Serving international markets", bg: "bg-orange-50 text-orange-600" },
                ].map((item, i) => (
                  <div key={item.title} className="flex items-start gap-6 reveal reveal-fade-up p-2 group" style={{ transitionDelay: `${i * 0.1}s` }}>
                    <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <div className="w-6 h-6">{item.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{item.title}</h3>
                      <p className="text-lg font-black text-slate-900 mb-1">{item.val}</p>
                      <p className="text-sm text-slate-500 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
=======
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitStatus === "error" && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <p className="font-semibold mb-1">Failed to send message</p>
                    <p className="text-sm">{errorMessage || "Please check if the backend server is running and MongoDB is connected. Try again later."}</p>
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
                    onChange={(e) => handleTextChange('name', e.target.value, setFormData, formData)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your name (text only)"
                    pattern="[A-Za-z\s\.\-\'']+"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    onChange={(e) => handlePhoneChange(e.target.value, setFormData, formData)}
                    maxLength={10}
                    pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter 10 digit phone number"
                  />
                  {formData.phone && formData.phone.length !== 10 && (
                    <p className="text-xs text-red-600 mt-1">Phone number must be exactly 10 digits</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're here to answer your questions and help you find the perfect elevator solution
                for your needs. Reach out to us through any of the following channels.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoCall className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 8019219911</p>
                    <p className="text-sm text-gray-500">Mon - Sat, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoMail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">assist@kashomeelevators.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoLocation className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                    <p className="text-gray-600">
                      KAS Home Elevators<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoTime className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
>>>>>>> origin/main
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
<<<<<<< HEAD
=======



>>>>>>> origin/main
