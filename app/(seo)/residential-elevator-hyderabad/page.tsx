import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";
import residentialLiftImage from "../../../public/residential-lift-hyderabad.webp";

const currentPageHref = "/residential-elevator-hyderabad";
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
    { phrase: "villa residential elevators", href: "/villa-elevator-hyderabad" },
    { phrase: "home elevators in Hyderabad", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevator in Hyderabad", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevators", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevator", href: "/home-elevator-in-hyderabad" },
    { phrase: "customized home elevators", href: "/home-elevator-in-hyderabad" },
    { phrase: "villa elevators", href: "/villa-elevator-hyderabad" },
    { phrase: "villa elevator", href: "/villa-elevator-hyderabad" },
    { phrase: "home lifts in Hyderabad", href: "/home-lift-in-hyderabad" },
    { phrase: "home lift in Hyderabad", href: "/home-lift-in-hyderabad" },
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
    {
      phrase: "elevator installation in Hyderabad",
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

const pageUrl = "https://www.kashomeelevators.com/residential-elevator-in-hyderabad";
const siteUrl = "https://www.kashomeelevators.com/";
const imageFileName = "residential-lift-hyderabad.webp";
const imagePath = residentialLiftImage;
const imageUrl = `https://www.kashomeelevators.com/${imageFileName}`;
const imageAlt = "Residential Elevator in Hyderabad";

const businessPhone = "+91-8019219911";
const businessPhoneTel = "tel:+918019219911";
const businessEmail = "assist@kashomeelevators.com";

const ctaButtons = [
  { href: "/contact", label: "Get Free Quote" },
  { href: "/contact", label: "Book Free Site Inspection" },
  { href: "/contact", label: "Contact Our Experts" },
  { href: "/contact", label: "Request a Callback" },
  { href: businessPhoneTel, label: "Call Now" },
];

const quickFacts = [
  { label: "Service", value: "Residential Elevator Installation" },
  { label: "Service Area", value: "Hyderabad, Telangana" },
  { label: "Elevator Types", value: "Hydraulic, MRL, Gearless, Villa, Compact, Smart" },
  { label: "Key Safety Feature", value: "Automatic Rescue Device (ARD) & Battery Backup" },
];

const tocSections = [
  { id: "what-is", label: "What Is It" },
  { id: "why-hyderabad", label: "Why Hyderabad" },
  { id: "why-choose", label: "Why Choose One" },
  { id: "benefits", label: "Benefits" },
  { id: "features", label: "Features" },
  { id: "types", label: "Types" },
  { id: "cost", label: "Cost" },
  { id: "installation", label: "Installation Process" },
  { id: "safety", label: "Safety Features" },
  { id: "solutions", label: "Solutions" },
  { id: "areas", label: "Areas We Serve" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
];

const pageTitle =
  "Residential Elevator in Hyderabad – Premium & Safe | KAS";
const pageDescription =
  "Residential elevator in Hyderabad starting ₹5 lakh. Hydraulic, MRL & gearless lifts for villas & duplexes. IS 14665 compliant. Get a free quote.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: pageTitle,
  description: pageDescription,

  alternates: {
    canonical: pageUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Kashome Elevators",
    locale: "en_IN",
    type: "website",
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
    title: pageTitle,
    description: pageDescription,
    images: [imageUrl],
  },
};

const trustStats = [
  { value: "10+", label: "Years of Expertise" },
  { value: "500+", label: "Installations Completed" },
  { value: "4", label: "Countries Served" },
];

const addedHeroParagraphs = [
  "A residential elevator in Hyderabad is a home lift installed in villas, duplex homes, and independent houses for safe, effortless floor-to-floor movement. KAS Home Elevators designs, installs, and maintains custom residential elevators across Hyderabad with advanced safety systems like Automatic Rescue Device (ARD) and battery backup, serving villas, duplexes, and independent homes with hydraulic, MRL, gearless, and smart options.",
  "Finding the right residential elevator in Hyderabad means combining comfort, safety, and modern living in one solution. At KAS Home Elevators, we specialize in premium residential elevator solutions across Hyderabad, engineered with advanced technology, premium materials, and international safety standards for smooth, quiet, long-term performance.",
  "As a trusted residential elevator company in Hyderabad, we offer complete end-to-end service — site inspection, design, manufacturing, installation, testing, and after-sales maintenance — backed by 10+ years of experience and 500+ completed installations.",
];

const whatIsResidentialElevatorIntro =
  "A residential elevator is a compact home lift built specifically for villas, duplex homes, and independent houses — unlike commercial elevators, it needs less shaft space, runs on lower power, and is designed for daily family use with advanced safety systems like ARD and battery backup.";

const whyHyderabadIntro =
  "With duplex homes and villas growing rapidly across Gachibowli, Kondapur, Kompally, and Manikonda, Hyderabad homeowners are installing residential elevators to reduce stair strain for elderly parents and children, and to boost resale value with an accessibility-ready home.";

const whyHyderabadDetails =
  "Climbing stairs daily can be genuinely difficult for senior citizens, young children, pregnant women, and anyone with mobility limitations. A residential elevator removes that difficulty completely, giving every family member safe, independent movement between floors — while also making the home more attractive to future buyers who value modern, accessible living.";

const addedBenefitsIntro =
  "Key benefits include barrier-free accessibility for every family member, higher resale value, everyday convenience for moving groceries or luggage between floors, energy-efficient low-maintenance operation, and advanced safety systems that give complete peace of mind.";

const addedBenefitsList = [
  "Enhanced accessibility — safe movement for seniors, children, and mobility-challenged family members",
  "Increased property value — a strong feature for future resale in Hyderabad's premium housing market",
  "Everyday convenience — effortless movement of groceries, luggage, and furniture between floors",
  "Advanced safety — ARD, battery backup, door interlocks, overload protection, emergency alarms",
  "Elegant design — premium cabin finishes, modern lighting, and stylish control panels",
  "Energy-efficient and low-maintenance — reduced long-term operating costs",
];

const addedTypesIntro =
  "KAS Home Elevators offers Hydraulic, MRL, Gearless, Villa, Compact, Customized, and Smart residential elevators — Hydraulic and MRL suit most villas and duplex homes, Gearless suits luxury properties, and Compact/Smart options suit space-constrained or tech-forward homes.";

const costIntro =
  "A residential elevator in Hyderabad typically costs ₹5 lakh to ₹8 lakh for a compact 2-floor hydraulic or MRL elevator, ₹8-11 lakh for a 3-floor villa elevator, and ₹12 lakh+ for premium gearless or fully customized cabins. Final pricing depends on floors, capacity, and finish.";

const costTable = [
  {
    configuration: "2-floor compact hydraulic/MRL elevator",
    price: "₹5 lakh – ₹7 lakh",
  },
  {
    configuration: "3-floor villa hydraulic/MRL elevator",
    price: "₹7 lakh – ₹10 lakh",
  },
  {
    configuration: "Gearless elevator (premium villa)",
    price: "₹10 lakh – ₹14 lakh",
  },
  {
    configuration: "Fully customized cabin / smart elevator",
    price: "₹12 lakh – ₹16 lakh+",
  },
];

const addedInstallationIntro =
  "KAS follows a 7-stage residential elevator installation process — site inspection, design, engineering, installation, testing, handover, and after-sales maintenance. Most installations are completed within 4-7 weeks after design approval, depending on elevator type and civil work required.";

const installationProcessSteps = [
  {
    title: "Free Site Inspection & Requirement Analysis",
    content: "assessing space, structure, floors, and mobility needs.",
  },
  {
    title: "Customized Design & Planning",
    content:
      "cabin style, door type, finishes, control panel, and safety features.",
  },
  {
    title: "Professional Engineering & Manufacturing",
    content: "premium materials and strict quality control.",
  },
  {
    title: "Expert Installation",
    content:
      "certified technicians install with minimal disruption to your routine.",
  },
  {
    title: "Safety Testing & Quality Inspection",
    content:
      "ARD, door interlocks, overload protection, and ride quality checked.",
  },
  {
    title: "Final Handover & User Training",
    content: "full demonstration of operation and emergency procedures.",
  },
  {
    title: "After-Sales Service & Preventive Maintenance",
    content: "periodic inspections and technical support.",
  },
];

const installationTimeline =
  "Typical timeline: 4-5 weeks for compact MRL elevators in existing homes; 6-7 weeks for villa or gearless elevators requiring civil work.";

const addedSafetyIntro =
  "Every KAS residential elevator includes an Automatic Rescue Device (ARD), emergency battery backup, door interlock systems, overload protection, emergency alarms, and smooth start-stop technology — engineered for the safety of children, seniors, and every family member.";

const addedSafetyList = [
  "Automatic Rescue Device (ARD) — moves the cabin to the nearest floor safely during a power failure",
  "Emergency battery backup for uninterrupted operation",
  "Door interlock system and overload protection",
  "Emergency alarm and communication system",
  "Smooth start and soft stop technology, anti-skid flooring, LED cabin lighting",
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
  "KAS Home Elevators installs and services residential elevators across Hyderabad, including Banjara Hills, Jubilee Hills, Gachibowli, Madhapur, Kondapur, Kukatpally, Miyapur, HITEC City, Kompally, Manikonda, Tellapur, Shamshabad, Secunderabad, Uppal, and LB Nagar.";

const serviceAreasDetails =
  "We serve villa communities and independent homeowners across all major residential zones of Hyderabad — from established neighborhoods like Banjara Hills and Jubilee Hills, to the fast-growing western corridor of Gachibowli, Kondapur, Kokapet, and Tellapur, as well as Kompally and Secunderabad. Our site-inspection team can visit anywhere in Hyderabad within a few days of enquiry.";

const ctaQuoteIntro =
  "Planning a residential elevator for your villa, duplex, or independent house in Hyderabad? Book a free site inspection with KAS Home Elevators and get a personalized quotation based on your home's exact layout and budget.";

const heroParagraphs = [
  "Finding the right residential elevator in Hyderabad is essential for homeowners who want to combine comfort, safety, and modern living in one solution. As multi-storey homes, duplex residences, villa elevators, and independent houses continue to grow across Hyderabad, residential elevators have become an important part of contemporary home design. They provide effortless floor-to-floor mobility while enhancing accessibility, improving convenience, and increasing the overall value of your property.",
  "At Kashome Elevators, we specialize in delivering premium residential elevator solutions in Hyderabad, along with home elevators and home lifts in Hyderabad, designed to match your home's architecture and your family's daily lifestyle. Every elevator is engineered using advanced technology, premium materials, and international safety standards to ensure smooth operation, quiet performance, and long-term reliability. Whether you're planning a new construction project or upgrading an existing home, our customized elevator solutions are designed to fit seamlessly into your available space.",
  "A professionally installed residential elevator in Hyderabad does much more than simplify movement between floors. It creates a safer environment for senior citizens, children, and family members with mobility challenges while adding a touch of luxury and sophistication to your home. With elegant cabin designs, energy-efficient systems, and intelligent safety features, modern residential elevators provide the perfect balance of functionality and aesthetics.",
  "As a trusted residential elevator company in Hyderabad, Kashome Elevators offers complete end-to-end services, including site inspection, elevator design, manufacturing, professional installation, testing, and reliable after-sales maintenance. Our experienced engineers carefully assess every project to recommend the most suitable elevator solution based on your home's layout, number of floors, available space, and future requirements.",
  "We understand that every homeowner has unique expectations. That's why our residential elevator installation in Hyderabad is fully customized to suit different property types, including villas, duplex homes, bungalows, premium apartments, and independent residences. From compact elevators for limited spaces to luxurious cabin designs with advanced automation, we provide solutions that enhance both convenience and property value.",
  "If you're searching for a reliable residential elevator in Hyderabad, Kashome Elevators is committed to delivering exceptional quality, advanced safety, and outstanding customer support. Our goal is to help homeowners enjoy effortless mobility, improved accessibility, and long-lasting performance through innovative residential elevator systems that are built for today's modern lifestyle.",
];

const whyChooseParagraphs = [
  "Choosing a residential elevator in Hyderabad is no longer just about adding luxury to your home—it's about creating a safer, more comfortable, and future-ready living environment. With the rapid growth of duplex homes, villas, and multi-storey residences across Hyderabad, homeowners are looking for smart mobility solutions that make everyday life easier while enhancing the value of their property.",
  "One of the biggest advantages of installing a residential elevator in Hyderabad is improved accessibility. Climbing stairs every day can become challenging for senior citizens, young children, pregnant women, and individuals with mobility limitations. A residential elevator eliminates this difficulty by providing smooth, safe, and effortless movement between floors, allowing every family member to enjoy complete independence within the home.",
  "Modern homeowners also choose residential elevator installation in Hyderabad because it significantly increases property value. A well-designed elevator not only improves functionality but also adds a premium touch to your home. Whether you're planning to live in the property for years or considering future resale, a residential elevator makes your home more attractive to potential buyers.",
  "Another reason to invest in a residential elevator is the flexibility it offers. Today's elevator systems are compact, energy-efficient, and fully customizable. From elegant cabin interiors and automatic doors to smart control panels and premium finishes, every detail can be tailored to match your home's architecture and personal preferences. Whether you own a luxury villa, an independent house, or a duplex residence, there is a solution designed specifically for your space.",
  "Safety is another key factor that makes homeowners choose Kashome Elevators. Every residential elevator in Hyderabad is equipped with advanced safety features, including emergency battery backup, automatic rescue operation, door interlock systems, overload protection, emergency alarms, and smooth start-and-stop technology. These features ensure reliable performance and provide complete peace of mind for your family every day.",
  "At Kashome Elevators, we understand that every home is unique. Our experienced team provides personalized consultation, detailed site inspection, customized design, professional installation, and dependable after-sales support. We use high-quality components and modern engineering practices to deliver durable elevator systems that require minimal maintenance while offering years of reliable service.",
  "If you're looking for a long-term investment that improves accessibility, enhances comfort, and increases your property's value, choosing a residential elevator in Hyderabad is the right decision. Kashome Elevators is committed to delivering innovative, safe, and customized residential elevator solutions that perfectly suit your lifestyle and transform the way you experience your home.",
];

const benefitsIntro =
  "Installing a residential elevator in Hyderabad is one of the smartest investments homeowners can make for long-term comfort, convenience, and property value. Whether you own a villa, duplex home, bungalow, or an independent house, a residential elevator transforms the way you move through your home while providing a perfect balance of functionality, safety, and modern living.";

const benefits = [
  {
    title: "Enhanced Accessibility",
    content: "Provides safe, barrier-free, independent floor-to-floor movement for seniors, children, and individuals with limited mobility.",
  },
  {
    title: "Increased Property Value",
    content: "Makes your duplex or villa highly attractive to premium homebuyers, boosting long-term resale value in Hyderabad.",
  },
  {
    title: "Superior Comfort and Convenience",
    content: "Allows effortless transportation of heavy household items, luggage, laundry, and daily groceries between floors.",
  },
  {
    title: "Advanced Safety Features",
    content: "Includes Automatic Rescue Device (ARD), emergency backup power, overload sensors, and door safety interlocks.",
  },
  {
    title: "Elegant Aesthetics",
    content: "Enhances your home's interior with custom cabin styles, premium glass designs, and modern lighting finishes.",
  },
  {
    title: "Energy-Efficient Performance",
    content: "Engineered to consume minimal electricity, reducing long-term operating costs and supporting sustainable living.",
  },
  {
    title: "Customized Integration",
    content: "Tailored layout sizing designed specifically to match your property's civil dimensions, pit depth, and headroom.",
  },
  {
    title: "Professional Support",
    content: "Backed by expert site inspection, professional installation, testing, and dedicated AMC maintenance services.",
  },
];

const benefitsClosing =
  "Investing in a residential elevator in Hyderabad is not just about convenience—it's about creating a safer, smarter, and more comfortable home for years to come. With customized designs, advanced technology, and trusted installation services, Kashome Elevators helps homeowners enjoy effortless mobility while adding lasting value to their property.";

const featuresIntro =
  "At Kashome Elevators, we provide premium residential elevators in Hyderabad that combine innovation, safety, and elegant design. Every elevator is engineered to deliver smooth performance, long-lasting reliability, and maximum comfort for modern homes. Whether you own a duplex house, independent home, bungalow, or luxury villa, our residential elevator solutions are designed to improve accessibility while enhancing the beauty and value of your property. Using advanced technology and premium-quality components, we ensure every elevator meets the highest standards of performance, efficiency, and safety.";

const features = [
  {
    title: "Advanced Safety",
    content:
      "Equipped with emergency battery backup, automatic rescue devices (ARD), door safety interlocks, and overload sensors to ensure passenger safety.",
  },
  {
    title: "Smart Control System",
    content:
      "Features intuitive touch panels, digital floor indicators, automatic door controls, and smart home automation compatibility.",
  },
  {
    title: "Durable/Low Maintenance",
    content:
      "Manufactured with premium engineering materials and robust components to ensure long-term durability with minimal servicing.",
  },
  {
    title: "Elegant Designs",
    content:
      "Offers customizable interior finishes, glass panels, modern LED lighting, and premium fixtures that complement your home's design.",
  },
];

const featuresClosing =
  "Choosing Kashome Elevators means investing in a high-quality residential elevator that delivers exceptional safety, superior comfort, elegant design, and dependable performance. Our customized solutions help homeowners enjoy effortless mobility while adding long-term value and convenience to their homes.";

const elevatorTypesIntro =
  "Choosing the right residential elevator in Hyderabad depends on your home's layout, available space, budget, design preferences, and daily usage requirements. Every home is unique, which is why Kashome Elevators offers a wide range of customized residential elevator solutions to suit modern villas, duplex homes, independent houses, and multi-storey residential properties. Our expert team carefully evaluates your property and recommends an elevator that delivers the perfect balance of safety, performance, aesthetics, and long-term reliability. Whether you're planning a new construction project or upgrading an existing home, we provide premium residential elevator installation in Hyderabad using advanced technology and high-quality components. Explore the different types of residential elevators available for your home.";

const elevatorTypes = [
  {
    title: "Hydraulic Residential Elevators",
    content:
      "Reliable for low-rise homes and villas — smooth operation, strong lifting capacity, and low maintenance.",
  },
  {
    title: "Machine Room-Less (MRL) Residential Elevators",
    content:
      "No separate machine room needed — ideal for space-constrained duplex homes with energy-efficient, smooth performance.",
  },
  {
    title: "Gearless Residential Elevators",
    content:
      "Advanced traction technology for the quietest, most energy-efficient ride — preferred for luxury and premium residential projects.",
  },
  {
    title: "Villa, Compact, Customized & Smart Elevators",
    content:
      "Villa elevators bring premium cabin finishes for high-end architecture; Compact elevators fit limited spaces with minimal structural change; Customized solutions tailor every dimension and finish to your home; Smart elevators add digital displays, touch controls, and automatic rescue operation.",
  },
];

const elevatorTypesClosing =
  "Selecting the right residential elevator in Hyderabad is an important investment that enhances your home's accessibility, comfort, and long-term value. At Kashome Elevators, our experts help you choose the most suitable residential elevator based on your property's structure, daily usage, and future requirements, ensuring a solution that delivers outstanding performance, advanced safety, and complete peace of mind for years to come.";

const elevatorTypesComparison = [
  { type: "Hydraulic", bestFor: "Low-rise homes & villas", highlight: "High lifting capacity, low maintenance" },
  { type: "Machine Room-Less (MRL)", bestFor: "Space-constrained homes", highlight: "No separate machine room needed" },
  { type: "Gearless", bestFor: "Luxury & premium homes", highlight: "Quietest, most energy-efficient ride" },
  { type: "Villa Elevator", bestFor: "Independent villas", highlight: "Premium cabin finishes & design" },
  { type: "Compact", bestFor: "Limited installation space", highlight: "Minimal structural changes" },
  { type: "Customized", bestFor: "Unique home layouts", highlight: "Fully tailored to your home" },
  { type: "Smart Elevator", bestFor: "Tech-forward homes", highlight: "Automatic rescue, digital controls" },
];

const techSpecsTable = [
  {
    feature: "Drive Technology",
    hydraulic: "Hydraulic Pump & Cylinder",
    mrl: "MRL Traction (Gearless/Geared)",
    gearless: "Gearless Traction",
  },
  {
    feature: "Machine Room",
    hydraulic: "No separate room (small control cabinet)",
    mrl: "No machine room needed (motor in shaft)",
    gearless: "No machine room needed (motor in shaft)",
  },
  {
    feature: "Speed Range",
    hydraulic: "0.15 – 0.3 m/s",
    mrl: "0.30 – 0.40 m/s",
    gearless: "0.40 – 0.60 m/s",
  },
  {
    feature: "Max Travel Height",
    hydraulic: "Up to 3-4 Floors (G+3)",
    mrl: "Up to 5-6 Floors (G+5)",
    gearless: "Up to 8+ Floors (G+7)",
  },
  {
    feature: "Power Efficiency",
    hydraulic: "Moderate (active mostly on ascent)",
    mrl: "High (energy-efficient counterweights)",
    gearless: "Extremely High (energy-saving gearless motor)",
  },
  {
    feature: "Pit Depth Required",
    hydraulic: "75 – 150 mm (Low Pit)",
    mrl: "200 – 300 mm",
    gearless: "300 – 450 mm",
  },
  {
    feature: "Headroom Required",
    hydraulic: "2400 – 2600 mm",
    mrl: "2700 – 2800 mm",
    gearless: "2800 – 3000 mm",
  },
];

const solutionsIntro =
  "At Kashome Elevators, we provide premium residential elevator solutions in Hyderabad that are designed to meet the evolving needs of modern homeowners. Whether you're building a new home, renovating an existing property, or upgrading a luxury villa, our customized elevator solutions deliver the perfect combination of safety, comfort, innovation, and elegant design. Every residential elevator in Hyderabad is carefully planned and installed to complement your home's architecture while ensuring smooth and reliable performance for years. We understand that every home has different space requirements and design preferences. That's why our experienced team conducts a detailed site inspection before recommending the most suitable elevator solution. From compact elevators for space-constrained homes to home lifts for luxury residences, we provide personalized solutions that match your lifestyle, budget, and long-term mobility needs.";

const solutions = [
  {
    title: "Residential Elevators for Villas",
    content:
      "Luxury villas require premium mobility solutions that complement their sophisticated architecture. Our villa residential elevators feature elegant cabin designs, advanced safety systems, and smooth operation, enhancing both convenience and the overall value of your property.",
  },
  {
    title: "Residential Elevators for Duplex Homes",
    content:
      "Duplex homes are becoming increasingly popular in Hyderabad, making convenient vertical mobility essential. Our residential elevators for duplex homes provide safe and effortless access between floors while maintaining the aesthetics of your interior space.",
  },
  {
    title: "Residential Elevators for Independent Houses",
    content:
      "Independent homes often have unique layouts and space requirements. We offer fully customized residential elevator installation in Hyderabad that fits seamlessly into your home's structure with minimal modifications while ensuring maximum comfort and long-term reliability.",
  },
  {
    title: "Space-Saving Residential Elevators",
    content:
      "Limited space should never prevent you from enjoying the convenience of a home elevator. Our compact residential elevator solutions are specially designed for homes where installation space is restricted, delivering excellent performance without compromising safety or comfort.",
  },
  {
    title: "Customized Residential Elevator Solutions",
    content:
      "Every homeowner has different expectations, which is why we provide tailor-made residential elevator solutions. From cabin dimensions and premium interior finishes to automatic doors, intelligent control systems, and advanced safety features, every elevator is customized to perfectly match your home's architecture and your family's daily requirements.",
  },
  {
    title: "Energy-Efficient Residential Elevators",
    content:
      "Our modern residential elevators utilize advanced technology that reduces electricity consumption while delivering smooth, quiet, and reliable performance. These energy-efficient systems help homeowners lower operating costs while supporting environmentally responsible living.",
  },
  {
    title: "Professional Installation and Reliable Support",
    content:
      "Our commitment goes beyond supplying elevators. From consultation and design to residential elevator installation in Hyderabad, testing, commissioning, and preventive maintenance, our certified engineers manage every stage with precision. Our responsive after-sales support ensures your elevator continues to operate safely and efficiently for years.",
  },
];

const solutionsClosing =
  "Choosing Kashome Elevators means choosing a trusted partner for high-quality residential elevator solutions in Hyderabad. With innovative technology, customized designs, expert installation, and dependable customer support, we help homeowners create safer, smarter, and more accessible living spaces that deliver lasting value.";

const faqs = [
  {
    question: "What is the cost of a residential elevator in Hyderabad?",
    answer:
      "A residential elevator in Hyderabad typically costs between ₹5 lakh and ₹8 lakh for a compact 2-floor hydraulic or MRL elevator, going up to ₹16 lakh+ for premium gearless or fully customized configurations. Book a free site inspection for an exact quote.",
  },
  {
    question: "Which type of residential elevator is best for a villa?",
    answer:
      "Hydraulic and MRL elevators are the most popular for Hyderabad villas due to reliability and moderate space needs. Gearless elevators suit premium homes wanting the quietest ride.",
  },
  {
    question: "How long does residential elevator installation take?",
    answer:
      "Most installations take 4-7 weeks from design approval to handover, depending on elevator type and civil work required.",
  },
  {
    question: "Are residential elevators safe for children and senior citizens?",
    answer:
      "Yes. Every KAS residential elevator includes an Automatic Rescue Device, battery backup, door interlocks, overload protection, and emergency alarms.",
  },
  {
    question: "Can a residential elevator be installed in an existing home?",
    answer:
      "Yes. After a detailed site inspection, our engineers recommend a solution requiring minimal structural modification for existing homes.",
  },
  {
    question: "Do residential elevators require regular maintenance?",
    answer:
      "Yes, periodic maintenance ensures safety and reliability. KAS offers preventive maintenance and AMC plans.",
  },
  {
    question: "Are KAS residential elevators energy efficient?",
    answer:
      "Yes, our elevators use energy-efficient technology that reduces electricity consumption without compromising performance.",
  },
  {
    question: "Which areas in Hyderabad does KAS serve?",
    answer:
      "We serve all major residential zones including Banjara Hills, Jubilee Hills, Gachibowli, Kondapur, Madhapur, Kompally, Manikonda, Tellapur, Miyapur, and Secunderabad.",
  },
  {
    question: "How is KAS different from Elite Elevators or other import-based brands?",
    answer:
      "KAS is a Hyderabad-based team offering local response times, transparent pricing, and dependable AMC support, without the delays and costs associated with imported elevator systems.",
  },
  {
    question: "Why choose KAS Home Elevators for a residential elevator in Hyderabad?",
    answer:
      "KAS combines 10+ years of experience, 500+ completed installations, in-house engineers, transparent pricing, and dedicated after-sales AMC support.",
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
  telephone: businessPhone,
  email: businessEmail,
  priceRange: "₹₹₹",
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
  // TODO: Replace with your real, live profile URLs. Correct sameAs links are
  // one of the strongest entity/GEO signals for AI Overviews & knowledge panels.
  sameAs: [
    "https://www.google.com/maps/place/YOUR_GOOGLE_BUSINESS_PROFILE_ID",
    "https://www.facebook.com/YOUR_PAGE",
    "https://www.instagram.com/YOUR_PAGE",
    "https://www.justdial.com/YOUR_LISTING",
    "https://www.indiamart.com/YOUR_LISTING",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: businessPhone,
    email: businessEmail,
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: "English",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Residential Elevator in Hyderabad",
  serviceType: "Residential Elevator Installation",
  description:
    "Kashome Elevators provides premium residential elevator installation in Hyderabad for villas, duplex homes, independent houses, and residential buildings with advanced safety features and customized designs.",
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

const lastUpdatedDate = "2026-07-31";

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  url: pageUrl,
  name: "Residential Elevator in Hyderabad",
  description: pageDescription,
  datePublished: "2025-01-01",
  dateModified: lastUpdatedDate,
  inLanguage: "en-IN",
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
    cssSelector: ["h1", "#quick-answer"],
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
      name: "Residential Elevator in Hyderabad",
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
  name: "Residential Elevator Installation Process in Hyderabad",
  description: addedInstallationIntro,
  totalTime: "P5W",
  step: installationProcessSteps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.title,
    text: step.content,
  })),
};

function ListSection({
  id,
  title,
  intro,
  items,
  closing,
  bgWhite = false,
  linkSeoKeywords,
}: {
  id?: string;
  title: string;
  intro?: string;
  items: { title: string; content: string }[];
  closing?: string;
  bgWhite?: boolean;
  linkSeoKeywords: (text: string) => ReactNode;
}) {
  return (
    <section id={id} className={`py-16 scroll-mt-24 ${bgWhite ? "bg-white" : ""}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{title}</h2>
        {intro ? (
          <p className="text-gray-700 leading-relaxed mb-8">
            {linkSeoKeywords(intro)}
          </p>
        ) : null}
        <ul className="space-y-6 list-disc pl-6">
          {items.map((item) => (
            <li key={item.title} className="text-gray-700 leading-relaxed">
              <h3 className="text-gray-900 font-bold">{linkSeoKeywords(item.title)}</h3>
              <p className="mt-2">
                {linkSeoKeywords(item.content)}
              </p>
            </li>
          ))}
        </ul>
        {closing ? (
          <p className="text-gray-700 leading-relaxed mt-8">
            {linkSeoKeywords(closing)}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default function ResidentialElevatorHyderabadPage() {
  const linkSeoKeywords = createSeoLinker(currentPageHref);

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <main>
        <section className="relative pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_45%)]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pt-2 pb-0">
            <nav
              aria-label="Breadcrumb"
              className="mb-2 text-sm text-slate-300"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-white font-medium" aria-current="page">
                  Residential Elevator in Hyderabad
                </li>
              </ol>
            </nav>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 lg:mb-10 max-w-5xl leading-tight">
              Residential Elevator in Hyderabad – Premium, Safe &amp; Custom-Built for Villas, Duplexes &amp; Independent Homes
            </h1>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-slate-100 leading-relaxed">
                <p className="text-slate-200">
                  {linkSeoKeywords(addedHeroParagraphs[0], seoLinkClassHero)}
                </p>

                <nav aria-label="Table of contents" className="max-w-4xl">
                  <ul className="flex flex-wrap gap-2 text-sm">
                    {tocSections.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="inline-block rounded-full border border-slate-600/60 px-3 py-1.5 text-slate-200 hover:bg-slate-700/60 hover:text-white transition-colors"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="!mt-10 grid grid-cols-3 gap-4 max-w-md">
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
          </div>
        </section>

        <section id="what-is" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              What Is a Residential Elevator?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {linkSeoKeywords(whatIsResidentialElevatorIntro)}
            </p>
          </div>
        </section>

        <section id="why-hyderabad" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Hyderabad Homeowners Choose a Residential Elevator
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>{linkSeoKeywords(whyHyderabadIntro)}</p>
              <p>{linkSeoKeywords(whyHyderabadDetails)}</p>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Benefits of Installing a Residential Elevator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {linkSeoKeywords(addedBenefitsIntro)}
            </p>
            <ul className="space-y-4 list-disc pl-6 text-gray-700 leading-relaxed">
              {benefits.map((item) => (
                <li key={item.title}>
                  <strong className="text-gray-900">{item.title}</strong> &mdash; {linkSeoKeywords(item.content)}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ListSection
          id="features"
          title="Features of Our Residential Elevators"
          intro={featuresIntro}
          items={features}
          linkSeoKeywords={linkSeoKeywords}
        />

        <section id="types" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Types of Residential Elevators We Offer
            </h2>
            <p className="text-gray-700 leading-relaxed mb-10">
              {linkSeoKeywords(`${addedTypesIntro} ${elevatorTypesIntro}`)}
            </p>
            
            <ul className="space-y-8 list-disc pl-6 text-gray-700 leading-relaxed">
              {elevatorTypes.map((type) => (
                <li key={type.title} className="marker:text-gray-400">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 inline-block">
                    {linkSeoKeywords(type.title)}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {linkSeoKeywords(type.content)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pb-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Quick Comparison: Residential Elevator Types in Hyderabad
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-900">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Elevator Type</th>
                    <th className="px-4 py-3 font-semibold">Best For</th>
                    <th className="px-4 py-3 font-semibold">Key Highlight</th>
                  </tr>
                </thead>
                <tbody>
                  {elevatorTypesComparison.map((row, index) => (
                    <tr
                      key={row.type}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{row.type}</td>
                      <td className="px-4 py-3 text-gray-700">{row.bestFor}</td>
                      <td className="px-4 py-3 text-gray-700">{row.highlight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="compliance" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Telangana Lift Act &amp; IS 14665 Compliance
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Every residential elevator installed by KAS in Hyderabad strictly complies with the <strong>Telangana Lift Act</strong> and follows the design, safety, and maintenance guidelines of <strong>IS 14665</strong> (the Indian Standard for lift installation and safety).
              </p>
              <p>
                To ensure complete peace of mind, our team manages the entire regulatory documentation process on your behalf, including obtaining the <strong>Permit to Erect</strong> and the final <strong>License to Work</strong> from the Telangana State Electrical Inspectorate. We provide full compliance certificates and documentation details during your free site inspection.
              </p>
            </div>
          </div>
        </section>

        <section id="specs-table" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Technical Specifications (Hydraulic vs MRL vs Gearless)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Compare the key technical specifications of our hydraulic, machine room-less (MRL), and gearless residential elevator models to find the right drive system for your house.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Technical Spec
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Hydraulic Elevators
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      MRL Elevators
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Gearless Elevators
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {techSpecsTable.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.hydraulic}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.mrl}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.gearless}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="cost" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Residential Elevator Cost in Hyderabad
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
          </div>
        </section>

        <section id="installation" className="py-16 bg-white scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Installation Process &amp; Timeline
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(addedInstallationIntro)}
            </p>
            <ol className="list-decimal pl-6 space-y-6 text-gray-700 leading-relaxed">
              {installationProcessSteps.map((step) => (
                <li key={step.title}>
                  <strong className="text-gray-900">{step.title}</strong> &mdash; {linkSeoKeywords(step.content)}
                </li>
              ))}
            </ol>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(installationTimeline)}
            </p>
          </div>
        </section>

        <section id="safety" className="py-16 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Safety Features
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(addedSafetyIntro)}
            </p>
            <ul className="space-y-3 list-disc pl-6 text-gray-700 leading-relaxed">
              {addedSafetyList.map((item) => (
                <li key={item}>{linkSeoKeywords(item)}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="areas" className="py-16 scroll-mt-24">
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

        <section id="faqs" className="py-16 bg-white scroll-mt-24">
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
                  <p>
                    {linkSeoKeywords(item.answer)}
                  </p>
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
              {ctaButtons.map((cta) =>
                cta.href.startsWith("tel:") ? (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors"
                  >
                    {cta.label}
                  </a>
                ) : (
                  <Link
                    key={cta.label}
                    href={cta.href}
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-green-700 font-semibold hover:bg-green-50 transition-colors"
                  >
                    {cta.label}
                  </Link>
                ),
              )}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <Footer />
    </div>
  );
}
