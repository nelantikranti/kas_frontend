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

const pageUrl = "https://www.kashomeelevators.com/residential-elevator-hyderabad/";
const siteUrl = "https://www.kashomeelevators.com/";
const imageFileName = "residential-lift-hyderabad.webp";
const imagePath = residentialLiftImage;
const imageUrl = `https://www.kashomeelevators.com/${imageFileName}`;
const imageAlt = "Residential Elevator in Hyderabad";

const ctaButtons = [
  { href: "/contact", label: "Get Free Quote" },
  { href: "/contact", label: "Book Free Site Inspection" },
  { href: "/contact", label: "Contact Our Experts" },
  { href: "/contact", label: "Request a Callback" },
  { href: "/contact", label: "Call Now" },
];

export const metadata: Metadata = {
  title: "Best Residential Elevator in Hyderabad | Kashome Elevators",
  description:
    "Looking for the best residential elevator in Hyderabad? Kashome Elevators offers premium residential elevator solutions with expert installation, modern designs, advanced safety, and reliable after-sales support.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Best Residential Elevator in Hyderabad | Kashome Elevators",
    description:
      "Looking for the best residential elevator in Hyderabad? Kashome Elevators offers premium residential elevator solutions with expert installation, modern designs, advanced safety, and reliable after-sales support.",
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
    title: "Enhanced Accessibility for Every Family Member",
    content:
      "One of the biggest advantages of a residential elevator in Hyderabad is improved accessibility. It allows senior citizens, children, pregnant women, and individuals with mobility challenges to move safely between floors without depending on stairs. A residential elevator creates a barrier-free environment where every family member can enjoy complete freedom and comfort.",
  },
  {
    title: "Increased Property Value",
    content:
      "A premium residential elevator installation in Hyderabad significantly enhances the market value of your property. Modern homebuyers prefer homes that offer advanced amenities and future-ready features. Adding a residential elevator not only improves daily convenience but also makes your property more attractive for future resale.",
  },
  {
    title: "Superior Comfort and Everyday Convenience",
    content:
      "Carrying groceries, luggage, furniture, or household items between floors can be difficult and time-consuming. A residential elevator makes these everyday tasks simple and effortless, saving time while improving your overall living experience. With smooth and quiet operation, it offers unmatched convenience for busy families.",
  },
  {
    title: "Advanced Safety and Reliable Performance",
    content:
      "Safety is one of the primary reasons homeowners choose Kashome Elevators. Every residential elevator in Hyderabad is equipped with advanced safety features, including emergency battery backup, automatic rescue devices, overload protection, door interlock systems, emergency alarms, and smooth start-and-stop technology. These features ensure dependable performance and provide peace of mind every day.",
  },
  {
    title: "Elegant Design That Complements Your Home",
    content:
      "A residential elevator is more than a mobility solution—it's an architectural enhancement. Our elevators are available in a variety of cabin finishes, premium materials, modern lighting, and stylish control panels that blend seamlessly with your home's interior while adding a luxurious touch.",
  },
  {
    title: "Energy-Efficient and Low-Maintenance Solution",
    content:
      "Our residential elevators are designed using energy-efficient technology that minimizes electricity consumption without compromising performance. Built with high-quality components, they require minimal maintenance, helping homeowners reduce long-term operating costs while enjoying reliable service for years.",
  },
  {
    title: "Customized to Match Your Home",
    content:
      "Every property has different design and space requirements. That's why Kashome Elevators offers fully customized residential elevator solutions in Hyderabad. From compact elevators for limited spaces to premium models for luxury villas, every system is tailored to match your home's architecture, available space, and lifestyle.",
  },
  {
    title: "Professional Installation and Dedicated Support",
    content:
      "Choosing Kashome Elevators means receiving complete support throughout your journey. From site inspection and planning to residential elevator installation in Hyderabad, testing, and after-sales maintenance, our experienced team ensures every elevator meets the highest standards of safety, quality, and performance.",
  },
];

const benefitsClosing =
  "Investing in a residential elevator in Hyderabad is not just about convenience—it's about creating a safer, smarter, and more comfortable home for years to come. With customized designs, advanced technology, and trusted installation services, Kashome Elevators helps homeowners enjoy effortless mobility while adding lasting value to their property.";

