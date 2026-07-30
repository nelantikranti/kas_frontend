import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

const currentPageHref = "/home-lift-in-hyderabad";
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
    { phrase: "residential home lifts", href: "/residential-elevator-hyderabad" },
    { phrase: "residential home lift", href: "/residential-elevator-hyderabad" },
    { phrase: "residential lifts", href: "/residential-elevator-hyderabad" },
    { phrase: "home elevators in Hyderabad", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevator in Hyderabad", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevators", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevator", href: "/home-elevator-in-hyderabad" },
    { phrase: "villa elevators", href: "/villa-elevator-hyderabad" },
    { phrase: "villa elevator", href: "/villa-elevator-hyderabad" },
    { phrase: "villa home lifts", href: "/villa-elevator-hyderabad" },
    { phrase: "luxury villas", href: "/villa-elevator-hyderabad" },
    { phrase: "luxury villa", href: "/villa-elevator-hyderabad" },
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

const pageUrl = "https://www.kashomeelevators.com/home-lift-in-hyderabad/";
const siteUrl = "https://www.kashomeelevators.com/";
const imageFileName = "Home-Lift-in-Hyderabad.webp";
const imagePath = `/${imageFileName}`;
const imageUrl = `https://www.kashomeelevators.com/${imageFileName}`;
const imageAlt =
  "Small space saving domestic home lift for independent house in Hyderabad.";

const ctaButtons = [
  { href: "/contact", label: "Get Free Quote" },
  { href: "/contact", label: "Book Free Site Inspection" },
  { href: "/contact", label: "Talk to Our Lift Expert" },
  { href: "/contact", label: "Request a Callback" },
  { href: "/contact", label: "Contact Us Today" },
];

export const metadata: Metadata = {
  title: "Home Lift in Hyderabad | Cost, Types & Free Site Visit – KAS",
  description:
    "Home lift in Hyderabad starting ₹4.5 lakh. Hydraulic, MRL & vacuum lifts for villas, duplex homes. 500+ installations, free site inspection. Book now.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Home Lift in Hyderabad | Cost, Types & Free Site Visit – KAS",
    description:
      "Home lift in Hyderabad starting ₹4.5 lakh. Hydraulic, MRL & vacuum lifts for villas, duplex homes. 500+ installations, free site inspection. Book now.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: imageUrl,
        alt: imageAlt,
      },
    ],
  },
};

const addedHeroParagraphs = [
  "A home lift in Hyderabad is no longer considered a luxury — it's a practical upgrade for modern villas, duplex homes, and multi-storey independent houses. Whether you're building a new home or retrofitting an existing one, a well-designed home lift gives every family member, especially senior citizens, children, and anyone with limited mobility, safe and effortless movement between floors.",
  "At KAS Home Elevators, we design and install premium home lifts across Hyderabad that combine advanced safety technology, elegant cabin design, and dependable engineering. From compact residential lifts for existing homes to fully customized solutions for luxury villas, every installation is handled end-to-end — site inspection, design, installation, and after-sales support — by our in-house technical team.",
  "If you're searching for a dependable, safety-first home lift in Hyderabad, KAS Home Elevators is your trusted partner — offering free site inspection, transparent pricing, and complete after-sales support.",
];

const whatIsHomeLiftIntro =
  "A home lift is a compact, low-power residential elevator installed inside a house to move people safely between floors. Unlike commercial lifts, home lifts need less shaft space (as little as 4x4 ft), run on single or three-phase power, and are designed for villas, duplex homes, and independent houses in Hyderabad.";

const whatIsHomeLiftDetails =
  "A home lift in Hyderabad is becoming an essential feature for modern homes, offering the perfect combination of convenience, accessibility, and contemporary living. At KAS Home Elevators, we design and install home lifts that combine safety engineering, elegant cabin design, and dependable after-sales service, backed by over 10 years of experience and 500+ installations across India and abroad.";

const whyHyderabadIntro =
  "Hyderabad's rapid growth in independent villas and G+2/G+3 duplex homes (especially in Gachibowli, Kondapur, Kompally, and Manikonda) has driven demand for home lifts. They reduce daily stair strain for elderly parents and children, and increase property resale value by making homes accessible-ready.";

