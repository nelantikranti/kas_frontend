import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const pageUrl = "https://www.kashomeelevators.com/home-elevator-in-hyderabad";

export const metadata: Metadata = {
  title: "Home Elevator in Hyderabad | KAS Home Elevators",
  description:
    "Looking for a home elevator in Hyderabad? KAS installs safe, compact, gearless home lifts for villas & duplex homes. Free site visit & quote.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Home Elevator in Hyderabad | KAS Home Elevators",
    description:
      "Safe, compact, and low-maintenance home elevators in Hyderabad for villas, duplex homes, and independent houses.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "https://www.kashomeelevators.com/premium_lift.jpg",
        alt: "Home elevator in Hyderabad by KAS",
      },
    ],
  },
};

const benefits = [
  {
    title: "Improved Accessibility",
    content:
      "A home elevator makes daily movement between floors simple and comfortable, especially for senior citizens, children, and individuals with mobility challenges.",
  },
  {
    title: "Enhanced Safety",
    content:
      "Modern residential elevators include emergency alarms, automatic door sensors, battery backup, overload protection, and emergency stop functions for reliable operation.",
  },
  {
    title: "Increased Property Value",
    content:
      "A premium residential lift adds convenience and modern appeal, improving the long-term value of villas and independent homes.",
  },
  {
    title: "Space-Saving Designs",
    content:
      "Compact configurations allow installation in duplexes, villas, and existing buildings without compromising comfort or performance.",
  },
];

const features = [
  "Smooth and quiet operation",
  "Energy-efficient technology",
  "Premium and customizable cabin interiors",
  "Advanced safety systems with emergency backup",
  "Low maintenance and long-term reliability",
  "Smart, user-friendly control options",
];

const elevatorTypes = [
  {
    title: "Hydraulic Home Elevators",
    content:
      "A reliable option for low-rise homes with smooth travel, strong lifting performance, and dependable durability.",
  },
  {
    title: "Machine Room-Less (MRL) Elevators",
    content:
      "Designed for space optimization, these elevators remove the need for a separate machine room while maintaining excellent efficiency.",
  },
  {
    title: "Gearless Home Elevators",
    content:
      "Ideal for premium homes that need a quieter ride, lower maintenance requirements, and high energy efficiency.",
  },
  {
    title: "Villa Elevators",
    content:
      "Luxury-focused elevators with elegant finishes and customization options to complement modern and traditional villa interiors.",
  },
];

const faqs = [
  {
    question: "How much space is needed for a home elevator?",
    answer:
      "Most home elevators need as little as 3x3 feet of floor space, depending on the type chosen.",
  },
  {
    question: "Do home elevators need a separate machine room?",
    answer:
      "No, pneumatic and MRL home elevators do not require a machine room or pit.",
  },
  {
    question: "How long does installation take?",
    answer:
      "Installation typically takes a few days to a couple of weeks based on elevator type and site readiness.",
  },
  {
    question: "Is maintenance included?",
    answer:
      "Yes, KAS offers after-sales maintenance packages for all home elevators installed in Hyderabad.",
  },
];

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "KAS Home Elevators",
  image: "https://www.kashomeelevators.com/premium_lift.jpg",
  telephone: "+91-8019219911",
  email: "assist@kashomeelevators.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "GFH5 plot 243, 244, 2C6, Rami Reddy Nagar, Jeedimetla",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500055",
    addressCountry: "IN",
  },
  areaServed: "Hyderabad",
  url: pageUrl,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function HomeElevatorHyderabadPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <main>
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Home Elevator in Hyderabad - Safe, Compact Lifts for Every Home
            </h1>
            <p className="text-lg sm:text-xl text-slate-100 leading-relaxed">
              Looking for a reliable home elevator in Hyderabad? KAS Home Elevators
              designs and installs safe, compact, and low-maintenance home lifts
              for villas, duplex homes, and independent houses across the city.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
                Home elevators Hyderabad
              </span>
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
                Residential lift Hyderabad
              </span>
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
                Elevator for home in Hyderabad
              </span>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Benefits of Installing a Home Elevator in Hyderabad
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((item) => (
                <article key={item.title} className="bg-white p-6 rounded-xl border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Features of Our Home Elevators in Hyderabad
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4 list-disc pl-5 text-gray-700 leading-relaxed">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Types of Home Elevators
            </h2>
            <div className="space-y-6">
              {elevatorTypes.map((item) => (
                <article key={item.title} className="bg-white p-6 rounded-xl border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">
              Service Areas in Hyderabad
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We serve key residential locations including Jubilee Hills, Banjara Hills,
              Gachibowli, Kondapur, Kokapet, Financial District, and Nallagandla.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Internal Links</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/products/hydraulic-elevator" className="text-green-700 underline">
                Hydraulic Elevator
              </Link>
              <Link href="/products/pneumatic-elevator" className="text-green-700 underline">
                Pneumatic Elevator
              </Link>
              <Link href="/products/mrl-elevator" className="text-green-700 underline">
                MRL Elevator
              </Link>
              <Link href="/contact" className="text-green-700 underline">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((item) => (
                <article key={item.question} className="bg-white p-6 rounded-xl border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-green-600 to-green-500 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get a Free Home Elevator Quote in Hyderabad
            </h2>
            <p className="text-green-50 text-lg leading-relaxed mb-8">
              Book a free site visit with KAS Home Elevators and get a tailored recommendation
              for your villa, duplex, or independent home.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors"
            >
              Get a Free Home Elevator Quote in Hyderabad
            </Link>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Footer />
    </div>
  );
}