const featuresIntro =
  "At Kashome Elevators, we provide premium residential elevators in Hyderabad that combine innovation, safety, and elegant design. Every elevator is engineered to deliver smooth performance, long-lasting reliability, and maximum comfort for modern homes. Whether you own a duplex house, independent home, bungalow, or luxury villa, our residential elevator solutions are designed to improve accessibility while enhancing the beauty and value of your property. Using advanced technology and premium-quality components, we ensure every elevator meets the highest standards of performance, efficiency, and safety.";

const features = [
  {
    title: "Advanced Safety Features",
    content:
      "Safety is the most important feature of every residential elevator we install. Our elevators are equipped with emergency battery backup, automatic rescue devices, overload protection, door interlock systems, emergency alarm buttons, and smooth start-stop technology. These advanced safety systems ensure secure and reliable operation, giving complete peace of mind to homeowners and their families.",
  },
  {
    title: "Smooth and Silent Operation",
    content:
      "Our residential elevators are designed to provide a quiet, vibration-free, and comfortable riding experience. Advanced drive technology delivers smooth acceleration and gentle stopping, ensuring effortless movement between floors without disturbing the peaceful environment of your home.",
  },
  {
    title: "Elegant and Modern Designs",
    content:
      "Every home has a unique style, and your elevator should complement it perfectly. We offer elegant cabin interiors, premium finishes, modern lighting, stylish control panels, and customizable design options that blend seamlessly with both contemporary and traditional home interiors.",
  },
  {
    title: "Space-Saving Installation",
    content:
      "Our compact residential elevators are designed for homes with both large and limited spaces. Whether you're constructing a new house or upgrading an existing property, our experts provide customized installation solutions that require minimal structural modifications while maximizing available space.",
  },
  {
    title: "Energy-Efficient Performance",
    content:
      "Every residential elevator in Hyderabad from Kashome Elevators is built using energy-efficient technology that delivers outstanding performance while consuming less electricity. This helps homeowners reduce operating costs and enjoy environmentally friendly mobility solutions without compromising comfort or reliability.",
  },
  {
    title: "Smart Control System",
    content:
      "Our elevators feature intuitive control panels, digital floor indicators, automatic door systems, and user-friendly operating controls. These smart features make daily operation simple, safe, and convenient for people of all age groups.",
  },
  {
    title: "Durable Construction and Low Maintenance",
    content:
      "Manufactured with premium-quality materials and precision engineering, our residential elevators are built for years of dependable service. Their durable construction minimizes maintenance requirements while ensuring smooth and reliable performance throughout their lifespan.",
  },
  {
    title: "Customized Residential Elevator Solutions",
    content:
      "Every home is different, which is why we offer fully customized residential elevator solutions in Hyderabad. From cabin dimensions and interior finishes to advanced features and installation planning, every elevator is designed according to your home's layout, available space, and lifestyle requirements.",
  },
  {
    title: "Professional Installation and Reliable After-Sales Support",
    content:
      "Our experienced engineers handle every stage of residential elevator installation in Hyderabad, including site inspection, planning, installation, testing, and maintenance. We remain committed to providing prompt after-sales support and regular servicing to ensure your elevator continues to operate safely and efficiently for years.",
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
      "Hydraulic residential elevators are one of the most reliable choices for low-rise homes and villas. They offer smooth operation, excellent lifting capacity, and consistent performance. Their robust design makes them ideal for homeowners looking for durability, comfort, and dependable vertical mobility with minimal maintenance.",
  },
  {
    title: "Machine Room-Less (MRL) Residential Elevators",
    content:
      "Machine Room-Less (MRL) elevators are designed for homes where space optimization is important. Since these elevators do not require a separate machine room, they help maximize usable space while delivering energy-efficient performance, advanced safety, and a smooth riding experience. They are an excellent choice for modern residential buildings and duplex homes.",
  },
  {
    title: "Gearless Residential Elevators",
    content:
      "Gearless residential elevators utilize advanced traction technology to provide an exceptionally quiet, smooth, and energy-efficient ride. Their modern engineering reduces maintenance requirements and improves operational efficiency, making them a preferred option for luxury homes and premium residential projects in Hyderabad.",
  },
  {
    title: "Villa Residential Elevators",
    content:
      "Luxury villas deserve elevators that combine elegance with performance. Our villa elevators feature premium cabin interiors, stylish finishes, intelligent control systems, and advanced safety features. They are designed to complement high-end residential architecture while delivering superior comfort and convenience.",
  },
  {
    title: "Compact Residential Elevators",
    content:
      "For homes with limited installation space, compact residential elevators provide a practical and efficient solution. These elevators require minimal structural modifications and can be installed in both new and existing homes, making them ideal for homeowners seeking maximum functionality without compromising available space.",
  },
  {
    title: "Customized Residential Elevators",
    content:
      "Every family has different requirements, and every home has a unique design. That's why Kashome Elevators offers fully customized residential elevator solutions in Hyderabad. From cabin dimensions and door configurations to interior finishes, control panels, and advanced features, every elevator is tailored to match your home's architecture and your lifestyle.",
  },
  {
    title: "Smart Residential Elevators",
    content:
      "Smart residential elevators integrate modern technology with user convenience. Features such as automatic rescue operation, digital displays, touch controls, energy-saving systems, and intelligent safety mechanisms provide a seamless and secure experience while supporting the needs of today's smart homes.",
  },
];

