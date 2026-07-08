import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const pageUrl = "https://www.kashomeelevators.com/home-lift-in-hyderabad";

export const metadata: Metadata = {
  title: "Best Home Lift in Hyderabad | Residential Lift Solutions",
  description:
    "Looking for the best home lift in Hyderabad? Kashome Elevators offers premium residential home lifts with safe installation, modern designs, and reliable after-sales support.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Best Home Lift in Hyderabad | Kashome Elevators",
    description:
      "Discover premium home lift solutions in Hyderabad with safe installation, elegant designs, and reliable support from Kashome Elevators.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "https://www.kashomeelevators.com/premium_lift.jpg",
        alt: "Home lift in Hyderabad by KAS",
      },
    ],
  },
};

const benefits = [
  {
    title: "Easy and Comfortable Mobility",
    content:
      "A home lift allows you to move effortlessly between floors without the strain of climbing stairs. It is ideal for senior citizens, children, pregnant women, and individuals with mobility challenges.",
  },
  {
    title: "Enhances Property Value",
    content:
      "A professionally installed home lift in Hyderabad increases the appeal and market value of your property, offering both convenience and higher resale potential.",
  },
  {
    title: "Space-Saving and Modern Design",
    content:
      "Today's home lifts fit seamlessly into residential spaces without requiring extensive structural changes, combining elegant aesthetics with efficient space utilization.",
  },
  {
    title: "Advanced Safety Features",
    content:
      "Every residential home lift includes emergency battery backup, automatic rescue devices, door safety sensors, overload protection, and emergency alarm systems.",
  },
  {
    title: "Energy-Efficient Performance",
    content:
      "Modern home lifts deliver smooth and quiet operation while consuming minimal electricity, helping reduce operating costs without compromising reliability.",
  },
  {
    title: "Low Maintenance and Long-Term Reliability",
    content:
      "Built with premium-quality components, our home lifts are designed for dependable performance and minimal maintenance with regular servicing support.",
  },
];

const features = [
  "Elegant and space-efficient design",
  "Smooth, quiet, and comfortable ride",
  "Advanced safety technology with emergency backup",
  "Energy-efficient performance",
  "Premium and customizable cabin designs",
  "Smart controls for everyday convenience",
];

const liftTypes = [
  {
    title: "Hydraulic Home Lifts",
    content:
      "A reliable choice for low-rise residential properties with smooth operation, strong lifting capacity, and long-lasting performance with minimal maintenance.",
  },
  {
    title: "Machine Room-Less (MRL) Home Lifts",
    content:
      "Designed for homeowners who want to maximize space. No separate machine room required, offering compact and cost-effective installation.",
  },
  {
    title: "Gearless Home Lifts",
    content:
      "Advanced traction technology delivers a quiet, energy-efficient, and exceptionally smooth ride with reduced maintenance requirements.",
  },
  {
    title: "Villa Home Lifts",
    content:
      "Designed for luxury homes with premium cabin finishes, customizable interiors, and advanced safety features.",
  },
  {
    title: "Compact Residential Home Lifts",
    content:
      "Perfect for homes with limited installation space, allowing installation with minimal structural modifications.",
  },
];

const solutions = [
  {
    title: "Residential Home Lift Solutions",
    content:
      "Safe, reliable, and comfortable movement between floors for independent houses, duplex homes, and multi-storey residences.",
  },
  {
    title: "Villa Home Lift Solutions",
    content:
      "Premium home lift systems with sophisticated cabin interiors, modern finishes, and advanced technology.",
  },
  {
    title: "Space-Saving Home Lifts",
    content:
      "Compact lifts requiring minimal structural modifications, ideal for both newly constructed and existing properties.",
  },
  {
    title: "Energy-Efficient Home Lifts",
    content:
      "Modern technology ensures smooth operation while consuming less electricity for lower operating costs.",
  },
];

