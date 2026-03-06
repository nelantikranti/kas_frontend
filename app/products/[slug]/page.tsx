<<<<<<< HEAD
"use client";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
=======
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
>>>>>>> origin/main

type Props = {
  params: { slug: string };
};

export default function ProductPage({ params }: Props) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Product Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image
          src="/product.jpg"
          alt="Product"
          fill
          priority
          className="object-cover z-0 brightness-75 scale-110 blur-[1px] img-fade-in"
          quality={95}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-900 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-0"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/products" className="inline-flex items-center gap-2 text-green-400 hover:text-white mb-8 transition-colors group font-bold uppercase tracking-widest text-xs">
              <span className="transition-transform group-hover:-translate-x-1">←</span> All Products
            </Link>
            <h1 className="hero-title text-white mb-6">
              {product.title}
            </h1>
          </motion.div>
        </div>
      </section>

      <div className="section-container section-padding -mt-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white rounded-[40px] p-8 sm:p-12 shadow-2xl reveal reveal-fade-up">
          <div className="rounded-[32px] overflow-hidden shadow-2xl relative h-[400px] sm:h-[600px] group">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105 img-fade-in"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="reveal reveal-fade-left pt-4" style={{ transitionDelay: '0.2s' }}>
            <div className="w-16 h-1.5 bg-green-500 mb-8 rounded-full"></div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
              {product.title}
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">{product.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {product.points.map((pt) => (
                <div key={pt} className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-800 text-sm font-medium">{pt}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link href="/contact" className="w-full sm:w-auto text-center px-10 py-5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all transform hover:-translate-y-1 shadow-2xl uppercase tracking-[0.2em] text-sm">
                Get a Quote
              </Link>
              <Link href="/products" className="text-sm font-bold text-gray-500 hover:text-green-700 uppercase tracking-widest border-b-2 border-transparent hover:border-green-600 transition-all">
                More Solutions
=======
    <div className="min-h-screen" style={{ backgroundColor: "#cef5db" }}>
      <div className="container mx-auto px-4 py-16">
        <Link href="/" className="text-sm text-green-700 mb-4 inline-block">
          ← Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-white rounded-3xl p-8 shadow-lg">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
              {product.title}
            </h1>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              {product.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-semibold">
                Contact Us
              </Link>
              <Link href="/" className="text-sm text-gray-700 underline">
                Back to Home
>>>>>>> origin/main
              </Link>
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD

      {/* Product Specific CTA */}
      <section className="py-20 bg-green-50/30 text-center border-t border-green-200">
        <div className="container mx-auto px-4 reveal reveal-fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Expert Installation Guaranteed
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Every {product.title} comes with professional installation and 24/7 post-sales support.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-all transform hover:-translate-y-1 shadow-2xl uppercase tracking-[0.2em] text-sm"
          >
            Start Your Project
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
=======
    </div>
  );
}



>>>>>>> origin/main