const elevatorTypesClosing =
  "Selecting the right residential elevator in Hyderabad is an important investment that enhances your home's accessibility, comfort, and long-term value. At Kashome Elevators, our experts help you choose the most suitable residential elevator based on your property's structure, daily usage, and future requirements, ensuring a solution that delivers outstanding performance, advanced safety, and complete peace of mind for years to come.";

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

const installationIntro =
  "Installing a residential elevator in Hyderabad requires careful planning, technical expertise, and precision engineering to ensure long-term safety and reliable performance. At Kashome Elevators, we follow a systematic installation process that guarantees every residential elevator is installed according to industry standards while meeting your home's structural and aesthetic requirements. From the initial consultation to final testing, our experienced professionals ensure a smooth and hassle-free installation experience.";

const installationSteps = [
  {
    title: "Free Site Inspection & Requirement Analysis",
    content:
      "Every successful project begins with a detailed site inspection. Our experts visit your property to evaluate the available space, building structure, number of floors, and mobility requirements. Based on this assessment, we recommend the most suitable residential elevator solution in Hyderabad that fits your home perfectly.",
  },
  {
    title: "Customized Design & Planning",
    content:
      "After understanding your requirements, our design team creates a customized elevator plan that complements your home's architecture and interior design. We help you choose the right cabin style, door type, finishes, control panel, and safety features while ensuring maximum space utilization and functionality.",
  },
  {
    title: "Professional Engineering & Manufacturing",
    content:
      "Once the design is approved, we manufacture your residential elevator using premium-quality materials, advanced technology, and strict quality control standards. Every component is carefully engineered to deliver smooth performance, durability, and long-term reliability.",
  },
  {
    title: "Expert Residential Elevator Installation",
    content:
      "Our certified technicians carry out the residential elevator installation in Hyderabad with complete precision and attention to detail. We follow all safety guidelines and industry best practices to ensure the elevator is installed efficiently with minimal disruption to your daily routine.",
  },
  {
    title: "Safety Testing & Quality Inspection",
    content:
      "Before handing over the elevator, our engineers perform comprehensive safety inspections and performance tests. Every system, including emergency backup, door interlocks, control panels, overload protection, and ride quality, is thoroughly checked to ensure your residential elevator operates safely and efficiently.",
  },
  {
    title: "Final Handover & User Training",
    content:
      "After successful testing, we provide a complete demonstration of your elevator's operation and safety features. Our team explains the control system, emergency procedures, and maintenance guidelines so you can use your elevator confidently from day one.",
  },
  {
    title: "After-Sales Service & Preventive Maintenance",
    content:
      "Our relationship with customers continues long after installation. We offer reliable maintenance services, periodic inspections, and prompt technical support to keep your residential elevator in Hyderabad operating smoothly for years. Regular servicing helps improve safety, extend the elevator's lifespan, and maintain optimal performance.",
  },
];

const installationClosing =
  "Choosing Kashome Elevators means choosing a trusted partner for residential elevator installation in Hyderabad. With expert planning, customized solutions, professional installation, rigorous quality checks, and dependable after-sales support, we ensure every homeowner receives a safe, efficient, and long-lasting elevator solution tailored to their needs.";

const safetyIntro =
  "Safety is the foundation of every residential elevator in Hyderabad we design and install. At Kashome Elevators, we understand that a home elevator is used daily by children, senior citizens, and every member of the family. That's why every residential elevator is engineered with advanced safety technologies, premium-quality components, and strict quality standards to ensure a secure, smooth, and worry-free riding experience. Our goal is to provide homeowners with reliable mobility solutions that deliver complete peace of mind for years to come.";