const faqs = [
  {
    question: "How much does a home lift in Hyderabad cost?",
    answer:
      "The cost depends on lift type, number of floors, cabin size, customization, and installation requirements. Contact Kashome Elevators for a free site inspection and personalized quotation.",
  },
  {
    question: "Which type of home lift is best for residential properties?",
    answer:
      "Hydraulic, Machine Room-Less (MRL), and gearless home lifts are among the most popular choices for villas, duplex homes, and independent houses. Our experts help you select after a detailed site assessment.",
  },
  {
    question: "Can a home lift be installed in an existing house?",
    answer:
      "Yes. Modern home lifts can be installed in both new and existing homes with minimal structural changes while ensuring safe and efficient installation.",
  },
  {
    question: "How long does home lift installation take?",
    answer:
      "Once design and technical requirements are finalized, most residential home lift installations are completed within a few weeks.",
  },
  {
    question: "Are home lifts safe for children and senior citizens?",
    answer:
      "Absolutely. Our home lifts include emergency battery backup, automatic rescue devices, door safety sensors, overload protection, and emergency alarms.",
  },
  {
    question: "How much space is required for a home lift?",
    answer:
      "The required space depends on the lift model. We offer compact home lift solutions for homes with limited space while maintaining excellent performance.",
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

export default function HomeLiftHyderabadPage() {
  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <main>
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Home Lift in Hyderabad
            </h1>
            <p className="text-lg sm:text-xl text-slate-100 leading-relaxed">
              A modern home lift in Hyderabad is a smart investment that adds comfort,
              convenience, and long-term value to your home. At Kashome Elevators, we provide
              premium home lift solutions that combine advanced technology, elegant design,
              and reliable performance for villas, duplex homes, and independent houses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
                Residential home lift Hyderabad
              </span>
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
                Home lift installation Hyderabad
              </span>
              <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2">
                Villa home lift Hyderabad
              </span>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose a Home Lift in Hyderabad?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              A home lift in Hyderabad is becoming an essential feature for modern homes,
              offering the perfect combination of convenience, accessibility, and contemporary
              living. It allows family members to move comfortably between floors without the
              physical strain of climbing stairs.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Choosing professional home lift installation in Hyderabad ensures long-term safety
              and dependable performance with advanced features such as emergency battery backup,
              automatic rescue systems, and door safety sensors.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Benefits of Installing a Home Lift
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((item) => (
                <article key={item.title} className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Features of Our Home Lifts
            </h2>
            <ul className="grid sm:grid-cols-2 gap-4 list-disc pl-5 text-gray-700 leading-relaxed">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Types of Home Lifts
            </h2>
            <div className="space-y-6">
              {liftTypes.map((item) => (
                <article key={item.title} className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.content}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Our Home Lift Solutions
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {solutions.map((item) => (
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
              We serve Banjara Hills, Jubilee Hills, Gachibowli, Madhapur, Kukatpally,
              Kondapur, Miyapur, Begumpet, Secunderabad, LB Nagar, Uppal, and Hitech City.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="text-green-700 underline">
                Home
              </Link>
              <Link href="/about" className="text-green-700 underline">
                About Us
              </Link>
              <Link href="/home-elevator-in-hyderabad" className="text-green-700 underline">
                Home Elevator
              </Link>
              <Link href="/products/hydraulic-elevator" className="text-green-700 underline">
                Hydraulic Elevator
              </Link>
              <Link href="/products/mrl-elevator" className="text-green-700 underline">
                MRL Elevator
              </Link>
              <Link href="/blogs" className="text-green-700 underline">
                Blog
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
              Get a Free Home Lift Quote in Hyderabad
            </h2>
            <p className="text-green-50 text-lg leading-relaxed mb-8">
              Schedule a free site inspection with Kashome Elevators and get a personalized
              quotation for your villa, duplex, or independent home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors"
              >
                Get Free Quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              >
                Book Free Site Inspection
              </Link>
            </div>
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
