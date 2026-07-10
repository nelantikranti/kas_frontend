import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

const currentPageHref = "/home-lift-in-hyderabad";
const seoLinkClass =
  "text-green-700 underline underline-offset-2 hover:text-green-800";

function createSeoLinker(excludeHref?: string) {
  const linkedHrefs = new Set<string>();
  const links = [
    { phrase: "residential elevators", href: "/residential-elevator-hyderabad" },
    { phrase: "residential elevator", href: "/residential-elevator-hyderabad" },
    { phrase: "home elevators", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevator", href: "/home-elevator-in-hyderabad" },
    { phrase: "villa elevators", href: "/villa-elevator-hyderabad" },
    { phrase: "villa elevator", href: "/villa-elevator-hyderabad" },
    { phrase: "home lifts", href: "/home-lift-in-hyderabad" },
    { phrase: "home lift", href: "/home-lift-in-hyderabad" },
    {
      phrase: "home lift installation",
      href: "/home-lift-installation-hyderabad",
    },
  ]
    .filter((link) => link.href !== excludeHref)
    .sort((a, b) => b.phrase.length - a.phrase.length);

  return function linkSeoKeywords(text: string): ReactNode {
    if (links.length === 0) return text;

    const pattern = links
      .map((link) => link.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`(${pattern})`, "gi");
    const hrefByPhrase = new Map(
      links.map((link) => [link.phrase.toLowerCase(), link.href]),
    );

    return text.split(regex).map((part, index) => {
      const href = hrefByPhrase.get(part.toLowerCase());
      if (!href || linkedHrefs.has(href)) return part;

      linkedHrefs.add(href);
      return (
        <a key={`${part}-${index}`} href={href} className={seoLinkClass}>
          {part}
        </a>
      );
    });
  };
}

const pageUrl = "https://www.kashomeelevators.com/home-lift-in-hyderabad/";

const ctaButtons = [
  { href: "/contact", label: "Get Free Quote" },
  { href: "/contact", label: "Book Free Site Inspection" },
  { href: "/contact", label: "Talk to Our Lift Expert" },
  { href: "/contact", label: "Request a Callback" },
  { href: "/contact", label: "Contact Us Today" },
];

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

const whyChooseParagraphs = [
  "A home lift in Hyderabad is becoming an essential feature for modern homes, offering the perfect combination of convenience, accessibility, and contemporary living. As more homeowners invest in multi-storey houses, villas, and duplex residences, installing a home lift has become a practical solution that makes everyday life easier while enhancing the overall value of the property.",
  "One of the biggest advantages of a home lift is effortless mobility. It allows family members to move comfortably between floors without the physical strain of climbing stairs. This is especially beneficial for senior citizens, children, pregnant women, and individuals with mobility challenges, ensuring everyone can access every part of the home safely and independently.",
  "Beyond convenience, a professionally installed residential home lift in Hyderabad enhances the style and functionality of your living space. Modern home lifts are available in elegant designs, space-saving configurations, and customizable finishes that blend seamlessly with your home's architecture. Whether you own a compact duplex or a luxury villa, there's a solution designed to meet your specific needs.",
  "Choosing professional home lift installation in Hyderabad also ensures long-term safety and dependable performance. High-quality home lifts are equipped with advanced features such as emergency battery backup, automatic rescue systems, door safety sensors, and smooth operating technology, providing complete peace of mind for your family.",
  "Another important advantage is the long-term value it adds to your property. A premium home lift not only improves day-to-day comfort but also makes your home more attractive to future buyers who value accessibility, modern amenities, and premium living standards.",
  "At Kashome Elevators, we provide customized home lift solutions that combine innovative technology, superior safety, and elegant design. Whether you're planning a new home or upgrading an existing property, our experienced team helps you choose the ideal home lift in Hyderabad that matches your lifestyle, budget, and architectural requirements.",
];

const benefitsIntro =
  "Installing a home lift in Hyderabad is one of the smartest upgrades for modern homes. It not only improves accessibility but also adds comfort, safety, and long-term value to your property. Whether you own a villa, duplex, bungalow, or independent house, a home lift makes everyday living more convenient while enhancing the overall functionality of your home.";

const benefits = [
  {
    title: "Easy and Comfortable Mobility",
    content:
      "A home lift allows you to move effortlessly between floors without the strain of climbing stairs. It is an ideal solution for senior citizens, children, pregnant women, and individuals with mobility challenges, making daily life safer and more comfortable for every family member.",
  },
  {
    title: "Enhances Property Value",
    content:
      "A professionally installed home lift in Hyderabad increases the appeal and market value of your property. Modern buyers often prefer homes equipped with advanced amenities, making a home lift a valuable long-term investment that offers both convenience and higher resale potential.",
  },
  {
    title: "Space-Saving and Modern Design",
    content:
      "Today's home lifts are designed to fit seamlessly into residential spaces without requiring extensive structural changes. Whether you need a compact lift for a small home or a customized solution for a luxury villa, our lifts combine elegant aesthetics with efficient space utilization.",
  },
  {
    title: "Advanced Safety Features",
    content:
      "Every residential home lift in Hyderabad is equipped with advanced safety technologies, including emergency battery backup, automatic rescue devices, door safety sensors, overload protection, and emergency alarm systems. These features ensure a secure and reliable experience for users of all ages.",
  },
  {
    title: "Energy-Efficient Performance",
    content:
      "Modern home lifts are built using energy-efficient technology that delivers smooth and quiet operation while consuming minimal electricity. This helps homeowners reduce operating costs without compromising performance or reliability.",
  },
  {
    title: "Customized Solutions for Every Home",
    content:
      "Every home has different requirements, which is why we provide customized home lift solutions tailored to your available space, interior design, and lifestyle preferences. From cabin finishes and lighting to control panels and dimensions, every detail can be personalized to complement your home.",
  },
  {
    title: "Professional Home Lift Installation",
    content:
      "Our experienced team specializes in home lift installation in Hyderabad, ensuring every project is completed with precision, quality, and strict safety standards. From the initial site inspection to final testing and commissioning, we provide end-to-end support for a smooth installation process.",
  },
  {
    title: "Low Maintenance and Long-Term Reliability",
    content:
      "Built with premium-quality components and advanced engineering, our home lifts are designed for dependable performance and minimal maintenance. Regular servicing by our trained professionals helps extend the lifespan of your lift while ensuring safe and uninterrupted operation.",
  },
  {
    title: "Improved Lifestyle and Everyday Convenience",
    content:
      "A home lift transforms the way you move within your home by providing effortless access to every floor. Beyond convenience, it creates a more inclusive living environment where every family member can enjoy greater independence and comfort.",
  },
];

const benefitsClosing =
  "Choosing a premium home lift in Hyderabad is more than a home improvement—it's an investment in safety, accessibility, and modern living. At Kashome Elevators, we deliver innovative home lift solutions that combine superior quality, elegant design, and long-lasting performance to meet the needs of today's homeowners.";

const featuresIntro =
  "At Kashome Elevators, we believe a home lift should offer more than just convenience—it should provide safety, reliability, comfort, and a design that complements your home. Our home lifts in Hyderabad are built using advanced technology and premium-quality components to ensure smooth performance and long-lasting durability. Whether you're looking for a lift for a villa, duplex, or independent house, our solutions are designed to meet the needs of modern homeowners.";

const features = [
  {
    title: "Elegant and Space-Efficient Design",
    content:
      "Our home lifts feature compact and intelligent designs that fit seamlessly into different types of residential properties. Whether you have limited installation space or a spacious luxury home, we provide customized lift solutions that blend perfectly with your interiors without affecting the aesthetics of your living space.",
  },
  {
    title: "Smooth, Quiet, and Comfortable Ride",
    content:
      "Enjoy a seamless travel experience with advanced drive systems that ensure smooth acceleration, gentle stopping, and low-noise operation. Every ride is designed to provide maximum comfort, making daily movement between floors effortless for every member of the family.",
  },
  {
    title: "Advanced Safety Technology",
    content:
      "Safety is one of the most important features of every home lift in Hyderabad we install. Our lifts are equipped with emergency battery backup, automatic rescue devices, overload protection, door safety sensors, emergency alarm systems, and user-friendly controls to ensure complete peace of mind.",
  },
  {
    title: "Energy-Efficient Performance",
    content:
      "Our home lifts are engineered to deliver outstanding performance while consuming minimal electricity. The use of energy-efficient technology helps reduce operating costs and supports sustainable living without compromising reliability or comfort.",
  },
  {
    title: "Premium Cabin Designs",
    content:
      "Every home has its own style, and your home lift should reflect that. We offer a wide range of customizable cabin interiors, elegant finishes, modern lighting, stylish control panels, and premium materials that enhance the overall appearance of your home.",
  },
  {
    title: "Customized Home Lift Solutions",
    content:
      "No two homes are the same. That's why we provide personalized residential home lift solutions based on your available space, design preferences, number of floors, and accessibility requirements. Our team works closely with you to create a lift that matches your lifestyle and architectural vision.",
  },
  {
    title: "Professional Installation and Quality Assurance",
    content:
      "Our experienced engineers handle every stage of home lift installation in Hyderabad, including site inspection, planning, installation, testing, and final commissioning. Every project is completed according to strict quality and safety standards, ensuring reliable performance from day one.",
  },
  {
    title: "Durable and Low-Maintenance Systems",
    content:
      "Built with high-quality components and precision engineering, our home lifts are designed to perform efficiently for years with minimal maintenance. Regular servicing by our expert team helps maintain optimal performance and extends the lifespan of your lift.",
  },
  {
    title: "Smart Controls for Everyday Convenience",
    content:
      "Our lifts are equipped with easy-to-use control panels, soft-touch buttons, clear display indicators, and optional smart features that make operation simple and convenient for users of all age groups.",
  },
  {
    title: "Designed for Modern Living",
    content:
      "A premium home lift in Hyderabad should make your life easier while adding value to your home. At Kashome Elevators, we combine innovative engineering, elegant design, and dependable performance to deliver home lift solutions that offer lasting comfort, enhanced accessibility, and complete peace of mind for your family.",
  },
];

const liftTypesIntro =
  "Selecting the right home lift in Hyderabad depends on your home's structure, available space, lifestyle, and accessibility needs. At Kashome Elevators, we offer a wide range of home lift solutions designed to provide safe, smooth, and efficient vertical mobility. Whether you need a lift for a compact home or a luxury villa, our experts help you choose the perfect solution that combines performance, comfort, and style.";

const liftTypes = [
  {
    title: "Hydraulic Home Lifts",
    content:
      "Hydraulic home lifts are a reliable choice for low-rise residential properties. Known for their smooth operation and strong lifting capacity, they are ideal for villas, duplex homes, and independent houses. Their durable design ensures long-lasting performance with minimal maintenance.",
  },
  {
    title: "Machine Room-Less (MRL) Home Lifts",
    content:
      "MRL home lifts are designed for homeowners who want to maximize available space. Since these lifts do not require a separate machine room, they offer a compact and cost-effective solution while maintaining excellent safety, energy efficiency, and ride comfort.",
  },
  {
    title: "Gearless Home Lifts",
    content:
      "Gearless home lifts use advanced traction technology to deliver a quiet, energy-efficient, and exceptionally smooth ride. Their modern engineering reduces maintenance requirements, making them a preferred choice for premium residential properties.",
  },
  {
    title: "Villa Home Lifts",
    content:
      "Our villa home lifts in Hyderabad are designed for luxury homes that demand both elegance and functionality. With premium cabin finishes, customizable interiors, and advanced safety features, these lifts enhance your home's appearance while improving everyday convenience.",
  },
  {
    title: "Compact Residential Home Lifts",
    content:
      "For homes with limited installation space, compact residential lifts provide the perfect solution. Their intelligent design allows installation with minimal structural modifications, making them suitable for both new and existing homes.",
  },
  {
    title: "Customized Home Lift Solutions",
    content:
      "Every home is unique, which is why we offer fully customized home lifts tailored to your specific requirements. From cabin size and finishes to control systems and design elements, every detail is carefully planned to complement your home's architecture and your family's lifestyle.",
  },
];

const liftTypesClosing =
  "No matter which type of home lift you choose, Kashome Elevators ensures professional installation, advanced safety features, and dependable after-sales support, giving you a solution that delivers comfort, convenience, and long-term value.";

const solutionsIntro =
  "At Kashome Elevators, we provide complete home lift solutions in Hyderabad that combine innovation, safety, and elegant design. We understand that every home has different requirements, which is why we offer customized lift systems that seamlessly integrate with your property's layout while delivering exceptional comfort and performance.";

const solutionsSubIntro =
  "Whether you're constructing a new home or upgrading an existing one, our experienced team helps you choose the ideal solution based on your available space, number of floors, and daily mobility needs.";

const solutions = [
  {
    title: "Residential Home Lift Solutions",
    content:
      "Our residential home lifts are designed to provide safe, reliable, and comfortable movement between floors. They are suitable for independent houses, duplex homes, and multi-storey residences, offering convenience without compromising on style.",
  },
  {
    title: "Villa Home Lift Solutions",
    content:
      "Enhance the comfort and luxury of your villa with our premium home lift systems. Designed with sophisticated cabin interiors, modern finishes, and advanced technology, these lifts improve accessibility while complementing your home's architecture.",
  },
  {
    title: "Space-Saving Home Lifts",
    content:
      "If space is limited, our compact home lifts are an excellent choice. Their efficient design requires minimal structural modifications, making them ideal for both newly constructed and existing residential properties.",
  },
  {
    title: "Energy-Efficient Home Lifts",
    content:
      "Our lifts are equipped with modern technology that ensures smooth operation while consuming less electricity. This allows homeowners to enjoy reliable performance with lower operating costs and reduced environmental impact.",
  },
  {
    title: "Customized Installation Services",
    content:
      "Every home lift installation in Hyderabad begins with a detailed site inspection and consultation. Our experts design a solution that fits your home perfectly, ensuring a safe installation, efficient operation, and a hassle-free experience from planning to final handover.",
  },
  {
    title: "Reliable Maintenance and Support",
    content:
      "We believe that excellent service continues even after installation. Our dedicated maintenance team provides regular inspections, preventive servicing, and prompt technical support to keep your home lift operating safely and efficiently for years.",
  },
];

const solutionsClosing =
  "At Kashome Elevators, our goal is to provide homeowners with dependable home lift solutions in Hyderabad that improve accessibility, enhance property value, and deliver lasting comfort. From consultation and installation to after-sales support, we are committed to providing quality you can trust.";

const faqs = [
  {
    question: "How much does a home lift in Hyderabad cost?",
    answer:
      "The cost of a home lift depends on several factors, including the lift type, number of floors, cabin size, customization, and installation requirements. Contact Kashome Elevators for a free site inspection and a personalized quotation based on your property's needs.",
  },
  {
    question: "Which type of home lift is best for residential properties?",
    answer:
      "The best home lift depends on your home's layout and available space. Hydraulic, Machine Room-Less (MRL), and gearless home lifts are among the most popular choices for villas, duplex homes, and independent houses. Our experts help you select the most suitable option after a detailed site assessment.",
  },
  {
    question: "Can a home lift be installed in an existing house?",
    answer:
      "Yes. Modern home lifts can be installed in both new and existing homes. Our team carefully evaluates your property's structure and recommends a solution that requires minimal structural changes while ensuring safe and efficient installation.",
  },
  {
    question: "How long does home lift installation take?",
    answer:
      "The installation timeline depends on the type of lift and site conditions. Once the design and technical requirements are finalized, most residential home lift installations are completed within a few weeks.",
  },
  {
    question: "Are home lifts safe for children and senior citizens?",
    answer:
      "Absolutely. Our home lifts are equipped with advanced safety features such as emergency battery backup, automatic rescue devices, door safety sensors, overload protection, and emergency alarms, making them safe for every member of the family.",
  },
  {
    question: "Do home lifts require regular maintenance?",
    answer:
      "Yes. Routine maintenance helps ensure smooth performance, enhances safety, and extends the life of your home lift. Kashome Elevators provides reliable maintenance and after-sales support to keep your lift operating efficiently.",
  },
  {
    question: "How much space is required for a home lift?",
    answer:
      "The required space depends on the lift model you choose. We offer compact home lift solutions that can be installed in homes with limited space while maintaining excellent performance and comfort.",
  },
  {
    question: "Why choose Kashome Elevators for a home lift in Hyderabad?",
    answer:
      "Kashome Elevators offers customized home lift solutions, premium-quality products, professional installation, advanced safety features, and dependable after-sales support. Our commitment to quality and customer satisfaction makes us a trusted choice for homeowners across Hyderabad.",
  },
];

const contactIntro =
  "Looking for a reliable home lift in Hyderabad? Kashome Elevators is here to help you find the perfect solution for your home. Whether you're planning a new installation or upgrading an existing property, our experienced team is ready to guide you through every step—from consultation and site inspection to installation and ongoing support.";

const contactDetails = [
  "We provide customized home lift installation in Hyderabad for villas, duplex homes, independent houses, and other residential properties. Our focus is on delivering safe, stylish, and energy-efficient home lift solutions that match your space, budget, and lifestyle.",
  "Get in touch with our experts today to schedule a free site inspection or request a personalized quotation. We'll help you choose the ideal home lift that combines comfort, convenience, and long-term reliability.",
  "Call us today or fill out our enquiry form to discuss your requirements. Experience premium quality, professional service, and dependable support with Kashome Elevators—your trusted partner for home lifts in Hyderabad.",
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

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KAS Home Elevators",
  url: "https://www.kashomeelevators.com",
  logo: "https://www.kashomeelevators.com/premium_lift.jpg",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8019219911",
    email: "assist@kashomeelevators.com",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: "English",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Home Lift in Hyderabad",
  description:
    "Premium residential home lift installation and support in Hyderabad by Kashome Elevators.",
  provider: {
    "@type": "LocalBusiness",
    name: "KAS Home Elevators",
  },
  areaServed: {
    "@type": "City",
    name: "Hyderabad",
  },
  url: pageUrl,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.kashomeelevators.com/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Home Lift in Hyderabad",
      item: pageUrl,
    },
  ],
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
  const linkSeoKeywords = createSeoLinker(currentPageHref);

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <main>
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Home Lift in Hyderabad
            </h1>
            <div className="space-y-4 text-lg sm:text-xl text-slate-100 leading-relaxed">
              <p>
                {linkSeoKeywords("A modern home lift in Hyderabad is no longer considered a luxury—it's a smart investment that adds comfort, convenience, and long-term value to your home. Whether you're building a new villa, renovating an existing house, or looking for an easier way to move between floors, a well-designed home lift can transform your daily living experience. It offers safe and effortless mobility for every family member, especially senior citizens, children, and individuals with limited mobility.")}
              </p>
              <p>
                {linkSeoKeywords("At KASH HOME Elevators, we provide premium home lift solutions that combine advanced technology, elegant design, and reliable performance. Every lift is carefully designed to suit your home's layout while maintaining the highest standards of safety and quality. From compact residential lifts to customized solutions for luxury villas, we ensure every installation blends seamlessly with your interiors and lifestyle.")}
              </p>
              <p>
                {linkSeoKeywords("As a trusted provider of home lift installation in Hyderabad, our experienced team manages everything from site inspection and planning to installation and after-sales support. We focus on delivering personalized solutions that meet your specific requirements without compromising on safety, efficiency, or aesthetics.")}
              </p>
              <p>
                {linkSeoKeywords("If you're searching for a dependable home lift in Hyderabad, Kashome Elevators is your trusted partner. Our commitment to quality craftsmanship, innovative engineering, and customer satisfaction has made us a preferred choice for homeowners seeking stylish, durable, and energy-efficient home lift solutions across Hyderabad.")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose a Home Lift in Hyderabad?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {whyChooseParagraphs.map((paragraph) => (
                <p key={paragraph}>
                  {linkSeoKeywords(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Benefits of Installing a Home Lift
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(benefitsIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {benefits.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(benefitsClosing)}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Features of Our Home Lifts
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(featuresIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {features.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Types of Home Lifts
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(liftTypesIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {liftTypes.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(liftTypesClosing)}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Home Lift Solutions
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(solutionsIntro)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(solutionsSubIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {solutions.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(solutionsClosing)}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <ul className="space-y-6 list-none">
              {faqs.map((item) => (
                <li key={item.question} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900 block mb-2">{item.question}</strong>
                  <p>
                    {linkSeoKeywords(item.answer)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {linkSeoKeywords(contactIntro)}
            </p>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {contactDetails.map((paragraph) => (
                <p key={paragraph}>
                  {linkSeoKeywords(paragraph)}
                </p>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center mt-8 px-8 py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Contact Us Today
            </Link>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-green-600 to-green-500 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get a Free Home Lift Quote in Hyderabad
            </h2>
            <p className="text-green-50 text-lg leading-relaxed mb-8">
              Schedule a free site inspection with Kashome Elevators and get a personalized
              quotation for your villa, duplex, or independent home.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
              {ctaButtons.map((cta) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors"
                >
                  {cta.label}
                </Link>
              ))}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Footer />
    </div>
  );
}
