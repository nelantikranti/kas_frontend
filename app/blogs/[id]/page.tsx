"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { IoCalendar, IoPerson, IoArrowBack } from "react-icons/io5";
import { blogsAPI, Blog } from "@/lib/api";
import { motion } from "framer-motion";

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlog();
  }, [params.id]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedBlog = await blogsAPI.getById(params.id);
      setBlog(fetchedBlog);
    } catch (error) {
      console.error("Failed to load blog:", error);
      setError("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-gray-500">Loading blog...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-green-50">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-red-500">{error || "Blog not found"}</p>
          <Link href="/blogs" className="text-green-600 hover:underline mt-4 inline-block">
            Back to Blogs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const blogDate = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Unknown date';

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <section className="relative py-12 sm:py-20 md:py-24 overflow-hidden bg-slate-900">
        <Image
          src="/all.jpg"
          alt="Blog"
          fill
          priority
          className="object-cover z-0 brightness-75 scale-110 blur-[1px] img-fade-in"
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-green-400 hover:text-white mb-8 transition-colors group font-bold uppercase tracking-widest text-xs"
            >
              <IoArrowBack className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Articles</span>
            </Link>

            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-tighter">
                  {blog.category}
                </span>
                <span className="text-slate-400 text-xs uppercase tracking-widest font-medium">
                  • {blog.views} views
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-10 leading-[1.05] tracking-tight">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {blog.author.charAt(0)}
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-0.5">Contributor</span>
                    <span className="font-bold text-white">{blog.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-green-400">
                    <IoCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mb-0.5">Published</span>
                    <span className="font-bold text-white">{blogDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-green-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8 reveal reveal-fade-up">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover img-fade-in"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
            <div className="reveal reveal-fade-up" style={{ transitionDelay: '0.2s' }}>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Bottom CTA */}
      <section className="py-20 bg-white text-center">
        <div className="container mx-auto px-4 reveal reveal-fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Our experts at KAS are ready to help you with your next elevator project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-10 py-5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-2xl uppercase tracking-[0.2em] text-sm"
            >
              Get Free Site Visit
            </Link>
            <Link
              href="/services"
              className="px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all transform hover:-translate-y-1 shadow-2xl uppercase tracking-[0.2em] text-sm"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
