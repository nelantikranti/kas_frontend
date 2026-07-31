import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";
import installationImage from "../../../public/home-lift-installation-hyderabad.webp";

const currentPageHref = "/home-lift-installation-hyderabad";
const seoLinkClass =
  "text-green-700 underline underline-offset-2 hover:text-green-800";
const seoLinkClassHero =
  "text-green-400 underline underline-offset-2 hover:text-green-300";

const brandPlaceholder = "KASHOME_ELEVATORS_BRAND";

function createSeoLinker(excludeHref?: string) {
  const linkedHrefs = new Set<string>();
  const links = [
    { phrase: "residential elevators", href: "/residential-elevator-hyderabad" },
    { phrase: "residential elevator", href: "/residential-elevator-hyderabad" },
    { phrase: "home elevators", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevator", href: "/home-elevator-in-hyderabad" },
    { phrase: "villa elevators", href: "/villa-elevator-hyderabad" },
    { phrase: "villa elevator", href: "/villa-elevator-hyderabad" },
    { phrase: "luxury villas", href: "/villa-elevator-hyderabad" },
    { phrase: "premium villas", href: "/villa-elevator-hyderabad" },
    { phrase: "luxury villa", href: "/villa-elevator-hyderabad" },
    { phrase: "premium villa", href: "/villa-elevator-hyderabad" },
    { phrase: "home lifts", href: "/home-lift-in-hyderabad" },
    { phrase: "home lift", href: "/home-lift-in-hyderabad" },
    {
      phrase: "home lift installation in Hyderabad",
      href: "/home-lift-installation-hyderabad",
    },
    {
      phrase: "home lift installation",
      href: "/home-lift-installation-hyderabad",
    },
  ]
    .filter((link) => link.href !== excludeHref)
    .sort((a, b) => b.phrase.length - a.phrase.length);

  return function linkSeoKeywords(
    text: string,
    linkClass: string = seoLinkClass,
  ): ReactNode {
    if (links.length === 0) return text;

    const protectedText = text
      .replace(/Kashome\s+Elevators/gi, brandPlaceholder)
      .replace(/KAS\s+Home\s+Elevators/gi, brandPlaceholder);

    const pattern = links
      .map((link) => link.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");
    const regex = new RegExp(`\\b(${pattern})\\b`, "gi");
    const hrefByPhrase = new Map(
      links.map((link) => [link.phrase.toLowerCase(), link.href]),
    );

    return protectedText.split(regex).map((part, index) => {
      const restoredPart = part.replace(
        new RegExp(brandPlaceholder, "g"),
        "Kashome Elevators",
      );
      const href = hrefByPhrase.get(part.toLowerCase());
      if (
        !href ||
        linkedHrefs.has(href) ||
        part.toUpperCase().includes(brandPlaceholder)
      ) {
        return restoredPart;
      }

      linkedHrefs.add(href);
      return (
        <a key={`${part}-${index}`} href={href} className={linkClass}>
          {restoredPart}
        </a>
      );
    });
  };
}

const pageUrl =
  "https://www.kashomeelevators.com/home-lift-installation-hyderabad/";
const siteUrl = "https://www.kashomeelevators.com/";
const imageFileName = "home-lift-installation-hyderabad.webp";
const imagePath = installationImage;
const imageUrl = `https://www.kashomeelevators.com/${imageFileName}`;
const imageAlt =
  "Professional Home Lift Installation in Hyderabad by Kashome Elevator";

const ctaButtons = [
  { href: "/contact", label: "Get Free Quote" },
  { href: "/contact", label: "Book Free Site Inspection" },
  { href: "/contact", label: "Schedule Installation Consultation" },
  { href: "/contact", label: "Talk to Our Lift Experts" },
  { href: "/contact", label: "Request a Callback" },
  { href: "/contact", label: "Call Our Lift Experts" },
  { href: "/contact", label: "WhatsApp Us" },
  { href: "/contact", label: "Contact Kashome Elevators Today" },
];

const seoTitle =
  "Lift Installation in Hyderabad | Certified Engineers & Free Site Visit – KAS";
const seoDescription =
  "Lift installation in Hyderabad starting ₹5 lakh. Certified engineers, safety-tested lifts, transparent pricing. Free site inspection — book now.";
const lastUpdatedIso = "2026-07-31";
const lastUpdatedDisplay = "31 July 2026";

export const metadata: Metadata = {
  title: seoTitle,
  description: seoDescription,
  keywords: [
    "lift installation Hyderabad",
    "home lift installation Hyderabad",
    "home lift installation cost Hyderabad",
    "residential elevator installation Hyderabad",
    "home elevator company Hyderabad",
    "villa lift installation Hyderabad",
    "MRL home lift installation",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: seoTitle,
    description: seoDescription,
    url: pageUrl,
    siteName: "Kashome Elevators",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: imageUrl,
        alt: imageAlt,
        width: 1200,
        height: 900,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: [imageUrl],
  },
  other: {
    "last-modified": lastUpdatedIso,
  },
};

const quickAnswer =
  "KAS Home Elevators provides certified lift installation in Hyderabad for villas, duplexes, and independent homes — covering free site inspection, MRL/hydraulic/gearless lift options, safety-tested installation, transparent pricing, and after-sales AMC support, typically completed within 4-7 weeks of confirmation.";

const trustStats = [
  { value: "10+", label: "Years of Expertise" },
  { value: "500+", label: "Installations Completed" },
  { value: "4", label: "Countries Served" },
];

const addedHeroParagraphs = [
  "Looking for reliable lift installation in Hyderabad that combines safety, precision, and long-term performance? KAS Home Elevators offers professional home lift installation services designed for villas, duplex homes, independent houses, and luxury residences across Hyderabad. Whether you're constructing a new home or upgrading an existing property, our experienced team delivers customized lift installation solutions that integrate seamlessly with your home's architecture.",
  "Every project begins with a detailed site inspection to understand your space, structural requirements, and personal preferences, followed by certified installation, safety testing, and dependable after-sales support — backed by 10+ years of experience and 500+ completed installations across India and abroad.",
];

const whatInstallationInvolveIntro =
  "Home lift installation is the professional process of fitting a residential elevator into a villa, duplex, or independent home. It includes site inspection, lift selection, structural planning, installation, safety testing, and final commissioning to ensure safe, reliable, long-lasting performance.";

const whatInstallationInvolveDetails =
  "Choosing a professional company for lift installation in Hyderabad is one of the most important decisions when adding a lift to your home. While selecting the right lift model matters, proper installation is what ensures long-term safety, smooth operation, and reliable performance. At KAS Home Elevators, every installation begins with a comprehensive site inspection and detailed project planning, followed by certified engineering, strict quality control, and complete testing before handover.";

const addedBenefitsIntro =
  "Professional installation improves accessibility for elderly and mobility-challenged family members, increases property value, adds everyday convenience, and — most importantly — ensures the lift is fitted to industry safety standards with features like Automatic Rescue Device (ARD) and battery backup.";

const addedBenefitsList = [
  "Enhanced accessibility for senior citizens, children, and mobility-challenged family members",
  "Increased property value and future resale readiness",
  "Everyday convenience — effortless movement of groceries, luggage, and furniture between floors",
  "Maximum safety — ARD, battery backup, overload protection, door interlocks, emergency alarms",
  "Energy-efficient, low-maintenance operation with optimized long-term running costs",
  "Tailored cabin design — interior finish, door style, capacity, and control panel matched to your home",
];

const addedTypesIntro =
  "KAS installs Machine Room-Less (MRL), Hydraulic, Gearless, Glass, and Compact home lifts. MRL and Compact suit space-constrained homes, Hydraulic and Gearless suit low-rise and luxury villas, and Glass lifts suit premium designer homes.";

const costIntro =
  "Lift installation in Hyderabad typically costs ₹5 lakh to ₹7.5 lakh for a compact 2-floor MRL or hydraulic lift, ₹7.5-10.5 lakh for a 3-floor villa installation, and ₹11 lakh+ for premium gearless or glass lift installations. Final pricing depends on floors, capacity, and finish.";

const costTable = [
  {
    configuration: "2-floor compact MRL/hydraulic installation",
    price: "₹5 lakh – ₹7.5 lakh",
  },
  {
    configuration: "3-floor villa installation",
    price: "₹7.5 lakh – ₹10.5 lakh",
  },
  {
    configuration: "Gearless installation (premium villa)",
    price: "₹10.5 lakh – ₹14 lakh",
  },
  {
    configuration: "Glass lift / fully customized installation",
    price: "₹12 lakh – ₹16 lakh+",
  },
];

const costNote =
  "These are indicative ranges — final installation cost is confirmed after a free site inspection, since structural conditions vary from home to home.";

const processIntro =
  "KAS follows a structured 6-stage lift installation process — site inspection, customized design, certified engineering, professional installation, safety testing, and handover with after-sales support. Most residential installations are completed within 4-7 weeks after design approval.";

const processSteps = [
  "Detailed Site Inspection — assessing structure, shaft requirements, available space, and electrical provisions.",
  "Customized Design & Planning — lift type, cabin finish, door configuration, and control panel selected to match your home.",
  "Certified Engineering & Manufacturing — premium components sourced from trusted manufacturers.",
  "Professional Installation — certified engineers install with precise alignment and structural stability.",
  "Safety Testing & Quality Checks — operational testing, emergency function verification, overload testing, door alignment checks.",
  "Handover & After-Sales Support — final walkthrough, documentation, warranty, and AMC options.",
];

const processTimeline =
  "Typical timeline: 4-5 weeks for compact MRL installations in existing homes; 6-7 weeks for villa, gearless, or glass lift installations requiring civil work.";

const addedSafetyIntro =
  "Every KAS lift installation follows industry-standard safety protocols, including Automatic Rescue Device (ARD), emergency battery backup, overload protection, door interlock systems, emergency alarms, and comprehensive pre-handover quality inspection.";

const addedMaintenanceIntro =
  "KAS provides preventive maintenance, Annual Maintenance Contracts (AMC), fast technical assistance, and genuine spare parts to keep every installed lift operating safely and efficiently throughout its lifespan.";

const serviceAreas = [
  "Banjara Hills",
  "Jubilee Hills",
  "Gachibowli",
  "Madhapur",
  "Kondapur",
  "Kukatpally",
  "Miyapur",
  "HITEC City",
  "Kompally",
  "Manikonda",
  "Tellapur",
  "Shamshabad",
  "Secunderabad",
  "Uppal",
  "LB Nagar",
];

const serviceAreasIntro =
  "KAS Home Elevators provides lift installation services across Hyderabad, including Banjara Hills, Jubilee Hills, Gachibowli, Madhapur, Kondapur, Kukatpally, Miyapur, HITEC City, Kompally, Manikonda, Tellapur, Shamshabad, Secunderabad, Uppal, and LB Nagar.";

const addedWhyKasIntro =
  "KAS Home Elevators brings 10+ years of experience, 500+ completed lift installations, and multi-country operations (India, UAE, Malaysia), with certified engineers, transparent pricing, and dependable after-sales AMC support.";

const addedWhyKasPoints = [
  "10+ years of dedicated lift installation experience",
  "500+ installations completed across villas, duplexes, and independent houses",
  "Multi-country presence — offices in Hyderabad, Abu Dhabi, Kuala Lumpur, and Lucknow",
  "Certified installation engineers — in-house team, no outsourced sub-contracting",
  "Transparent pricing with no hidden costs",
  "Comprehensive maintenance and AMC support after installation",
];

const addedMaintenanceList = [
  "Preventive maintenance services with scheduled inspections",
  "Flexible AMC plans covering routine servicing and performance checks",
  "Fast technical assistance to minimize downtime",
  "Genuine, manufacturer-recommended replacement components",
];

const ctaQuoteIntro =
  "Planning lift installation for your villa, duplex, or independent house in Hyderabad? Book a free site inspection with KAS Home Elevators and get a personalized quotation based on your home's exact layout and budget.";

const businessPhone = "+91-8019219911";
const businessPhoneTel = "tel:+918019219911";
const businessEmail = "assist@kashomeelevators.com";

const tocLinks = [
  { href: "#what-involve", label: "What Installation Involves" },
  { href: "#why-choose", label: "Why Choose Professional Installation" },
  { href: "#benefits", label: "Benefits" },
  { href: "#features", label: "Features" },
  { href: "#lift-types", label: "Types of Home Lifts" },
  { href: "#cost", label: "Cost" },
  { href: "#process", label: "Process & Timeline" },
  { href: "#maintenance", label: "Maintenance & AMC" },
  { href: "#solutions", label: "Installation Solutions" },
  { href: "#areas", label: "Areas We Serve" },
  { href: "#why-kashome", label: "Why KAS Home Elevators" },
  { href: "#faqs", label: "FAQs" },
  { href: "#contact", label: "Contact Us" },
];

const heroParagraphs = [
  "Looking for reliable residential lift installation in Hyderabad that combines safety, precision, and long-term performance? Kashome Elevators offers professional home lift installation services designed for villas, duplex homes, independent houses, and luxury residences across Hyderabad. Whether you are constructing a new home or upgrading an existing property, our experienced team delivers customized lift installation solutions that seamlessly integrate with your home's architecture while enhancing accessibility, convenience, and overall lifestyle.",
  "A professionally installed home lift is more than just a mobility solution—it is an investment in comfort, safety, and the future value of your property. At Kashome Elevators, we begin every project with a detailed site inspection to understand your space, structural requirements, and personal preferences. This allows us to recommend the most suitable home elevator system and ensure a smooth, efficient installation process that meets the highest industry standards.",
  "Our certified installation engineers use advanced techniques and premium-quality components to install hydraulic lifts, machine room-less (MRL) lifts, gearless elevators, and fully customized residential lift systems. Every home lift installation in Hyderabad is carried out with a strong focus on safety, energy efficiency, smooth operation, and long-term reliability. From planning and installation to testing, commissioning, and after-sales support, we manage every stage with complete professionalism and attention to detail.",
  "Whether you need a compact lift for limited space or a premium elevator for a luxury villa, Kashome Elevators provides tailored home lift installation services in Hyderabad that match your lifestyle and budget. Our commitment to quality workmanship, timely project completion, transparent communication, and dependable maintenance support has made us a trusted choice for homeowners seeking modern, safe, and future-ready vertical mobility solutions.",
];

const introductionParagraphs = [
  "Installing a home lift is no longer considered a luxury—it's a practical investment that enhances comfort, accessibility, and the overall value of your property. If you're looking for residential elevator installation in Hyderabad, choosing the right installation partner is just as important as selecting the right lift. A professionally installed home lift ensures smooth operation, long-term reliability, and maximum safety for every member of your family. Whether you own a villa, duplex home, bungalow, or an independent house, a customized home lift can transform the way you move between floors while complementing your home's modern architecture.",
  "At Kashome Elevators, we specialize in providing professional home elevator installation in Hyderabad using advanced technology, premium-quality components, and industry-approved installation practices. Every project begins with a detailed site inspection to understand your property's layout, structural requirements, and mobility needs. Based on this assessment, our experts recommend the most suitable lift solution and complete the installation with precision, ensuring compliance with the highest safety and quality standards.",
  "From compact home lifts for limited spaces to premium elevators for luxury residences, we offer customized installation solutions designed to meet your specific requirements. Our experienced engineers manage every stage of the project—from planning and lift installation to testing, commissioning, and after-sales support—so you receive a hassle-free experience and complete peace of mind.",
];

const introductionAeo =
  "Home lift installation in Hyderabad is the professional process of installing a residential elevator in a home, villa, or duplex property. It includes site inspection, lift selection, structural planning, installation, safety testing, and final commissioning to ensure safe, reliable, and long-lasting performance.";

const whyChooseIntro = [
  "Choosing a professional company for home lift setup in Hyderabad is one of the most important decisions when adding a lift to your home. While selecting the right lift model matters, proper installation is what ensures long-term safety, smooth operation, and reliable performance. An expertly installed home lift not only improves accessibility but also protects your investment by reducing maintenance issues and extending the lifespan of the elevator. Whether you are building a new villa, upgrading a duplex house, or renovating an independent home, professional installation ensures your lift is integrated seamlessly with your property's structure and design.",
  "At Kashome Elevators, every residential elevator installation in Hyderabad begins with a comprehensive site inspection and detailed project planning. Our experienced engineers carefully evaluate your available space, structural requirements, travel height, and usage needs before recommending the most suitable lift solution. Every installation is carried out using premium-quality components, advanced engineering practices, and strict quality control measures to deliver a safe, efficient, and aesthetically pleasing result.",
  "From compact home elevators for limited spaces to luxury lifts for premium villas, our installation team follows industry best practices throughout the project. We prioritize precision, safety, and customer satisfaction, ensuring every lift operates smoothly while complementing your home's architecture. With complete installation support, testing, commissioning, and after-sales service, Kashome Elevators delivers a hassle-free experience that homeowners can rely on for years to come.",
];

const whyChooseItems = [
  {
    title: "Certified Installation by Experienced Engineers",
    content:
      "Professional installation requires technical expertise and precise execution. Our trained engineers follow a systematic installation process that meets industry safety standards and manufacturer specifications. Every component is installed with accuracy to ensure smooth performance, reliable operation, and long-term durability.",
  },
  {
    title: "Customized Installation for Every Home",
    content:
      "No two homes are exactly alike. That's why we provide customized home lift installation services in Hyderabad based on your property's layout, available space, interior design, and mobility requirements. Whether it's a villa, duplex, bungalow, or independent house, every installation is tailored to achieve the perfect balance of functionality and aesthetics.",
  },
  {
    title: "Advanced Safety Standards",
    content:
      "Safety is the foundation of every installation we undertake. Our home lifts are installed with advanced safety features such as Automatic Rescue Device (ARD), emergency battery backup, door interlocks, overload protection, emergency alarms, and smooth start-and-stop technology. Every system undergoes comprehensive testing before handover to ensure dependable performance and complete peace of mind.",
  },
  {
    title: "Complete Project Management",
    content:
      "Our team manages the entire installation journey—from initial consultation and site inspection to lift installation, testing, commissioning, and post-installation support. This end-to-end approach ensures timely project completion, transparent communication, and a seamless experience for every homeowner.",
  },
];

const whyChooseAeo =
  "Professional home lift installation in Hyderabad ensures that a residential elevator is installed safely, accurately, and in compliance with industry standards. Certified engineers perform site inspection, structural planning, installation, testing, and commissioning to deliver reliable performance, enhanced safety, and long-term durability.";

const whyChooseClosing =
  "Installing a home lift is a long-term investment, and choosing the right installation partner makes all the difference. With expert planning, certified engineers, advanced safety standards, and dependable after-sales support, Kashome Elevators provides professional home lift installation solutions that deliver comfort, convenience, and lasting value for your home.";

const benefitsIntro =
  "Investing in professional residential lift installation in Hyderabad offers far more than convenient movement between floors. A properly installed home lift enhances your property's safety, accessibility, comfort, and long-term value while ensuring reliable performance for years to come. Whether you're building a new villa, renovating a duplex house, or upgrading an independent home, expert installation guarantees that your lift operates efficiently and complies with the highest safety standards. Choosing experienced professionals also minimizes future maintenance issues, reduces installation risks, and ensures the elevator integrates seamlessly with your home's design.";

const benefitsSubIntro =
  "At Kashome Elevators, we believe every homeowner deserves a lift installation that delivers both functionality and peace of mind. Our experienced engineers carefully plan every stage of the installation process, using premium components and advanced engineering techniques to provide a safe, smooth, and energy-efficient residential lift solution. With customized installation services, comprehensive testing, and dedicated after-sales support, we help homeowners enjoy the full benefits of modern vertical mobility.";

const benefits = [
  {
    title: "Enhanced Accessibility for Every Family Member",
    content:
      "One of the biggest advantages of professional home lift setup in Hyderabad is improved accessibility throughout your home. A residential lift allows senior citizens, children, pregnant women, and individuals with mobility challenges to move safely and comfortably between floors without depending on stairs. It creates a barrier-free living environment that promotes independence and convenience for every family member.",
  },
  {
    title: "Increased Property Value and Future Readiness",
    content:
      "A professionally installed home lift is a valuable long-term investment that enhances the appeal and market value of your property. Modern homebuyers increasingly prefer homes equipped with advanced accessibility features, making your villa or independent house more attractive for future resale. It also prepares your home for changing family needs in the years ahead.",
  },
  {
    title: "Superior Comfort and Everyday Convenience",
    content:
      "Transporting groceries, luggage, furniture, or household items between floors becomes effortless with a home lift. Smooth, quiet, and efficient operation improves daily living while reducing physical strain. A professionally installed lift adds convenience to everyday routines and enhances the overall comfort of your home.",
  },
  {
    title: "Maximum Safety and Reliable Performance",
    content:
      "Professional installation ensures every lift is fitted according to industry standards and thoroughly tested before use. Our installations include advanced safety features such as Automatic Rescue Device (ARD), emergency battery backup, overload protection, door interlock systems, emergency alarms, and smooth start-and-stop technology, providing dependable performance and complete peace of mind.",
  },
  {
    title: "Energy-Efficient and Low-Maintenance Operation",
    content:
      "Modern home lifts are designed to deliver outstanding performance while consuming minimal energy. Professional installation helps optimize system efficiency, reduces wear on components, and minimizes long-term maintenance requirements. This results in lower operating costs and reliable performance throughout the lift's lifespan.",
  },
  {
    title: "Tailored Cabin Design and Finish Options",
    content:
      "Beyond fitting the lift to your available space, we personalize the cabin itself — interior finishes, door style, capacity, and control panel — so the final result matches your home's interior design instead of looking like a generic add-on.",
  },
  {
    title: "Professional Support from Installation to Maintenance",
    content:
      "Choosing Kashome Elevators means partnering with a team that supports you throughout the entire journey. From initial consultation and site inspection to installation, testing, commissioning, and after-sales maintenance, our experts ensure every project is completed with precision, transparency, and a commitment to long-term customer satisfaction.",
  },
];

const benefitsAeo =
  "Professional home lift installation ensures a residential elevator is installed safely, efficiently, and according to industry standards. It improves accessibility, increases property value, enhances safety, reduces maintenance issues, and provides reliable long-term performance for villas, duplex homes, and independent houses.";

const benefitsClosing =
  "Installing a home lift is more than adding convenience—it's about creating a safer, smarter, and future-ready living space. With professional installation, advanced safety features, and expert engineering, Kashome Elevators helps homeowners enjoy dependable mobility solutions that add lasting comfort, value, and peace of mind.";

const featuresIntro =
  "A successful home lift installation in Hyderabad depends on more than just selecting the right elevator—it requires expert planning, precise engineering, and professional execution. At Kashome Elevators, we provide complete home lift installation services that ensure every residential elevator is installed safely, efficiently, and according to industry standards. From the initial consultation to final handover, our experienced team manages every stage of the installation process with attention to detail, delivering a hassle-free experience and long-lasting performance.";

const featuresSubIntro =
  "Our installation services are designed for villas, duplex homes, bungalows, independent houses, and luxury residences across Hyderabad. We understand that every property has unique structural requirements, which is why we offer customized installation solutions that perfectly match your home's layout, available space, and architectural style. Using premium-quality components, advanced tools, and modern installation techniques, we ensure every lift operates smoothly, safely, and efficiently for years to come.";

const features = [
  {
    title: "Detailed Site Inspection and Planning",
    content:
      "Every project begins with a comprehensive site inspection. Our engineers carefully assess the building structure, shaft requirements, available space, electrical provisions, and user requirements before recommending the most suitable installation plan. Proper planning minimizes delays and ensures a seamless installation process.",
  },
  {
    title: "Customized Installation Solutions",
    content:
      "No two homes are the same. Our home lift installation services in Hyderabad are fully customized to suit villas, duplex houses, independent homes, and existing residential buildings. We design every installation to complement your home's architecture while maximizing safety, comfort, and functionality.",
  },
  {
    title: "Certified Installation Engineers",
    content:
      "Our team consists of trained and experienced professionals who follow industry-approved installation practices. Every home elevator installation in Hyderabad is completed with precision, ensuring proper alignment, smooth operation, structural stability, and compliance with all recommended safety standards.",
  },
  {
    title: "Advanced Safety Testing and Quality Checks",
    content:
      "Safety is our highest priority. Before handing over the lift, we perform comprehensive quality inspections, operational testing, emergency function checks, door alignment verification, overload testing, and system calibration. This ensures every home lift operates reliably from day one.",
  },
  {
    title: "Premium Components and Modern Technology",
    content:
      "We install home lifts using high-quality components sourced from trusted manufacturers. Our systems incorporate advanced technologies such as Machine Room-Less (MRL) designs, energy-efficient drives, Automatic Rescue Device (ARD), emergency battery backup, and intelligent control systems to deliver smooth, quiet, and dependable performance.",
  },
  {
    title: "Timely Installation with Complete Project Management",
    content:
      "Our installation process is professionally managed from start to finish. From consultation and planning to installation, testing, commissioning, and final handover, our dedicated team maintains clear communication and ensures your project is completed on schedule without compromising quality.",
  },
  {
    title: "Comprehensive After-Sales Support",
    content:
      "Our commitment continues even after installation is complete. We provide preventive maintenance, technical support, system inspections, repairs, and Annual Maintenance Contract (AMC) services to keep your home lift operating safely and efficiently throughout its lifespan.",
  },
];

const featuresAeo =
  "Home lift installation services include site inspection, structural planning, customized installation, safety testing, commissioning, and after-sales support. Professional installation ensures your residential elevator operates safely, efficiently, and reliably while complying with industry standards and delivering long-term performance.";

const featuresClosing =
  "Choosing Kashome Elevators means partnering with a team that prioritizes quality, safety, and customer satisfaction at every stage of the installation journey. Our customized home lift installation services in Hyderabad are designed to deliver dependable performance, modern aesthetics, and complete peace of mind for homeowners.";

const liftTypesIntro =
  "Choosing the right lift is one of the most important steps in any residential lift installation in Hyderabad. Every home has different architectural designs, space availability, travel height, and accessibility requirements, which is why a single lift solution cannot suit every property. At Kashome Elevators, we offer a wide range of home lift installation solutions designed to match your lifestyle, budget, and home structure. Whether you are building a new villa, renovating a duplex house, or upgrading an independent home, our experts help you select the most suitable residential elevator for maximum safety, comfort, and long-term performance.";

const liftTypesSubIntro =
  "Our experienced team evaluates your property's layout, available installation space, usage requirements, and future needs before recommending the ideal home lift system. Every home lift installation in Hyderabad is completed using premium components, advanced engineering practices, and strict safety standards, ensuring reliable operation and seamless integration with your home's interior.";

const liftTypes = [
  {
    title: "Machine Room-Less (MRL) Home Lifts",
    content:
      "Machine Room-Less (MRL) home lifts are one of the most popular choices for modern homes due to their compact design and space-saving installation. These lifts eliminate the need for a separate machine room, making them ideal for villas, duplex homes, and independent houses with limited construction space. MRL lifts offer smooth operation, low maintenance requirements, and excellent energy efficiency while maintaining a sleek and modern appearance.",
  },
  {
    title: "Hydraulic Home Lifts",
    content:
      "Hydraulic home lifts provide powerful, quiet, and comfortable vertical transportation for residential properties. They are well suited for low-rise buildings and luxury homes where smooth ride quality and high lifting capacity are important. Their robust engineering, reliable performance, and enhanced safety features make them an excellent option for homeowners seeking long-term durability.",
  },
  {
    title: "Gearless Home Elevators",
    content:
      "Gearless home elevators are designed using advanced traction technology to deliver exceptionally smooth, quiet, and energy-efficient operation. These premium residential elevators require less maintenance, consume lower power, and provide superior ride comfort, making them a preferred choice for luxury villas and high-end residential projects.",
  },
  {
    title: "Glass Home Lifts",
    content:
      "Glass home lifts combine functionality with elegant architectural design. Featuring panoramic glass cabins, these elevators create a luxurious visual appeal while allowing natural light to flow through the space. They are an excellent addition to premium villas, designer homes, and modern residences where aesthetics are as important as performance.",
  },
  {
    title: "Compact Home Lifts",
    content:
      "For homes with limited installation space, compact home lifts provide an efficient mobility solution without requiring major structural modifications. These lifts are specifically designed for existing homes, duplex houses, and small residential properties where maximizing available space is essential while maintaining safety and convenience.",
  },
  {
    title: "Customized Home Lift Solutions",
    content:
      "Every home is unique, which is why Kashome Elevators offers fully customized home lift installation services in Hyderabad. From cabin interiors and door configurations to lift capacity, finishes, control systems, and safety features, every installation can be tailored to suit your home's architecture, interior design, and personal preferences.",
  },
];

const liftTypesAeo =
  "The best type of home lift depends on your home's structure, available space, travel height, and usage requirements. Machine Room-Less (MRL), hydraulic, gearless, glass, compact, and customized home lifts each offer unique advantages, allowing homeowners to choose the ideal solution for safe, efficient, and comfortable vertical mobility.";

const liftTypesClosing =
  "No matter the size or style of your home, Kashome Elevators provides professional residential elevator installation in Hyderabad with customized lift solutions that combine advanced technology, superior safety, modern aesthetics, and reliable long-term performance. Our experts help you choose the perfect residential elevator to meet your present and future mobility needs.";

const liftTypesComparison = [
  {
    type: "Machine Room-Less (MRL)",
    bestFor: "Villas, duplex & independent houses",
    spaceNeeded: "Compact / space-saving",
    highlight: "Low maintenance, energy-efficient",
  },
  {
    type: "Hydraulic",
    bestFor: "Low-rise & luxury homes",
    spaceNeeded: "Moderate",
    highlight: "Powerful, quiet, high lifting capacity",
  },
  {
    type: "Gearless",
    bestFor: "Luxury villas & high-end projects",
    spaceNeeded: "Moderate",
    highlight: "Smooth, energy-efficient, low maintenance",
  },
  {
    type: "Glass",
    bestFor: "Premium villas & designer homes",
    spaceNeeded: "Moderate to spacious",
    highlight: "Panoramic cabin, architectural appeal",
  },
  {
    type: "Compact",
    bestFor: "Existing homes, limited space",
    spaceNeeded: "Minimal",
    highlight: "Fits without major structural changes",
  },
];

const solutionsIntro =
  "At Kashome Elevators, we provide complete home elevator installation in Hyderabad with customized solutions for every type of residential property. Whether you are constructing a new villa, upgrading a duplex home, or renovating an existing independent house, our experienced team delivers end-to-end installation services that ensure safety, efficiency, and long-term performance. Every installation project is planned after a detailed site inspection to ensure the lift perfectly matches your property's structure, available space, and lifestyle requirements.";

const solutionsSubIntro =
  "We install premium-quality home lifts using advanced technology and industry-approved engineering practices. From compact home lifts for limited spaces to luxury residential elevators for premium villas, every solution is designed to deliver smooth operation, energy efficiency, and exceptional reliability while complementing your home's architecture.";

const solutions = [
  {
    title: "Customized Lift Planning",
    content:
      "Every installation begins with a detailed consultation and site survey to understand structural requirements and recommend the ideal lift solution.",
  },
  {
    title: "Professional Installation",
    content:
      "Our certified engineers perform precise installation using premium components and modern equipment to ensure long-lasting performance.",
  },
  {
    title: "Testing & Commissioning",
    content:
      "Each home lift undergoes complete operational testing, safety inspections, and quality checks before final handover.",
  },
  {
    title: "Complete Project Support",
    content:
      "From planning and installation to documentation and after-sales assistance, we manage every stage professionally.",
  },
];

const solutionsAeo =
  "Professional home lift installation solutions include consultation, site inspection, customized planning, installation, safety testing, and commissioning. A complete installation process ensures safe operation, long-term reliability, and maximum homeowner satisfaction.";

const solutionsClosing =
  "Installing the right home lift begins with choosing the right installation partner. Kashome Elevators delivers customized solutions that combine engineering excellence, advanced technology, and dependable service for every residential project.";

const safetyIntro =
  "Safety is the highest priority during every home lift installation in Hyderabad. At Kashome Elevators, we follow strict installation protocols and industry-recommended safety standards to ensure every residential elevator performs reliably for years to come. Our certified engineers inspect every component throughout the installation process and conduct multiple quality checks before the lift is handed over to the homeowner.";

const safetySubIntro =
  "Every installation is completed using premium-quality materials, precision engineering techniques, and modern safety technologies that minimize operational risks while maximizing passenger safety and comfort.";

const safetyItems = [
  {
    title: "Industry-Standard Installation Practices",
    content:
      "Our installation procedures follow established engineering guidelines to ensure accurate alignment, structural stability, and dependable performance.",
  },
  {
    title: "Advanced Safety Features",
    content:
      "Every home lift can be equipped with Automatic Rescue Device (ARD), emergency battery backup, overload protection, emergency alarms, door interlock systems, and smooth start-and-stop technology.",
  },
  {
    title: "Comprehensive Quality Inspection",
    content:
      "Before commissioning, every lift undergoes detailed inspection, operational testing, emergency function verification, and final safety approval.",
  },
  {
    title: "Reliable Performance",
    content:
      "Our preventive installation approach minimizes future maintenance issues while improving system efficiency and operational reliability.",
  },
];

const safetyAeo =
  "Professional home lift installation follows strict safety standards, including structural inspections, equipment testing, emergency safety verification, and quality control. These measures ensure every residential elevator operates safely, smoothly, and efficiently for long-term use.";

const safetyClosing =
  "With Kashome Elevators, homeowners receive professionally installed lift systems that prioritize passenger safety, engineering precision, and dependable daily performance.";

const maintenanceIntro =
  "Professional installation is only the beginning of a reliable elevator system. Kashome Elevators provides complete maintenance and after-sales support for every home lift setup in Hyderabad, helping homeowners keep their residential elevators operating safely and efficiently throughout their lifespan. Our dedicated service team responds quickly to maintenance requirements while performing regular inspections to maximize performance and minimize unexpected breakdowns.";

const maintenanceSubIntro =
  "Routine maintenance not only extends the life of your home lift but also ensures every safety system continues functioning as intended.";

const maintenanceItems = [
  {
    title: "Preventive Maintenance Services",
    content:
      "Scheduled inspections help identify minor issues before they become costly repairs, improving long-term reliability.",
  },
  {
    title: "Annual Maintenance Contracts (AMC)",
    content:
      "Flexible AMC plans include routine servicing, inspections, performance checks, and technical support to keep your lift operating smoothly.",
  },
  {
    title: "Fast Technical Assistance",
    content:
      "Our experienced technicians provide prompt support whenever service or troubleshooting is required, reducing downtime and inconvenience.",
  },
  {
    title: "Genuine Spare Parts",
    content:
      "We use high-quality replacement components that maintain system performance, safety, and manufacturer-recommended standards.",
  },
];

const maintenanceAeo =
  "Home lift maintenance includes routine inspections, preventive servicing, safety testing, repairs, and technical support. Regular maintenance improves reliability, extends equipment life, and ensures safe daily operation for residential elevators.";

const maintenanceClosing =
  "Our long-term maintenance commitment ensures your investment continues delivering comfort, safety, and dependable performance for many years after installation.";

const whyKashomeIntro = [
  "Choosing the right company for residential elevator installation in Hyderabad is essential for ensuring safety, quality, and long-term satisfaction. Kashome Elevators has earned the trust of homeowners by delivering customized residential elevator solutions backed by experienced engineers, advanced technology, premium-quality products, and dedicated customer support. Every installation is planned carefully, executed professionally, and supported with comprehensive after-sales service.",
  "Our focus is not only on installing home lifts but also on creating safe, convenient, and future-ready living spaces that improve everyday life.",
];

const whyKashome = [
  {
    title: "Experienced Installation Team",
    content:
      "Our skilled professionals have extensive experience installing residential elevators for villas, duplex homes, and independent houses.",
  },
  {
    title: "Customized Solutions",
    content:
      "Every installation is designed according to your property's structure, available space, design preferences, and mobility requirements.",
  },
  {
    title: "Quality Products and Advanced Technology",
    content:
      "We use modern lift systems featuring energy-efficient technology, premium components, and advanced safety features for reliable long-term performance.",
  },
  {
    title: "End-to-End Customer Support",
    content:
      "From consultation and planning to installation, maintenance, and technical assistance, we provide complete support throughout your home lift journey.",
  },
];

const whyKashomeAeo =
  "Kashome Elevators provides professional home lift installation with customized solutions, certified engineers, advanced safety standards, premium-quality lift systems, and dependable after-sales support, ensuring homeowners receive a safe, reliable, and long-lasting mobility solution.";

const whyKashomeClosing =
  "Choose Kashome Elevators for a seamless installation experience, expert guidance, and customized home lift solutions that enhance accessibility, convenience, and the long-term value of your home.";

const faqs = [
  {
    question: "How much does lift installation cost in Hyderabad?",
    answer:
      "Lift installation in Hyderabad typically costs between ₹5 lakh and ₹7.5 lakh for a compact 2-floor MRL or hydraulic lift, going up to ₹16 lakh+ for premium gearless or glass lift installations. Book a free site inspection for an exact quote.",
  },
  {
    question: "How long does home lift installation take?",
    answer:
      "Most installations take 4-7 weeks from design approval to handover, depending on lift type and civil work required.",
  },
  {
    question: "Which type of home lift is best for residential properties?",
    answer:
      "MRL, hydraulic, gearless, and compact home lifts are the most popular options for villas, duplex homes, and independent houses in Hyderabad.",
  },
  {
    question: "Can a home lift be installed in an existing house?",
    answer:
      "Yes. Modern home lifts can be installed in many existing homes with minimal structural modifications, following a detailed site inspection.",
  },
  {
    question: "Are home lifts safe for children and senior citizens?",
    answer:
      "Yes. Every KAS installation includes Automatic Rescue Device, battery backup, door interlocks, overload protection, and emergency alarms.",
  },
  {
    question: "Do home lifts require regular maintenance?",
    answer:
      "Yes, routine servicing ensures smooth performance and long-term reliability. KAS offers AMC plans for ongoing support.",
  },
  {
    question: "Do you provide customized lift installation in Hyderabad?",
    answer:
      "Yes. Every installation is customized to your home's architecture, available space, design preferences, and mobility requirements.",
  },
  {
    question: "What safety checks are performed before handover?",
    answer:
      "Every lift undergoes operational testing, emergency function verification, door alignment checks, overload testing, and safety validation.",
  },
  {
    question: "Do you provide maintenance and after-sales support?",
    answer:
      "Yes. We offer preventive maintenance, Annual Maintenance Contracts, technical support, inspections, repairs, and genuine spare parts.",
  },
  {
    question:
      "Why should I choose KAS Home Elevators for lift installation in Hyderabad?",
    answer:
      "KAS combines 10+ years of experience, 500+ completed installations, certified engineers, transparent pricing, and dependable after-sales AMC support.",
  },
  {
    question: "Is government or society approval required for a home lift in Hyderabad?",
    answer:
      "Requirements vary — independent villas generally need standard structural and electrical compliance, while gated-community installations may require society approval. Our team guides you through applicable local approvals.",
  },
  {
    question: "What warranty do you provide on lift installation?",
    answer:
      "KAS provides a standard manufacturer warranty on lift components, with coverage depending on the lift model. Optional extended warranty and AMC plans are also available.",
  },
  {
    question: "How much space is required to install a home lift?",
    answer:
      "A compact MRL home lift can fit into as little as 4-5 sq. ft. of shaft space. Our engineers confirm the exact requirement during the free site inspection.",
  },
];

const contactParagraphs = [
  "Looking for trusted home elevator installation in Hyderabad? Kashome Elevators is your reliable partner for safe, customized, and professionally installed home lift solutions. Whether you need a home lift for a villa, duplex house, bungalow, or independent home, our experienced team is here to help you choose the right elevator and ensure a smooth installation process from start to finish.",
  "We offer end-to-end support, including free consultation, site inspection, lift selection, customized design recommendations, professional installation, safety testing, commissioning, and dependable after-sales service. Our goal is to provide every homeowner with a high-quality home lift solution that enhances comfort, accessibility, and long-term property value.",
];

const contactSections = [
  {
    title: "Get in Touch with Our Experts",
    content:
      "Our lift specialists are ready to answer your questions, understand your requirements, and recommend the best home lift installation solution for your property. We provide personalized guidance to help you make the right decision based on your space, budget, and lifestyle.",
  },
  {
    title: "Book a Free Site Inspection",
    content:
      "Every successful installation begins with a detailed site assessment. Schedule a free site inspection with our experts to evaluate your property's structure, discuss your requirements, and receive a customized home lift installation plan.",
  },
  {
    title: "Request a Free Quote",
    content:
      "Planning to install a residential elevator? Contact Kashome Elevators today for a no-obligation quotation. We'll provide a transparent estimate based on your home's specifications and recommend the most suitable lift solution for your needs.",
  },
];

const contactPoints = [
  "📞 Call our elevator experts for a free consultation.",
  "📧 Send us your enquiry, and our team will respond promptly.",
  "🏡 Schedule a free site inspection at your home.",
  "💰 Request a customized quotation based on your project requirements.",
  "🔧 Get professional guidance on choosing the right residential elevator for your property.",
];

const contactClosing =
  "Take the first step towards a safer, smarter, and more accessible home with Kashome Elevators. Contact us today to discuss your project and discover why homeowners trust us for premium residential elevator installation in Hyderabad backed by quality, innovation, and dependable customer support.";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Kashome Elevators",
  image: imageUrl,
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
  name: "Kashome Elevators",
  url: "https://www.kashomeelevators.com",
  logo: imageUrl,
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
  name: "Home Lift Installation in Hyderabad",
  serviceType: "Home Lift Installation",
  description:
    "Kashome Elevators provides professional home lift installation in Hyderabad for villas, duplex homes, independent houses, and luxury residences with advanced safety features and customized solutions.",
  provider: {
    "@type": "Organization",
    name: "Kashome Elevators",
    url: "https://www.kashomeelevators.com",
  },
  areaServed: {
    "@type": "City",
    name: "Hyderabad",
  },
  url: pageUrl,
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  url: pageUrl,
  name: "Home Lift Installation in Hyderabad – Certified Engineers, Transparent Process, Trusted Results",
  description: seoDescription,
  dateModified: lastUpdatedIso,
  isPartOf: {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "Kashome Elevators",
  },
  breadcrumb: {
    "@id": `${pageUrl}#breadcrumb`,
  },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["#quick-answer", "h1"],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${pageUrl}#breadcrumb`,
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
      name: "Home Lift Installation in Hyderabad – Certified Engineers, Transparent Process, Trusted Results",
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

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How Home Lift Installation Works in Hyderabad",
  description:
    "The step-by-step process Kashome Elevators follows for professional home lift installation in Hyderabad, from consultation to after-sales support.",
  totalTime: "P7W",
  step: [
    ...processSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.split(" — ")[0],
      text: step,
    })),
  ],
};

