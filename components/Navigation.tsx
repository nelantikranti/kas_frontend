"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IoMenu,
  IoClose,
} from "react-icons/io5";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Modern Navigation Bar with Glassmorphism */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-white/50 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-18 sm:h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              {logoError ? (
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  <span className="text-gray-900">KAS</span>
                  <span className="text-gray-900 hidden sm:inline">HOME ELEVATORS</span>
                  <span className="text-gray-900 sm:hidden">ELEVATORS</span>
                </div>
              ) : (
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

          </div>

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
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 bg-gradient-to-r from-white to-white text-gray-900 rounded-lg font-semibold hover:from-gray-100 hover:to-gray-100 transition-all duration-300 text-center shadow-md mt-2"
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}





