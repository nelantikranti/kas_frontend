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

const homeLiftVsAlternativesIntro =
  "Homeowners comparing a home lift for a 2-floor house often weigh it against a traditional residential elevator or a stairlift. Each option solves a different problem — the right choice depends on space, budget, cabin privacy, and how many floors you need to serve.";

const homeLiftVsAlternatives = [
  {
    title: "Home Lift vs Traditional Elevator",
    content:
      "A traditional elevator usually needs a larger shaft, higher load capacity, and more civil work — better suited to multi-unit buildings. A home lift in Hyderabad is purpose-built for villas and duplexes: smaller shaft (often from 4x4 ft), lower power draw, faster small-home lift installation, and cabin finishes designed for residential interiors.",
  },
  {
    title: "Home Lift vs Stairlift",
    content:
      "A stairlift rides along the staircase and is typically cheaper, but it occupies stair space, has lower capacity, and offers less privacy. A home lift carries 2–4 people (or more, depending on model), keeps stairs clear, and adds stronger resale appeal — especially for multi-storey independent houses in Hyderabad.",
  },
  {
    title: "Vacuum Elevator vs Hydraulic Home Lift",
    content:
      "Vacuum/pneumatic lifts need no pit and suit tight retrofit spaces. Hydraulic home lifts remain the most requested option for villas and low-rise homes when a shallow pit/shaft is available — they handle higher loads comfortably and are cost-efficient for 2–3 floor installations. Your free site inspection confirms which option fits the structure.",
  },
];

const homeLiftVsTable = [
  {
    feature: "Best for",
    homeLift: "Villas, duplexes, G+2/G+3 homes",
    elevator: "Multi-unit / larger buildings",
    stairlift: "Single-user stair access",
  },
  {
    feature: "Space needed",
    homeLift: "Compact shaft (from ~4x4 ft)",
    elevator: "Larger shaft + machine space",
    stairlift: "Uses staircase rail space",
  },
  {
    feature: "Capacity",
    homeLift: "Typically 2–4 persons",
    elevator: "Higher commercial loads",
    stairlift: "Usually one seated user",
  },
  {
    feature: "Home lift price range",
    homeLift: "From ~₹4.5 lakh (indicative)",
    elevator: "Usually higher for residential retrofit",
    stairlift: "Often lower upfront cost",
  },
];

const localCaseIntro =
  "Across Hyderabad, homeowners choose home lifts when stair strain becomes a daily issue — especially in multi-storey villas and independent houses.";

const localCaseDetails =
  "Recent enquiries and installations commonly come from villa communities and G+2/G+3 homes in Kondapur, Manikonda, Jubilee Hills, Kompally, and Gachibowli, where families want safer access for elders and children without major lifestyle disruption. During consultation we can share locality-relevant project examples and arrange a site visit so you can see how a compact home lift fits a similar floor plan.";

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
    title: "Advanced Safety Technology",
    content:
      "Safety is one of the most important features of every home lift in Hyderabad we install. Our lifts are equipped with emergency battery backup, automatic rescue devices, overload protection, door safety sensors, emergency alarm systems, and user-friendly controls to ensure complete peace of mind.",
  },
  {
    title: "Premium Cabin Designs",
    content:
      "Every home has its own style, and your home lift should reflect that. We offer a wide range of customizable cabin interiors, elegant finishes, modern lighting, stylish control panels, and premium materials that enhance the overall appearance of your home.",
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
];

const liftTypesIntro =
  "Selecting the right home lift in Hyderabad depends on your home's structure, available space, lifestyle, and accessibility needs. At Kashome Elevators, we offer a wide range of home lift solutions designed to provide safe, smooth, and efficient vertical mobility. Whether you need a lift for a compact home or a luxury villa, our experts help you choose the perfect solution that combines performance, comfort, and style.";