function ListSection({
  id,
  title,
  intro,
  subIntro,
  items,
  aeo,
  closing,
  bgWhite = false,
  linkSeoKeywords,
}: {
  id?: string;
  title: string;
  intro?: string;
  subIntro?: string;
  items: { title: string; content: string }[];
  aeo?: string;
  closing?: string;
  bgWhite?: boolean;
  linkSeoKeywords: (text: string) => ReactNode;
}) {
  return (
    <section id={id} className={`py-16 ${bgWhite ? "bg-white" : ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          {title}
        </h2>
        {intro ? (
          <p className="text-gray-700 leading-relaxed mb-4">
            {linkSeoKeywords(intro)}
          </p>
        ) : null}
        {subIntro ? (
          <p className="text-gray-700 leading-relaxed mb-8">
            {linkSeoKeywords(subIntro)}
          </p>
        ) : null}
        <ul className="space-y-6 list-disc pl-6">
          {items.map((item) => (
            <li key={item.title} className="text-gray-700 leading-relaxed">
              <h3 className="text-gray-900 font-bold">
                {linkSeoKeywords(item.title)}
              </h3>
              <p className="mt-2">{linkSeoKeywords(item.content)}</p>
            </li>
          ))}
        </ul>
        {aeo ? (
          <p className="text-gray-700 leading-relaxed mt-8 rounded-xl border border-green-100 bg-green-50/60 px-5 py-4">
            {linkSeoKeywords(aeo)}
          </p>
        ) : null}
        {closing ? (
          <p className="text-gray-700 leading-relaxed mt-8">
            {linkSeoKeywords(closing)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default function HomeLiftInstallationHyderabadPage() {
  const linkSeoKeywords = createSeoLinker(currentPageHref);

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <main>
        <section className="relative pt-6 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_45%)]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 pt-2 text-sm text-slate-300"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-white" aria-current="page">
                  Home Lift Installation Hyderabad
                </li>
              </ol>
            </nav>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 max-w-5xl">
              Home Lift Installation in Hyderabad – Certified Engineers,
              Transparent Process, Trusted Results
            </h1>
            <p className="text-slate-300 text-sm mb-8 lg:mb-10">
              Trusted by Hyderabad homeowners · Certified engineers · Last
              updated {lastUpdatedDisplay}
            </p>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-slate-100 leading-relaxed">
                <p>
                  {linkSeoKeywords(addedHeroParagraphs[0], seoLinkClassHero)}
                </p>
                <p>{linkSeoKeywords(heroParagraphs[0], seoLinkClassHero)}</p>
                <p>{linkSeoKeywords(heroParagraphs[1], seoLinkClassHero)}</p>

                <div className="!mt-8 grid grid-cols-3 gap-4 max-w-md">
                  {trustStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-green-400">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-300 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 lg:sticky lg:top-32">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-600/50">
                  <Image
                    src={imagePath}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-700/60 space-y-5 text-base sm:text-lg text-slate-100 leading-relaxed">
              <p>
                {linkSeoKeywords(addedHeroParagraphs[1], seoLinkClassHero)}
              </p>
              {heroParagraphs.slice(2).map((paragraph) => (
                <p key={paragraph}>
                  {linkSeoKeywords(paragraph, seoLinkClassHero)}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <p
              id="quick-answer"
              className="text-gray-800 leading-relaxed rounded-xl border border-green-200 bg-green-50 px-5 py-4 font-medium"
            >
              {quickAnswer}
            </p>
            <nav aria-label="Table of contents" className="mt-6">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                On this page:
              </p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {tocLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-green-700 underline underline-offset-2 hover:text-green-800"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <section id="what-involve" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              What Does Home Lift Installation Involve?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{linkSeoKeywords(whatInstallationInvolveIntro)}</p>
              <p>{linkSeoKeywords(whatInstallationInvolveDetails)}</p>
            </div>
          </div>
        </section>

        <section id="why-choose" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Professional Home Lift Installation in Hyderabad?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
              {whyChooseIntro.map((paragraph) => (
                <p key={paragraph}>{linkSeoKeywords(paragraph)}</p>
              ))}
            </div>
            <figure className="mb-10">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                <Image
                  src="/site-inspection-home-lift-hyderabad.webp"
                  alt="Certified engineers inspecting site for home lift installation in Hyderabad"
                  title="Site Inspection for Home Lift Installation in Hyderabad"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-center text-sm text-gray-600">
                Kashome Elevators&apos; engineers conducting a detailed site
                inspection before beginning a home lift installation project.
              </figcaption>
            </figure>
            <ul className="space-y-6 list-disc pl-6">
              {whyChooseItems.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold">
                    {linkSeoKeywords(item.title)}
                  </h3>
                  <p className="mt-2">{linkSeoKeywords(item.content)}</p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-8 rounded-xl border border-green-100 bg-green-50/60 px-5 py-4">
              {linkSeoKeywords(whyChooseAeo)}
            </p>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(whyChooseClosing)}
            </p>
          </div>
        </section>

        <section id="benefits" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Benefits of Professional Home Lift Installation
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(addedBenefitsIntro)}
            </p>
            <ul className="space-y-3 list-disc pl-6 mb-8 text-gray-700 leading-relaxed">
              {addedBenefitsList.map((item) => (
                <li key={item}>{linkSeoKeywords(item)}</li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(benefitsIntro)}
            </p>
            {benefitsSubIntro ? (
              <p className="text-gray-700 leading-relaxed mb-8">
                {linkSeoKeywords(benefitsSubIntro)}
              </p>
            ) : null}
            <ul className="space-y-6 list-disc pl-6">
              {benefits.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold">
                    {linkSeoKeywords(item.title)}
                  </h3>
                  <p className="mt-2">{linkSeoKeywords(item.content)}</p>
                </li>
              ))}
            </ul>
            {benefitsAeo ? (
              <p className="text-gray-700 leading-relaxed mt-8 rounded-xl border border-green-100 bg-green-50/60 px-5 py-4">
                {linkSeoKeywords(benefitsAeo)}
              </p>
            ) : null}
            {benefitsClosing ? (
              <p className="text-gray-700 leading-relaxed mt-8">
                {linkSeoKeywords(benefitsClosing)}
              </p>
            ) : null}
          </div>
        </section>

        <ListSection
          id="features"
          title="Features of Our Home Lift Installation Services"
          intro={featuresAeo}
          subIntro={`${featuresIntro} ${featuresSubIntro ?? ""}`.trim()}
          items={features}
          closing={featuresClosing}
          bgWhite
          linkSeoKeywords={linkSeoKeywords}
        />

        <ListSection
          id="lift-types"
          title="Types of Home Lifts We Install"
          intro={addedTypesIntro}
          subIntro={`${liftTypesIntro} ${liftTypesSubIntro ?? ""}`.trim()}
          items={liftTypes}
          aeo={liftTypesAeo}
          closing={liftTypesClosing}
          linkSeoKeywords={linkSeoKeywords}
        />

        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 font-semibold">Lift Type</th>
                    <th className="px-4 py-3 font-semibold">Best For</th>
                    <th className="px-4 py-3 font-semibold">Space Needed</th>
                    <th className="px-4 py-3 font-semibold">Key Highlight</th>
                  </tr>
                </thead>
                <tbody>
                  {liftTypesComparison.map((row, index) => (
                    <tr
                      key={row.type}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.bestFor}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.spaceNeeded}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {row.highlight}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="cost" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Lift Installation Cost in Hyderabad
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(costIntro)}
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Configuration
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Approx. Price Range (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {costTable.map((row, index) => (
                    <tr
                      key={row.configuration}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                        {row.configuration}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {linkSeoKeywords(costNote)}
            </p>
          </div>
        </section>

        <section id="process" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Installation Process & Timeline
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(processIntro)}
            </p>
            <ol className="space-y-4 list-decimal pl-6 text-gray-700 leading-relaxed mb-8">
              {processSteps.map((step) => (
                <li key={step}>{linkSeoKeywords(step)}</li>
              ))}
            </ol>
            <p className="text-gray-700 leading-relaxed rounded-xl border border-green-100 bg-green-50/60 px-5 py-4">
              {linkSeoKeywords(processTimeline)}
            </p>
          </div>
        </section>

        <section id="maintenance" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Maintenance & After-Sales Support
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(addedMaintenanceIntro)}
            </p>
            <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-relaxed">
              {addedMaintenanceList.map((item) => (
                <li key={item}>{linkSeoKeywords(item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <ListSection
          id="solutions"
          title="Our Home Lift Installation Solutions"
          intro={solutionsIntro}
          subIntro={solutionsSubIntro}
          items={solutions}
          aeo={solutionsAeo}
          closing={solutionsClosing}
          linkSeoKeywords={linkSeoKeywords}
        />

        <section id="areas" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-8 sm:p-10 shadow-sm">
              <div className="max-w-3xl mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Areas We Serve in Hyderabad
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{linkSeoKeywords(serviceAreasIntro)}</p>
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 list-none">
                {serviceAreas.map((area) => (
                  <li
                    key={area}
                    className="flex items-center gap-3 rounded-xl border border-green-200 bg-white px-4 py-3.5 text-gray-800 shadow-sm transition-colors hover:border-green-300 hover:bg-green-50"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <span className="font-medium">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="why-kashome" className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose KAS Home Elevators in Hyderabad
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {linkSeoKeywords(addedWhyKasIntro)}
            </p>
            <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-relaxed">
              {addedWhyKasPoints.map((item) => (
                <li key={item}>{linkSeoKeywords(item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="faqs" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions (FAQs)
            </h2>
            <ul className="space-y-6 list-none">
              {faqs.map((item, index) => (
                <li key={item.question} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold mb-2">
                    {index + 1}. {item.question}
                  </h3>
                  <p>{linkSeoKeywords(item.answer)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="contact" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get in Touch with Kashome Elevators
              </h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-6 text-sm">
                <a
                  href={businessPhoneTel}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:border-green-600 transition-colors"
                >
                  <span className="block font-semibold text-gray-900">Call Us</span>
                  <span className="text-gray-700">{businessPhone}</span>
                </a>
                <a
                  href={`mailto:${businessEmail}`}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 hover:border-green-600 transition-colors"
                >
                  <span className="block font-semibold text-gray-900">Email Us</span>
                  <span className="text-gray-700">{businessEmail}</span>
                </a>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <span className="block font-semibold text-gray-900">Visit Us</span>
                  <span className="text-gray-700">
                    Jeedimetla, Hyderabad, Telangana 500055
                  </span>
                </div>
              </div>
              <ul className="space-y-3 text-gray-700 leading-relaxed mb-8 list-none">
                {contactPoints.map((point) => (
                  <li
                    key={point}
                    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                  >
                    {point}
                  </li>
                ))}
              </ul>
              <p className="text-gray-700 leading-relaxed mb-8">
                {linkSeoKeywords(contactClosing)}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  Contact Us Today
                </Link>
                <a
                  href={businessPhoneTel}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50 transition-colors"
                >
                  Call {businessPhone}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-green-600 to-green-500 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get a Free Quote
            </h2>
            <p className="text-green-50 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
              {ctaQuoteIntro}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