const safetyFeatures = [
  {
    title: "Automatic Rescue Device (ARD)",
    content:
      "Power interruptions should never compromise your safety. Our residential elevators are equipped with an Automatic Rescue Device (ARD) that automatically moves the elevator to the nearest floor and opens the doors safely during a power failure, allowing passengers to exit without difficulty.",
  },
  {
    title: "Emergency Battery Backup",
    content:
      "Every residential elevator installation in Hyderabad includes a dependable battery backup system that supports essential elevator functions during unexpected power outages. This feature enhances passenger safety and ensures uninterrupted emergency operation.",
  },
  {
    title: "Door Interlock Safety System",
    content:
      "Our elevators feature advanced door interlock technology that prevents the elevator from operating unless all doors are securely closed. This important safety feature minimizes the risk of accidents and ensures safe operation every time.",
  },
  {
    title: "Overload Protection System",
    content:
      "The intelligent overload protection system continuously monitors the elevator's carrying capacity. If the load exceeds the recommended limit, the elevator alerts users and temporarily prevents operation until the excess weight is removed, protecting both passengers and the equipment.",
  },
  {
    title: "Emergency Alarm and Communication System",
    content:
      "Every residential elevator is fitted with an emergency alarm button that allows passengers to quickly seek assistance whenever required. This feature provides additional confidence and security, especially for senior citizens and children.",
  },
  {
    title: "Smooth Start and Soft Stop Technology",
    content:
      "Our advanced drive systems ensure smooth acceleration and gentle stopping, eliminating sudden jerks during travel. This improves ride comfort while enhancing safety for elderly passengers, young children, and individuals with mobility challenges.",
  },
  {
    title: "Anti-Skid Flooring and LED Cabin Lighting",
    content:
      "Passenger safety also depends on cabin design. Our elevators include anti-skid flooring for improved grip and bright energy-efficient LED lighting to provide better visibility, creating a safe and comfortable environment inside the elevator cabin.",
  },
  {
    title: "Premium Quality Components",
    content:
      "Every residential elevator solution in Hyderabad is manufactured using high-quality components sourced from trusted suppliers. Each part undergoes rigorous quality checks to ensure maximum durability, dependable performance, and long-term operational safety.",
  },
  {
    title: "Regular Maintenance and Safety Inspections",
    content:
      "Safety doesn't end after installation. Kashome Elevators provides preventive maintenance, periodic inspections, and prompt technical support to ensure your residential elevator continues to operate efficiently while maintaining the highest safety standards throughout its lifespan.",
  },
];

const safetyClosing =
  "When you choose Kashome Elevators, you're choosing a company that places safety above everything else. Our advanced safety technologies, professional installation process, and reliable after-sales support ensure every residential elevator in Hyderabad delivers secure, smooth, and dependable performance, making your home safer, smarter, and more accessible for every member of your family.";

const whyKashomeIntro =
  "Selecting the right company for your residential elevator in Hyderabad is just as important as choosing the elevator itself. At Kashome Elevators, we are committed to delivering premium residential elevator solutions that combine innovative technology, superior safety, elegant design, and exceptional customer service. With years of industry expertise and a customer-first approach, we help homeowners transform their living spaces with reliable, customized, and future-ready elevator solutions. From consultation to installation and long-term maintenance, we ensure a seamless experience at every stage.";