const whyHyderabadDetails =
  "Multi-storey independent houses are now common across Hyderabad's outer suburbs and gated communities. As families build larger homes with 2-3 floors, climbing stairs daily becomes a real physical burden — especially for senior citizens, pregnant women, young children, and anyone recovering from injury or surgery. A professionally installed home lift solves this directly and signals a premium, accessibility-conscious home to future buyers.";

const addedBenefitsIntro =
  "The main benefits are effortless mobility for elderly and mobility-challenged family members, higher property resale value, space-saving compact design (as small as 4x4 ft shaft), energy-efficient operation, and advanced safety features like automatic rescue devices and battery backup.";

const addedBenefitsList = [
  "Effortless mobility — no stair strain for seniors, kids, or anyone with limited mobility",
  "Higher property value — accessibility features attract premium buyers and tenants",
  "Space-saving design — MRL and vacuum lifts need minimal shaft/pit space, ideal for retrofits",
  "Advanced safety — automatic rescue device (ARD), overload sensors, emergency alarm, door interlocks, battery backup",
  "Low running cost — comparable power draw to a couple of ceiling fans running continuously",
  "Custom design — cabin finish, lighting, and control panel matched to your interiors",
];

const addedTypesIntro =
  "KAS offers four main home lift types in Hyderabad — Hydraulic, MRL (Machine Room-Less), Gearless, and Vacuum/Pneumatic lifts. Hydraulic suits villas and low-rise homes; MRL and vacuum lifts suit space-constrained retrofits; gearless suits premium homes wanting the quietest ride.";

const vacuumLiftType = {
  title: "Vacuum / Pneumatic Home Lifts",
  content:
    "For homes that can't accommodate a pit or shaft at all, pneumatic vacuum lifts are an alternative — no pit, no separate machine room, single-phase power, ideal for retrofitting existing bungalows.",
};

const vacuumComparisonRow = {
  type: "Vacuum/Pneumatic",
  bestFor: "Existing homes, no shaft space",
  space: "Very Compact",
  maintenance: "Low",
  noise: "Low",
};

const detailedLiftComparison = [
  {
    type: "Hydraulic",
    bestFor: "Villas, low-rise homes",
    space: "Moderate",
    pit: "Yes (shallow)",
    maintenance: "Low",
    noise: "Low",
  },
  {
    type: "MRL",
    bestFor: "Space-constrained homes",
    space: "Compact",
    pit: "Minimal",
    maintenance: "Low",
    noise: "Very Low",
  },
  {
    type: "Gearless",
    bestFor: "Luxury/premium homes",
    space: "Moderate",
    pit: "Yes",
    maintenance: "Very Low",
    noise: "Minimal",
  },
  {
    type: "Vacuum/Pneumatic",
    bestFor: "Existing homes, no shaft space",
    space: "Very Compact",
    pit: "No pit needed",
    maintenance: "Low",
    noise: "Low",
  },
];

const costIntro =
  "A home lift in Hyderabad typically costs ₹4.5 lakh to ₹7 lakh for a compact 2-floor hydraulic or MRL lift, ₹7-10 lakh for a 3-floor villa lift, and ₹10 lakh+ for premium gearless or fully customized cabins. Final pricing depends on floors, capacity, cabin finish, and site conditions.";

const costDetails =
  "Home lift pricing is one of the most searched questions among Hyderabad homeowners, and rightly so — it's a significant decision. Here's a realistic price guide based on our installation experience:";

const costTable = [
  {
    configuration: "2-floor compact hydraulic/MRL lift",
    price: "₹4.5 lakh – ₹6.5 lakh",
  },
  {
    configuration: "3-floor villa hydraulic/MRL lift",
    price: "₹6.5 lakh – ₹9 lakh",
  },
  {
    configuration: "Vacuum/pneumatic lift (2-person)",
    price: "₹8 lakh – ₹12 lakh",
  },
  {
    configuration: "Premium gearless / customized cabin",
    price: "₹10 lakh – ₹15 lakh+",
  },
];

const costFactorsIntro = "What affects the final price:";

const costFactors = [
  "Number of floors and total travel height",
  "Cabin capacity (2, 4, or 6-person) and interior finish (steel, glass, wood-panel)",
  "Whether the shaft is newly constructed or retrofitted into an existing void",
  "Site accessibility and civil work required",
  "Additional features — automatic doors, smart controls, decorative lighting",
];

const costNote =
  "These are indicative ranges — final cost is confirmed after a free site inspection, since structural conditions vary from home to home.";