const liftTypes = [
  {
    title: "Hydraulic Home Lifts",
    content:
      "Best suited for villas and low-rise homes (up to G+3). Hydraulic lifts run smoothly, handle higher loads comfortably, and are one of the most reliable, low-maintenance options for independent houses.",
  },
  {
    title: "MRL (Machine Room-Less) Home Lifts",
    content:
      "MRL lifts skip the separate machine room entirely, making them the go-to choice for homes with limited space. Compact, energy-efficient, and easier to retrofit into an existing staircase void.",
  },
  {
    title: "Gearless Home Lifts",
    content:
      "Gearless lifts use traction technology for an exceptionally smooth, near-silent ride. Best suited to premium villas where ride comfort and minimal maintenance matter most.",
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

const typesQuickAnswer =
  "Home lifts are classified by their drive systems: Hydraulic (smooth, budget-friendly), MRL Traction (energy-efficient, quiet), and Vacuum/Pneumatic (no pit, panoramic view). For Hyderabad homes, MRL and Hydraulic are the most popular choices due to villa structure compatibility.";

const liftTypesClosing =
  "Each home lift type fits specific structural and spatial needs. KAS Home Elevators offers custom assessments to help you select the ideal drive type based on your home’s architectural plan.";

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
    question: "Which type of home lift is best for a villa in Hyderabad?",
    answer:
      "Hydraulic and MRL lifts are the most popular for Hyderabad villas due to their reliability and moderate space requirement. For homes without shaft space, vacuum/pneumatic lifts are a strong retrofit option.",
  },
  {
    question:
      "Can a home lift be installed in an existing house without major construction?",
    answer:
      "Yes. MRL and vacuum lifts are designed for retrofitting into existing homes with minimal structural changes — often no separate machine room or deep pit is needed.",
  },
  {
    question: "How long does home lift installation take in Hyderabad?",
    answer:
      "Most installations take 3-6 weeks from design approval to handover, depending on lift type and whether civil/shaft work is required.",
  },
  {
    question: "Are home lifts safe for children and elderly family members?",
    answer:
      "Yes. All KAS home lifts include automatic rescue devices, door safety sensors, overload protection, and emergency alarms, making them safe for users of every age group.",
  },
  {
    question: "How much space is required for a home lift?",
    answer:
      "Most compact home lifts need a shaft of approximately 4x4 ft to 5x5 ft. Vacuum lifts need no pit at all, making them suitable for very tight spaces.",
  },
  {
    question: "Do home lifts need a lot of electricity?",
    answer:
      "No. Modern hydraulic and MRL home lifts are energy-efficient and typically consume power comparable to a couple of household appliances running continuously.",
  },
  {
    question: "Does a home lift require regular maintenance?",
    answer:
      "Yes, routine servicing (recommended quarterly) keeps the lift safe and reliable. KAS offers AMC (Annual Maintenance Contract) plans for ongoing support.",
  },
  {
    question: "Which areas in Hyderabad does KAS Home Elevators serve?",
    answer:
      "We serve all major residential zones including Banjara Hills, Jubilee Hills, Gachibowli, Kondapur, Madhapur, Kompally, Manikonda, Tellapur, Miyapur, and Secunderabad.",
  },
  {
    question: "Why choose KAS Home Elevators over other Hyderabad providers?",
    answer:
      "KAS combines 10+ years of experience, 500+ completed installations, in-house technical teams, and multi-country operations, with transparent pricing and dedicated after-sales AMC support.",
  },
];

const businessPhone = "+91-8019219911";
const businessPhoneTel = "tel:+918019219911";
const businessEmail = "assist@kashomeelevators.com";

const contactPoints = [
  "📞 Call our elevator experts for a free consultation.",
  "📧 Send us your enquiry, and our team will respond promptly.",
  "🏡 Schedule a free site inspection at your home.",
  "💰 Request a customized quotation based on your project requirements.",
  "🔧 Get professional guidance on choosing the right residential elevator for your property.",
];

const contactClosing =
  "Take the first step towards a safer, smarter, and more accessible home with Kashome Elevators. Contact us today to discuss your project and discover why homeowners trust us for premium residential elevator installation in Hyderabad backed by quality, innovation, and dependable customer support.";