const whyKashome = [
  {
    title: "Customized Residential Elevator Solutions",
    content:
      "Every home is unique, and so are its requirements. We design and install customized residential elevator solutions in Hyderabad that perfectly match your home's architecture, available space, interior aesthetics, and mobility needs. Whether it's a luxury villa, duplex home, bungalow, or independent house, we deliver solutions tailored specifically for you.",
  },
  {
    title: "Advanced Safety Standards",
    content:
      "Your family's safety is our highest priority. Every residential elevator installation in Hyderabad is equipped with advanced safety features, including Automatic Rescue Device (ARD), emergency battery backup, door interlock systems, overload protection, emergency alarm systems, and smooth start-stop technology. We follow strict quality standards to ensure safe and dependable operation every day.",
  },
  {
    title: "Premium Quality Products",
    content:
      "We use high-quality components, modern engineering techniques, and premium materials to manufacture durable residential elevators that deliver long-lasting performance. Our elevators are designed to provide smooth operation, low maintenance, and excellent reliability for years.",
  },
  {
    title: "Professional Installation by Experienced Engineers",
    content:
      "Our certified technicians manage every stage of the installation process with precision and attention to detail. From site inspection and planning to testing and commissioning, we ensure every residential elevator in Hyderabad is installed according to industry standards for maximum safety and efficiency.",
  },
  {
    title: "Elegant Designs with Modern Technology",
    content:
      "A residential elevator should enhance both functionality and aesthetics. Our elevators feature premium cabin finishes, stylish interiors, smart control systems, LED lighting, and customizable designs that blend beautifully with modern and traditional homes.",
  },
  {
    title: "Energy-Efficient and Cost-Effective Solutions",
    content:
      "Our elevators are designed using advanced energy-efficient technology that reduces electricity consumption without compromising performance. Homeowners benefit from lower operating costs while enjoying a reliable and environmentally responsible mobility solution.",
  },
  {
    title: "Reliable After-Sales Service and Maintenance",
    content:
      "Our relationship with customers continues long after installation. We provide preventive maintenance, regular inspections, prompt technical support, and quick service assistance to ensure your residential elevator continues to operate safely and efficiently throughout its lifespan.",
  },
  {
    title: "Transparent Pricing with No Hidden Costs",
    content:
      "We believe in honest business practices and complete transparency. Our team provides clear quotations, detailed project planning, and cost-effective solutions without hidden charges, helping homeowners make confident investment decisions.",
  },
];

const whyKashomeClosing =
  "Choosing Kashome Elevators means choosing a trusted partner for residential elevator installation in Hyderabad. Our commitment to quality, safety, innovation, and customer satisfaction has made us a preferred choice for homeowners looking for reliable residential elevator solutions. Whether you're planning a new home or upgrading an existing property, we are dedicated to delivering elevators that provide superior comfort, enhanced accessibility, and long-term value for your investment.";

const faqs = [
  {
    question: "What is the cost of a residential elevator in Hyderabad?",
    answer:
      "The cost of a residential elevator in Hyderabad depends on several factors, including the number of floors, elevator type, cabin size, design preferences, features, and installation requirements. At Kashome Elevators, we provide customized residential elevator solutions at competitive prices. Contact our team for a free site inspection and a personalized quotation.",
  },
  {
    question: "Which type of residential elevator is best for a home?",
    answer:
      "The ideal residential elevator depends on your home's structure, available space, and daily usage. Hydraulic, Machine Room-Less (MRL), gearless, and customized home elevators are among the most popular options. Our experts will recommend the best residential elevator solution in Hyderabad based on your specific requirements.",
  },
  {
    question: "How long does residential elevator installation take?",
    answer:
      "The installation time varies depending on the project size and customization requirements. In most cases, residential elevator installation in Hyderabad is completed within a few weeks after design approval and site readiness. Our team follows a structured installation process to ensure quality, safety, and timely project completion.",
  },
  {
    question: "Are residential elevators safe for children and senior citizens?",
    answer:
      "Yes. Every residential elevator in Hyderabad installed by Kashome Elevators is equipped with advanced safety features such as Automatic Rescue Device (ARD), emergency battery backup, overload protection, door interlock systems, emergency alarms, and smooth start-stop technology. These features provide a safe and comfortable riding experience for every family member.",
  },
  {
    question: "Can a residential elevator be installed in an existing home?",
    answer:
      "Absolutely. Our residential elevators are designed for both new construction projects and existing homes. After a detailed site inspection, our engineers recommend the most suitable elevator solution that requires minimal structural modifications while maintaining excellent performance and safety.",
  },
  {
    question: "Do residential elevators require regular maintenance?",
    answer:
      "Yes. Like any mechanical system, residential elevators require periodic maintenance to ensure smooth operation, safety, and long-term reliability. Kashome Elevators offers preventive maintenance services, routine inspections, and prompt technical support to keep your elevator performing at its best.",
  },
  {
    question: "Are your residential elevators energy efficient?",
    answer:
      "Yes. Our residential elevators use advanced energy-efficient technology that helps reduce electricity consumption while delivering smooth, quiet, and reliable performance. This allows homeowners to enjoy modern convenience with lower operating costs.",
  },
  {
    question: "Why should I choose Kashome Elevators for a residential elevator in Hyderabad?",
    answer:
      "Kashome Elevators is a trusted provider of residential elevator solutions in Hyderabad, offering customized designs, premium-quality products, professional installation, advanced safety features, transparent pricing, and dependable after-sales support. Our goal is to deliver reliable elevator solutions that enhance your home's comfort, accessibility, and long-term value.",
  },
];

