"use client";

import { useState, useEffect } from "react";
<<<<<<< HEAD
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { IoCheckmarkCircle, IoArrowForward, IoCalendar, IoPerson } from "react-icons/io5";
import { blogsAPI, Blog } from "@/lib/api";
import { motion } from "framer-motion";
=======
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoCalendar, IoPerson, IoArrowForward } from "react-icons/io5";
import { blogsAPI, Blog } from "@/lib/api";
>>>>>>> origin/main

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const fetchedBlogs = await blogsAPI.getAll(false); // Get only published blogs
<<<<<<< HEAD
      setBlogs(fetchedBlogs || []);
    } catch (error) {
      console.error("Failed to load blogs:", error);
      setBlogs([]);
=======
      console.log("Fetched blogs from API:", fetchedBlogs);
      setBlogs(fetchedBlogs || []); // Ensure it's always an array
    } catch (error) {
      console.error("Failed to load blogs:", error);
      setBlogs([]); // Set empty array on error
>>>>>>> origin/main
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />
<<<<<<< HEAD

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/all.jpg"
          alt="Our Blogs"
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-block px-5 py-2 mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/20 rounded-full">
                <span className="text-green-400 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-shadow-sm">
                  Knowledge & Innovation
                </span>
              </div>
              <h1 className="hero-title text-white mb-10">
                Vertical Insights <br />
                <span className="text-green-500">& Guides</span>
              </h1>
              <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
                Stay updated with the latest industry trends, safety protocols, and smart home elevator innovations.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/contact"
                    className="premium-button bg-green-600 text-white min-w-[240px] shadow-2xl"
                  >
                    Subscribe Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="#blogs"
                    className="premium-button bg-white/10 hover:bg-white text-white hover:text-slate-900 backdrop-blur-xl border-2 border-white/30 min-w-[240px]"
                  >
                    Read Articles
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
=======
      
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-32 md:pt-36 lg:pt-44 pb-20 sm:pb-28 md:pb-32 lg:pb-40 bg-cover bg-center bg-no-repeat text-white" 
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/all.jpg')",
        }}>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">Our Blogs</h1>
            <p className="text-base sm:text-lg md:text-xl text-white">
              Insights, tips, and updates from the world of elevators
            </p>
          </motion.div>
>>>>>>> origin/main
        </div>
      </section>

      {/* Blogs Grid */}
<<<<<<< HEAD
      <section id="blogs" className="section-padding">
        <div className="section-container">
=======
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
>>>>>>> origin/main
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No blogs available at the moment.</p>
            </div>
          ) : (
<<<<<<< HEAD
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog, index) => {
                const blogDate = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown date';

                const isReview = blog.googleReviewUrl && blog.googleReviewUrl.length > 0;

                return (
                  <div
                    key={blog._id || blog.id}
                    className={`bg-green-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow reveal reveal-fade-up ${isReview ? 'border-2 border-yellow-200' : 'border border-green-100/50'}`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-full bg-gray-100 relative h-64">
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover img-fade-in"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      {isReview && (
                        <div className="mb-3 flex items-center gap-2">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-300">
                            ⭐ Google Review
                          </span>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>

                      {isReview && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-2xl text-yellow-400">★</span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">5.0</span>
                        </div>
                      )}

                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {blog.excerpt}
                      </p>
                      {!isReview && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <IoPerson className="w-4 h-4" />
                            <span>{blog.author}</span>
                          </div>
                          {blogDate !== 'Unknown date' && (
                            <div className="flex items-center gap-1">
                              <IoCalendar className="w-4 h-4" />
                              <span>{blogDate}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {isReview && blog.googleReviewUrl && (
                        <div className="mb-4">
                          <a
                            href={blog.googleReviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                          >
                            View on Google
                            <IoArrowForward className="w-4 h-4" />
                          </a>
                        </div>
                      )}

                      {!isReview && (
                        <Link
                          href={`/blogs/${blog._id || blog.id}`}
                          className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
                        >
                          Read More
                          <IoArrowForward className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
=======
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {blogs.map((blog, index) => {
                const blogDate = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Unknown date';
                
                // Check if this is a Google review
                const isReview = blog.googleReviewUrl && blog.googleReviewUrl.length > 0;
                
                return (
              <motion.div
                key={blog._id || blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`bg-green-50 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow ${isReview ? 'border-2 border-yellow-200' : 'border border-green-100/50'}`}
              >
                {/* Top image area – show full image from admin panel link */}
                <div className="w-full bg-gray-100">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/800x300?text=Blog+Image";
                    }}
                  />
                </div>
                <div className="p-6">
                  {/* Google Review Badge */}
                  {isReview && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-300">
                        ⭐ Google Review
                      </span>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  {/* Star Rating for Reviews */}
                  {isReview && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className="text-2xl text-yellow-400"
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 font-medium">5.0</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {blog.excerpt}
                  </p>
                  {!isReview && (
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <IoPerson className="w-4 h-4" />
                        <span>{blog.author}</span>
                      </div>
                      {blogDate !== 'Unknown date' && (
                        <div className="flex items-center gap-1">
                          <IoCalendar className="w-4 h-4" />
                          <span>{blogDate}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Google Review Link */}
                  {isReview && blog.googleReviewUrl && (
                    <div className="mb-4">
                      <a
                        href={blog.googleReviewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium underline"
                      >
                        View on Google
                        <IoArrowForward className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                  
                  {!isReview && (
                    <Link
                      href={`/blogs/${blog._id || blog.id}`}
                      className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors"
                    >
                      Read More
                      <IoArrowForward className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </motion.div>
                );
              })}
          </div>
>>>>>>> origin/main
          )}
        </div>
      </section>

<<<<<<< HEAD
      {/* Final Bottom CTA */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4 reveal reveal-fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Have Questions About Your Elevator?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Our technical experts provide the best consultation for residential and commercial elevators.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-2xl uppercase tracking-widest text-sm"
          >
            Contact Our Experts
          </Link>
        </div>
      </section>

=======
>>>>>>> origin/main
      <Footer />
    </div>
  );
}
<<<<<<< HEAD
=======


>>>>>>> origin/main
