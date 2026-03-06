"use client";

import Link from "next/link";
<<<<<<< HEAD
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  IoMenu,
  IoClose,
  IoArrowForward,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
=======
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoMenu,
  IoClose,
} from "react-icons/io5";
>>>>>>> origin/main

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
<<<<<<< HEAD
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for sections
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      sections.forEach(section => observer.unobserve(section));
    };
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/", sections: ["hero", "welcome"] },
    { name: "About Us", href: "/about", sections: ["company", "values"] },
    { name: "Product", href: "/products", sections: ["products", "product-detail"] },
    { name: "Services", href: "/services", sections: ["services", "amc"] },
    { name: "Our Blogs", href: "/blogs", sections: ["blogs", "blog-list"] },
    { name: "Contact", href: "/contact", sections: ["contact", "cta"] },
  ];

  const isLinkActive = (item: typeof navItems[0]) => {
    if (pathname === item.href) return true;
    if (item.sections.includes(activeSection)) return true;
    return false;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? "glass-nav py-2 sm:py-3 shadow-2xl" : "bg-white/80 backdrop-blur-md py-3 sm:py-4 shadow-sm"
        } border-b border-slate-100/50`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 transition-all duration-300">
=======

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Modern Navigation Bar with Glassmorphism */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-white/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 sm:h-20">
>>>>>>> origin/main
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              {logoError ? (
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  <span className="text-gray-900">KAS</span>
                  <span className="text-gray-900 hidden sm:inline">HOME ELEVATORS</span>
                  <span className="text-gray-900 sm:hidden">ELEVATORS</span>
                </div>
              ) : (
<<<<<<< HEAD
                <div className="relative h-10 sm:h-12 md:h-14 lg:h-16 w-28 sm:w-36 md:w-44 transition-all duration-300">
                  <Image
                    src="/kas%20img.png"
                    alt="KAS Home Elevators Logo"
                    fill
                    priority
                    className="object-contain cursor-pointer transition-transform duration-500 group-hover:scale-105"
                    onError={() => setLogoError(true)}
                  />
                </div>
              )}
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-xl font-bold transition-all duration-300 tracking-wide text-xs xl:text-sm ${isLinkActive(item)
                    ? "text-green-600 bg-green-50/50 shadow-sm"
                    : "text-slate-900 hover:text-green-600 hover:bg-slate-50"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Link
                  href="/contact"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all duration-300 shadow-lg shadow-green-600/20 flex items-center gap-2 group/btn"
                >
                  Get a Quote
                  <IoArrowForward className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Link>
              </motion.div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100 shadow-sm"
=======
                <img 
                  src="/kas%20img.png" 
                  alt="KAS Home Elevators Logo" 
                  className="h-12 sm:h-14 md:h-16 w-auto object-contain cursor-pointer group-hover:scale-105 transition-transform duration-300"
                  onError={() => setLogoError(true)}
                  style={{ maxHeight: '64px' }}
                />
              )}
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/") 
                    ? "text-gray-900 bg-white shadow-sm" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/about") 
                    ? "text-gray-900 bg-white shadow-sm" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                About Us
              </Link>
              <Link
                href="/products"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/products") 
                    ? "text-gray-900 bg-white shadow-sm" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Product
              </Link>
              <Link
                href="/services"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/services") 
                    ? "text-gray-900 bg-white shadow-sm" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Services
              </Link>
              <Link
                href="/blogs"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/blogs") 
                    ? "text-gray-900 bg-white shadow-sm" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Our Blogs
              </Link>
              <Link
                href="/contact"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive("/contact") 
                    ? "text-gray-900 bg-white shadow-sm" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-white"
                }`}
              >
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
>>>>>>> origin/main
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <IoClose className="w-6 h-6" />
                ) : (
                  <IoMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

<<<<<<< HEAD
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden bg-white border-t border-slate-100/50 rounded-b-3xl mt-2 shadow-2xl"
              >
                <div className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm ${isLinkActive(item)
                        ? "bg-green-50 text-green-600"
                        : "text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="pt-4 mt-2 border-t border-slate-100/50">
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-green-600 text-white w-full py-4 rounded-2xl font-black text-center shadow-xl shadow-green-600/20 flex items-center justify-center gap-2"
                    >
                      Get a Quote
                      <IoArrowForward className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      {/* Spacer to prevent content jump */}
      <div className="h-20 sm:h-24" aria-hidden="true"></div>
    </>
  );
}
=======
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white bg-white/98 backdrop-blur-md">
              <div className="flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive("/") ? "bg-white text-gray-900 font-semibold" : "text-gray-900 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive("/about") ? "bg-white text-gray-900 font-semibold" : "text-gray-900 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  About Us
                </Link>
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive("/products") ? "bg-white text-gray-900 font-semibold" : "text-gray-900 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Product
                </Link>
                <Link
                  href="/services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive("/services") ? "bg-white text-gray-900 font-semibold" : "text-gray-900 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Services
                </Link>
                <Link
                  href="/blogs"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive("/blogs") ? "bg-white text-gray-900 font-semibold" : "text-gray-900 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Our Blogs
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive("/contact") ? "bg-white text-gray-900 font-semibold" : "text-gray-900 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}





>>>>>>> origin/main