const contactParagraphs = [
  "Looking for a trusted residential elevator in Hyderabad? Kashome Elevators is here to help you choose the perfect elevator solution for your home. Whether you're planning a new residential project, renovating an existing property, or upgrading your villa with a modern elevator, our experienced team is ready to provide expert guidance, customized solutions, and professional installation services.",
  "From the initial consultation and free site inspection to residential elevator installation in Hyderabad and reliable after-sales support, we are committed to delivering a seamless experience at every stage. Our experts carefully understand your requirements and recommend the most suitable residential elevator based on your home's layout, available space, budget, and design preferences.",
  "If you have any questions about our residential elevator solutions in Hyderabad, pricing, installation process, maintenance services, or customization options, feel free to get in touch with us. We believe in transparent communication, timely project execution, and complete customer satisfaction.",
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

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  url: pageUrl,
  name: "Residential Elevator in Hyderabad",
  description:
    "Looking for the best residential elevator in Hyderabad? Kashome Elevators offers premium residential elevator solutions with expert installation, modern designs, advanced safety, and reliable after-sales support.",
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

function ListSection({
  title,
  intro,
  items,
  closing,
  bgWhite = false,
  linkSeoKeywords,
}: {
  title: string;
  intro?: string;
  items: { title: string; content: string }[];
  closing?: string;
  bgWhite?: boolean;
  linkSeoKeywords: (text: string) => ReactNode;
}) {
  return (
    <section className={`py-16 ${bgWhite ? "bg-white" : ""}`}>
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
        <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_45%)]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 lg:mb-10 max-w-4xl">
              Residential Elevator in Hyderabad
            </h1>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-slate-100 leading-relaxed">
                <p>
                  {linkSeoKeywords(heroParagraphs[0], seoLinkClassHero)}
                </p>
                <p>
                  {linkSeoKeywords(heroParagraphs[1], seoLinkClassHero)}
                </p>
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
              {heroParagraphs.slice(2).map((paragraph) => (
                <p key={paragraph}>
                  {linkSeoKeywords(paragraph, seoLinkClassHero)}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose a Residential Elevator in Hyderabad?
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

        <ListSection
          title="Benefits of Installing a Residential Elevator"
          intro={benefitsIntro}
          items={benefits}
          closing={benefitsClosing}
          bgWhite
          linkSeoKeywords={linkSeoKeywords}
        />

        <ListSection
          title="Features of Our Residential Elevators"
          intro={featuresIntro}
          items={features}
          closing={featuresClosing}
          linkSeoKeywords={linkSeoKeywords}
        />

        <ListSection
          title="Types of Residential Elevators"
          intro={elevatorTypesIntro}
          items={elevatorTypes}
          closing={elevatorTypesClosing}
          bgWhite
          linkSeoKeywords={linkSeoKeywords}
        />

        <ListSection
          title="Our Residential Elevator Solutions"
          intro={solutionsIntro}
          items={solutions}
          closing={solutionsClosing}
          linkSeoKeywords={linkSeoKeywords}
        />

        <ListSection
          title="Residential Elevator Installation Process"
          intro={installationIntro}
          items={installationSteps}
          closing={installationClosing}
          bgWhite
          linkSeoKeywords={linkSeoKeywords}
        />

        <ListSection
          title="Safety Features of Our Residential Elevators"
          intro={safetyIntro}
          items={safetyFeatures}
          closing={safetyClosing}
          linkSeoKeywords={linkSeoKeywords}
        />

        <ListSection
          title="Why Choose Kashome Elevators?"
          intro={whyKashomeIntro}
          items={whyKashome}
          closing={whyKashomeClosing}
          bgWhite
          linkSeoKeywords={linkSeoKeywords}
        />

        <section className="py-16 bg-white">
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

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 shadow-sm">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                {contactParagraphs.map((paragraph) => (
                  <p key={paragraph}>
                    {linkSeoKeywords(paragraph)}
                  </p>
                ))}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get in Touch with Kashome Elevators
              </h3>
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
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                Contact Us Today
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-green-600 to-green-500 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
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
