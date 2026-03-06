"use client";

import Link from "next/link";
import {
  IoCall,
  IoMail,
  IoLocation,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
} from "react-icons/io5";

export default function Footer() {
  const addresses = [
    {
      text: "GFH5 plot 243, 244, 2C6, Rami Reddy Nagar, Jeedimetla, Hyderabad, Telangana 500055",
      mapUrl: "https://share.google/EjPv6YDNow5AJlZz5"
    },
    {
      text: "Al Falah St - Al Danah - Zone 1 - Abu Dhabi",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Al+Falah+St+Al+Danah+Zone+1+Abu+Dhabi"
    },
    {
      text: "Level M1, 2A, Jalan Stesen Sentral 2, Kuala Lumpur Sentral, 50470 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Level+M1+2A+Jalan+Stesen+Sentral+2+Kuala+Lumpur+Sentral+50470"
    },
    {
      text: "212, 2nd Floor, Levana Cyber Heights, Vibhuti Khand, Gomti Nagar, Lucknow-226010",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=350-A+Vishal+Khand+Gomti+Nagar+Lucknow+UP"
    },
  ];

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/about#vision-mission", label: "Our Vision & Mission" },
    { href: "/about#values", label: "Why Choose Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  const socialMediaLinks = {
    facebook: "https://www.facebook.com/kashomeelevators",
    instagram: "https://www.instagram.com/kashomeelevators",
    linkedin: "https://www.linkedin.com/company/kashomeelevators",
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-16 sm:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 mb-16">
          {/* Company Introduction */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <div className="text-2xl sm:text-3xl font-black tracking-tight hover:opacity-80 transition-opacity">
                <span className="text-green-500 font-black">KAS</span>
                <span className="text-white"> HOME ELEVATORS</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 font-light">
              KAS has been a trusted leader in premium elevator solutions for over a decade. We specialize in installation, maintenance, and modernization of high-performance vertical transportation systems.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {[
                { icon: <IoLogoFacebook />, href: socialMediaLinks.facebook, label: "Facebook" },
                { icon: <IoLogoInstagram />, href: socialMediaLinks.instagram, label: "Instagram" },
                { icon: <IoLogoLinkedin />, href: socialMediaLinks.linkedin, label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <div className="w-5 h-5">{social.icon}</div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-widest text-sm">Navigation</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-green-500 transition-colors font-medium flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-green-500 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-widest text-sm">Global Contact</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 text-green-500">
                  <IoCall className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Call Us</p>
                  <a href="tel:+918019219911" className="text-slate-300 hover:text-white transition-colors font-bold break-all">
                    +91 8019219911
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0 text-green-500">
                  <IoMail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-bold">Email Us</p>
                  <a href="mailto:assist@kashomeelevators.com" className="text-slate-300 hover:text-white transition-colors font-bold break-all">
                    assist@kashomeelevators.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Addresses */}
          <div>
            <h4 className="text-white font-bold mb-8 text-lg uppercase tracking-widest text-sm">Global Presence</h4>
            <div className="space-y-4 h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {addresses.map((address, index) => (
                <div key={index} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:bg-slate-800 transition-colors duration-300 group">
                  <a
                    href={address.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3"
                  >
                    <IoLocation className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <p className="text-xs leading-relaxed text-slate-400 group-hover:text-slate-200 transition-colors">
                      {address.text}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500 font-medium">
            &copy; 2026 KAS Home Elevators Global. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-green-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-green-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