const processIntro =
  "KAS installs a home lift in Hyderabad in five stages — site inspection, design & quotation, civil preparation, installation, and testing/handover. Most residential installations are completed within 3-6 weeks after final design approval, depending on lift type and site readiness.";

const processSteps = [
  "Free Site Inspection — our engineer visits your property to assess available space, floor height, and structural feasibility.",
  "Design & Quotation — based on the inspection, we recommend the right lift type and share a detailed quotation with cabin and finish options.",
  "Civil Preparation — minimal shaft/pit work is done (if required), coordinated closely with your contractor if the home is under construction.",
  "Installation — our technical team installs the lift system, wiring, doors, and safety systems as per standard protocols.",
  "Testing & Handover — every lift undergoes load testing, safety checks, and a final walkthrough before handover, along with AMC and warranty documentation.",
];

const processTimeline =
  "Typical timeline: 3-4 weeks for compact MRL/vacuum lifts in existing homes; 5-6 weeks for villa hydraulic lifts requiring civil work — subject to site readiness and material availability.";

const safetyIntro =
  "Every KAS home lift includes an automatic rescue device (ARD) for power cuts, overload sensors, door interlocks, emergency alarm, and manual lowering in emergencies — engineered to keep every family member, including children and seniors, safe.";

const safetyFeatures = [
  "Automatic Rescue Device (ARD) — brings the cabin safely to the nearest floor during a power outage",
  "Door safety sensors and interlocks",
  "Overload protection and emergency stop button",
  "Emergency alarm with two-way communication (on select models)",
  "Battery backup for uninterrupted operation during power fluctuations",
];

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
  "KAS Home Elevators installs and services home lifts across Hyderabad, including Banjara Hills, Jubilee Hills, Gachibowli, Madhapur, Kondapur, Kukatpally, Miyapur, HITEC City, Kompally, Manikonda, Tellapur, Shamshabad, Secunderabad, Uppal, and LB Nagar.";

const serviceAreasDetails =
  "We serve villa communities and independent house owners across all major residential zones of Hyderabad — from the established neighborhoods of Banjara Hills and Jubilee Hills to the fast-growing western corridor of Gachibowli, Kondapur, Kokapet, Tellapur, and Miyapur, as well as Kompally and Secunderabad on the north side. Wherever your home is in Hyderabad, our site-inspection team can visit within a few days of enquiry.";

const whyChooseKasIntro =
  "KAS Home Elevators brings 10+ years of experience, 500+ completed installations, and operations across 4 countries (India, UAE, Malaysia). We offer end-to-end service — free site inspection, customized design, professional installation, and ongoing AMC support.";

const whyChooseKasPoints = [
  "10+ years of dedicated home and residential elevator experience",
  "500+ installations completed across villas, duplexes, and independent houses",
  "Multi-country presence — offices in Hyderabad, Abu Dhabi, Kuala Lumpur, and Lucknow",
  "End-to-end service — from free site inspection to installation, testing, and after-sales AMC",
  "Trained technical team handling every stage in-house, not outsourced sub-contracting",
];

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
  vacuumLiftType,
];