const customerReviews = [
  {
    name: "Rajesh Khanna",
    location: "Gachibowli villa owner, Hyderabad",
    rating: 5,
    text: "KAS Home Elevators installed a compact MRL home lift in our villa at Gachibowli. The team was highly professional, finishing the civil prep and installation in under 4 weeks. The lift runs silently, and their pricing was completely transparent with no extra costs.",
  },
  {
    name: "Sridevi R.",
    location: "Kondapur duplex owner, Hyderabad",
    rating: 5,
    text: "Outstanding experience! We retrofitted a hydraulic home lift in our duplex house in Kondapur. It takes very little space, and my elderly parents can now move between floors without any difficulty. KAS provides excellent after-sales maintenance support.",
  },
  {
    name: "Dr. Murali Mohan",
    location: "Kompally resident, Hyderabad",
    rating: 5,
    text: "We installed a glass villa lift in Kompally. The finish matches our interiors perfectly, and it draws very little power. KAS delivered on time and stayed within the budget. Highly recommended!",
  },
  {
    name: "Venkat R.",
    location: "Tellapur duplex owner, Hyderabad",
    rating: 5,
    text: "Very satisfied with the gearless home lift from KAS. It was installed in 3 weeks, and the ARD safety features work seamlessly during power cuts. Their technical team handles everything in-house with great care.",
  },
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
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "4",
  },
  review: customerReviews.map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: review.name,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(review.rating),
    },
    reviewBody: review.text,
  })),
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
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 lg:mb-8 max-w-4xl">
              Home Lift in Hyderabad – Safe, Space-Saving Lifts for Villas &amp; Duplex Homes
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 mb-8">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                KAS Home Elevators
              </span>
              <span className="h-3 w-px bg-slate-700 hidden sm:inline" />
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                ISO Certified Company
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-5 text-lg sm:text-xl text-slate-100 leading-relaxed">
                <p className="text-slate-200">
                  {linkSeoKeywords(addedHeroParagraphs[0], seoLinkClassHero)}
                </p>
                <p className="text-slate-200">
                  {linkSeoKeywords(addedHeroParagraphs[1], seoLinkClassHero)}
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-md !my-6">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">10+</div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">Years of Expertise</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">500+</div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">Installations Completed</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl sm:text-3xl font-bold text-green-400">4</div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1">Countries Served</div>
                  </div>
                </div>
                <p className="text-slate-200">
                  {linkSeoKeywords(addedHeroParagraphs[2], seoLinkClassHero)}
                </p>
              </div>

              <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
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

                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-500/20 p-5 max-w-md mx-auto lg:mx-0">
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-slate-300 font-medium">Starting price</span>
                      <span className="text-white font-semibold">₹4.5 lakh</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-slate-300 font-medium">Best type for Hyderabad villas</span>
                      <span className="text-white font-semibold">Hydraulic / MRL</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                      <span className="text-slate-300 font-medium">Timeline</span>
                      <span className="text-white font-semibold">3–6 weeks</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-300 font-medium">Space needed</span>
                      <span className="text-white font-semibold">From 4 x 4 ft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              What Is a Home Lift?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div className="mb-6 p-5 rounded-xl border border-green-200 bg-green-50/60 text-gray-800 font-medium leading-relaxed">
                <p className="text-sm sm:text-base">
                  {linkSeoKeywords(whatIsHomeLiftIntro)}
                </p>
              </div>
              <p>{linkSeoKeywords(whatIsHomeLiftDetails)}</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose a Home Lift in Hyderabad?
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div className="mb-6 p-5 rounded-xl border border-green-200 bg-green-50/60 text-gray-800 font-medium leading-relaxed">
                <p className="text-sm sm:text-base">
                  {linkSeoKeywords(whyHyderabadIntro)}
                </p>
              </div>
              <p>{linkSeoKeywords(whyHyderabadDetails)}</p>
              <p>{linkSeoKeywords(whyChooseParagraphs[0])}</p>
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
            <div className="mb-6 p-5 rounded-xl border border-green-200 bg-green-50/60 text-gray-800 font-medium leading-relaxed">
              <p className="text-sm sm:text-base">
                {linkSeoKeywords(typesQuickAnswer)}
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {linkSeoKeywords(addedTypesIntro)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(liftTypesIntro)}
            </p>
            <div className="space-y-8">
              {liftTypes.map((item) => (
                <div key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p>
                    {linkSeoKeywords(item.content)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(liftTypesClosing)}
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">
              Hydraulic vs MRL vs Gearless vs Vacuum: Quick Comparison
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

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Home Lift vs Traditional Elevator / Stairlift
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(homeLiftVsAlternativesIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6 mb-10">
              {homeLiftVsAlternatives.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">{linkSeoKeywords(item.content)}</p>
                </li>
              ))}
            </ul>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Feature
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Home Lift
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Traditional Elevator
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-200">
                      Stairlift
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {homeLiftVsTable.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
                        {row.feature}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.homeLift}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.elevator}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                        {row.stairlift}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Homeowners across Hyderabad trust KAS for transparent pricing, safety engineering, and reliable home lift installations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Google Rating Badge & Video Walkthrough (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Google Reviews Badge */}
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <svg className="w-8 h-8 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-none">Google Reviews</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-lg font-bold text-gray-900">4.9</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(500+ reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Video Walkthrough Card */}
                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Video Walkthrough
                  </h3>
                  <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black shadow-inner">
                    <video
                      src="/latest_home.mp4"
                      controls
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Watch our premium home lift in action at a completed Hyderabad villa installation.
                  </p>
                </div>
              </div>

              {/* Right Column: 2x2 Reviews Grid (lg:col-span-7) */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {customerReviews.map((review, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-3 text-amber-400">
                        {[...Array(review.rating)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="text-gray-600 italic leading-relaxed mb-4 text-xs sm:text-sm">
                        &ldquo;{review.text}&rdquo;
                      </p>
                    </div>

                    {/* Reviewer info */}
                    <div className="flex items-center gap-3 border-t border-gray-200/50 pt-3 mt-4">
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center shrink-0 text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {review.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          {review.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <ul className="space-y-6 list-none">
              {faqs.map((item, index) => (
                <li key={item.question} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900 block mb-2">
                    {index + 1}. {item.question}
                  </strong>
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