const liftComparison = [
  {
    type: "Hydraulic",
    bestFor: "Villas, low-rise homes",
    space: "Moderate",
    maintenance: "Low",
    noise: "Low",
  },
  {
    type: "MRL (Machine Room-Less)",
    bestFor: "Space-constrained homes",
    space: "Compact",
    maintenance: "Low",
    noise: "Very Low",
  },
  {
    type: "Gearless",
    bestFor: "Luxury / premium homes",
    space: "Moderate",
    maintenance: "Very Low",
    noise: "Minimal",
  },
  vacuumComparisonRow,
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
      "A home lift in Hyderabad typically costs between ₹4.5 lakh and ₹7 lakh for a compact 2-floor hydraulic or MRL lift, and can go up to ₹15 lakh+ for premium villa or gearless configurations. Book a free site inspection for an accurate quote.",
  },
  {
    question: "Which type of home lift is best for residential properties?",
    answer:
      "The best home lift depends on your home's layout and available space. Hydraulic, Machine Room-Less (MRL), and gearless home lifts are among the most popular choices for villas, duplex homes, and independent houses. Our experts help you select the most suitable option after a detailed site assessment.",
  },
  {
    question: "Which type of home lift is best for a villa in Hyderabad?",
    answer:
      "Hydraulic and MRL lifts are the most popular for Hyderabad villas due to their reliability and moderate space requirement. For homes without shaft space, vacuum/pneumatic lifts are a strong retrofit option.",
  },
  {
    question: "Can a home lift be installed in an existing house?",
    answer:
      "Yes. Modern home lifts can be installed in both new and existing homes. MRL and vacuum lifts are designed for retrofitting into existing homes with minimal structural changes — often no separate machine room or deep pit is needed.",
  },
  {
    question: "How long does home lift installation take?",
    answer:
      "Most installations take 3-6 weeks from design approval to handover, depending on lift type and whether civil/shaft work is required. Once the design and technical requirements are finalized, most residential home lift installations are completed within a few weeks.",
  },
  {
    question: "Are home lifts safe for children and senior citizens?",
    answer:
      "Absolutely. Our home lifts are equipped with advanced safety features such as emergency battery backup, automatic rescue devices, door safety sensors, overload protection, and emergency alarms, making them safe for every member of the family.",
  },
  {
    question: "Do home lifts require regular maintenance?",
    answer:
      "Yes. Routine servicing (recommended quarterly) keeps the lift safe and reliable. Kashome Elevators provides AMC (Annual Maintenance Contract) plans and after-sales support to keep your lift operating efficiently.",
  },
  {
    question: "How much space is required for a home lift?",
    answer:
      "Most compact home lifts need a shaft space of approximately 4x4 feet to 5x5 feet, depending on the model and cabin size. Vacuum lifts need no pit at all, making them suitable for very tight spaces.",
  },
  {
    question: "Do home lifts need a lot of electricity?",
    answer:
      "No. Modern hydraulic and MRL home lifts are energy-efficient and typically consume power comparable to a couple of household appliances running continuously.",
  },
  {
    question: "Which areas in Hyderabad does KAS Home Elevators serve?",
    answer:
      "We serve all major residential zones including Banjara Hills, Jubilee Hills, Gachibowli, Kondapur, Madhapur, Kompally, Manikonda, Tellapur, Miyapur, and Secunderabad.",
  },
  {
    question: "Why choose Kashome Elevators for a home lift in Hyderabad?",
    answer:
      "KAS combines 10+ years of experience, 500+ completed installations, in-house technical teams, and multi-country operations, with transparent pricing and dedicated after-sales AMC support. Our commitment to quality and customer satisfaction makes us a trusted choice for homeowners across Hyderabad.",
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
  name: "KAS Home Elevators",
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

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  url: pageUrl,
  name: "Home Lift in Hyderabad",
  description:
    "India's trusted home lift experts in Hyderabad. Premium, safe, space-saving lifts for villas & duplexes. Free expert site visit — book today!",
  isPartOf: {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: "Kashome Elevators",
  },
  breadcrumb: {
    "@id": `${pageUrl}#breadcrumb`,
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
        <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_45%)]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 lg:mb-10 max-w-4xl">
              Home Lift in Hyderabad – Safe, Space-Saving Lifts for Villas &amp; Duplex Homes
            </h1>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-5 text-lg sm:text-xl text-slate-100 leading-relaxed">
                <p className="text-slate-200 font-medium">
                  A home lift is a compact, low-power lift installed inside a house to move safely between floors — commonly used in villas, duplex homes, and multi-storey independent houses.
                </p>
                <p>
                  {linkSeoKeywords("A modern home lift in Hyderabad is no longer considered a luxury—it's a smart investment that adds comfort, convenience, and long-term value to your home. Whether you're building a new villa, renovating an existing house, or looking for an easier way to move between floors, a well-designed home lift can transform your daily living experience. It offers safe and effortless mobility for every family member, especially senior citizens, children, and individuals with limited mobility.", seoLinkClassHero)}
                </p>
                <p>
                  {linkSeoKeywords("At Kashome Elevators, we provide premium home lift solutions and home elevators in Hyderabad that combine advanced technology, elegant design, and reliable performance. Every lift is carefully designed to suit your home's layout while maintaining the highest standards of safety and quality. From compact residential lifts to customized solutions for luxury villas, we ensure every installation blends seamlessly with your interiors and lifestyle.", seoLinkClassHero)}
                </p>
                {addedHeroParagraphs.map((paragraph) => (
                  <p key={paragraph}>
                    {linkSeoKeywords(paragraph, seoLinkClassHero)}
                  </p>
                ))}

                <div className="!mt-8 grid grid-cols-3 gap-4 max-w-md">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">10+</div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">Years of Expertise</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">500+</div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">Installations Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">4</div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">Countries Served</div>
                  </div>
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

            <div className="mt-10 pt-10 border-t border-slate-700/60 space-y-5 text-lg sm:text-xl text-slate-100 leading-relaxed">
              <p>
                {linkSeoKeywords("As a trusted provider of home lift installation in Hyderabad, our experienced team manages everything from site inspection and planning to installation and after-sales support. We focus on delivering personalized solutions that meet your specific requirements without compromising on safety, efficiency, or aesthetics.", seoLinkClassHero)}
              </p>
              <p>
                {linkSeoKeywords("If you're searching for a dependable home lift in Hyderabad, Kashome Elevators is your trusted partner. Our commitment to quality craftsmanship, innovative engineering, and customer satisfaction has made us a preferred choice for homeowners seeking stylish, durable, and energy-efficient home lift solutions across Hyderabad.", seoLinkClassHero)}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              What Is a Home Lift?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{linkSeoKeywords(whatIsHomeLiftIntro)}</p>
              <p>{linkSeoKeywords(whatIsHomeLiftDetails)}</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Hyderabad Homeowners Are Choosing Home Lifts
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{linkSeoKeywords(whyHyderabadIntro)}</p>
              <p>{linkSeoKeywords(whyHyderabadDetails)}</p>
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
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(addedBenefitsIntro)}
            </p>
            <ul className="space-y-3 list-disc pl-6 mb-8 text-gray-700 leading-relaxed">
              {addedBenefitsList.map((item) => (
                <li key={item}>{linkSeoKeywords(item)}</li>
              ))}
            </ul>
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
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(addedTypesIntro)}
            </p>
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

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Hydraulic vs MRL vs Gearless: Quick Comparison
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Type
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Best For
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Space Needed
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Maintenance
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Noise Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {liftComparison.map((row, index) => (
                    <tr
                      key={row.type}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.bestFor}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.space}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.maintenance}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.noise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Hydraulic vs MRL vs Gearless vs Vacuum: Detailed Comparison
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Type
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Best For
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Space Needed
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Pit/Shaft Required
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Maintenance
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Noise Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailedLiftComparison.map((row, index) => (
                    <tr
                      key={row.type}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                        {row.type}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.bestFor}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.space}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.pit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.maintenance}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.noise}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Home Lift Cost in Hyderabad
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
              <p>{linkSeoKeywords(costIntro)}</p>
              <p>{linkSeoKeywords(costDetails)}</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {costFactorsIntro}
            </h3>
            <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-relaxed mb-6">
              {costFactors.map((factor) => (
                <li key={factor}>{linkSeoKeywords(factor)}</li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed">{linkSeoKeywords(costNote)}</p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Home Lift Installation Process &amp; Timeline
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(processIntro)}
            </p>
            <ol className="space-y-4 list-decimal pl-6 text-gray-700 leading-relaxed mb-8">
              {processSteps.map((step) => (
                <li key={step}>{linkSeoKeywords(step)}</li>
              ))}
            </ol>
            <p className="text-gray-700 leading-relaxed">
              {linkSeoKeywords(processTimeline)}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Safety Features &amp; Technology
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(safetyIntro)}
            </p>
            <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-relaxed">
              {safetyFeatures.map((item) => (
                <li key={item}>{linkSeoKeywords(item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-8 sm:p-10 shadow-sm">
              <div className="max-w-3xl mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Areas We Serve in Hyderabad
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>{linkSeoKeywords(serviceAreasIntro)}</p>
                  <p>{linkSeoKeywords(serviceAreasDetails)}</p>
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

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose KAS Home Elevators
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(whyChooseKasIntro)}
            </p>
            <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-relaxed">
              {whyChooseKasPoints.map((item) => (
                <li key={item}>{linkSeoKeywords(item)}</li>
              ))}
            </ul>
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
              Planning a home lift for your villa, duplex, or independent house in Hyderabad? Book a free
              site inspection with KAS Home Elevators and get a personalized quotation based on your
              home&apos;s exact layout and budget.
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
