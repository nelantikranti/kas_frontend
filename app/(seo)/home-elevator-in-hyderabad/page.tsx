import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const currentPageHref = "/home-elevator-in-hyderabad";
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

const pageUrl = "https://www.kashomeelevators.com/home-elevator-in-hyderabad/";
const siteUrl = "https://www.kashomeelevators.com/";
const imageFileName = "home-elevator-in-hydrabad.jpg";
const imagePath = `/${imageFileName}`;
const imageUrl = `https://www.kashomeelevators.com/${imageFileName}`;
const imageAlt = "Home elevator in Hyderabad by KAS Home Elevators";

const secondImageFileName = "home-elevator-hyderabad-villa.webp";
const secondImagePath = `/${secondImageFileName}`;
const secondImageAlt = "Glass Home Elevator in Hyderabad";

const heroIntro =
  "Looking for a reliable home elevator in Hyderabad? KAS Home Elevators designs and installs safe, compact, and low-maintenance home lifts for villas, duplex homes, and independent houses across the city. Whether you need a lift for elderly family members, added convenience, or to future-proof your home, our home elevators in Hyderabad are built for Indian homes with minimal civil work, low power consumption, and a design that blends into your interiors.";

const ctaButtons = [
  { href: "/contact", label: "Get Free Quote" },
  { href: "/contact", label: "Book Free Site Inspection" },
  { href: "/contact", label: "Talk to Our Lift Expert" },
  { href: "/contact", label: "Request a Callback" },
  { href: "/contact", label: "Contact Us Today" },
];

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
        url: imageUrl,
        alt: imageAlt,
      },
    ],
  },
};

const benefitsIntro =
  "Installing a home elevator in Hyderabad is more than a luxury—it's a practical investment that enhances your home's comfort, safety, and long-term value. Whether you're building a new villa or upgrading an existing home, a modern home lift offers convenience for every member of the family.";

const benefits = [
  {
    title: "Improved Accessibility",
    content:
      "A home elevator makes daily movement between floors simple and comfortable, especially for senior citizens, children, and individuals with mobility challenges. It eliminates the need to climb stairs and provides safe access to every level of your home.",
  },
  {
    title: "Enhanced Safety",
    content:
      "Modern residential elevators are equipped with advanced safety features such as emergency alarms, automatic door sensors, battery backup, overload protection, and emergency stop functions. These features ensure secure and reliable operation every day.",
  },
  {
    title: "Increased Property Value",
    content:
      "A premium residential elevator in Hyderabad adds a modern touch to your property while increasing its market value. Homes with elevators are often more attractive to buyers looking for convenience, accessibility, and luxury.",
  },
  {
    title: "Space-Saving Designs",
    content:
      "Today's home elevators are designed to fit compact spaces without compromising performance. Whether you own a duplex, bungalow, or villa, our customized lift solutions maximize available space while maintaining an elegant appearance.",
  },
  {
    title: "Stylish and Customizable Interiors",
    content:
      "Choose from a wide range of cabin designs, finishes, lighting options, and control panels to match your home's interior. A well-designed elevator complements your décor and adds a premium feel to your living space.",
  },
  {
    title: "Energy-Efficient Performance",
    content:
      "Our home lifts use advanced technology to deliver smooth operation while consuming minimal electricity. This helps reduce operating costs without sacrificing performance or reliability.",
  },
  {
    title: "Hassle-Free Home Lift Installation",
    content:
      "Our experienced team handles the complete home lift installation in Hyderabad, from site inspection and planning to installation, testing, and final handover. We ensure every project is completed efficiently and in compliance with safety standards.",
  },
  {
    title: "Low Maintenance and Long-Term Reliability",
    content:
      "Built using high-quality components, our home elevators require minimal maintenance and provide dependable performance for years. Regular servicing by our trained technicians keeps your elevator running smoothly and safely.",
  },
  {
    title: "Perfect for Villas and Luxury Homes",
    content:
      "Whether you need a villa elevator in Hyderabad or a lift for a multi-storey residence, we provide tailored solutions that combine comfort, aesthetics, and advanced technology to meet your specific requirements.",
  },
];

const benefitsClosing =
  "Investing in a high-quality home elevator is a smart decision that improves your lifestyle today while adding lasting value to your property. At Kashome Elevators, we provide customized solutions that deliver safety, comfort, and exceptional performance for every home.";

const featuresIntro =
  "At Kashome Elevators, we understand that every home has unique requirements. That's why our home elevators in Hyderabad are designed to deliver the perfect combination of safety, comfort, performance, and elegant design. Whether you're looking for a compact home lift or a premium villa elevator in Hyderabad, our solutions are built to make everyday living easier while complementing your home's architecture.";

const features = [
  {
    title: "Elegant and Space-Efficient Design",
    content:
      "Our home elevators are thoughtfully engineered to fit seamlessly into modern homes without occupying unnecessary space. Their compact design makes them suitable for villas, duplex homes, independent houses, and existing residential buildings where space optimization is important.",
  },
  {
    title: "Smooth and Quiet Operation",
    content:
      "Enjoy a comfortable ride with advanced drive technology that ensures smooth acceleration, gentle stopping, and minimal noise. Every lift is designed to provide a peaceful and pleasant experience for you and your family.",
  },
  {
    title: "Advanced Safety Features",
    content:
      "Safety is at the core of every elevator we install. Our systems include automatic rescue devices, emergency battery backup, overload protection, door safety sensors, emergency alarms, and child-friendly controls to provide complete peace of mind.",
  },
  {
    title: "Energy-Efficient Technology",
    content:
      "Our residential elevators in Hyderabad are built using energy-efficient systems that consume less power while maintaining excellent performance. This helps reduce electricity usage without compromising reliability.",
  },
  {
    title: "Premium Cabin Designs",
    content:
      "Personalize your elevator with a wide selection of cabin finishes, stainless steel interiors, glass panels, elegant flooring, LED lighting, and stylish control panels. Every cabin is designed to enhance the beauty of your home while offering maximum comfort.",
  },
  {
    title: "Custom Solutions for Every Home",
    content:
      "No two homes are the same. We provide customized elevator solutions based on your available space, number of floors, design preferences, and accessibility needs. Whether you're planning a new construction or retrofitting an existing property, our team ensures the perfect fit.",
  },
  {
    title: "Reliable Performance with Low Maintenance",
    content:
      "Manufactured using high-quality components and tested to strict quality standards, our elevators deliver dependable performance for years. Routine maintenance is simple, helping you enjoy uninterrupted operation with minimal downtime.",
  },
  {
    title: "Professional Home Lift Installation",
    content:
      "Our experienced engineers manage the complete home lift installation in Hyderabad, including site inspection, design consultation, installation, safety testing, and final commissioning. Every project is completed with precision and in accordance with industry safety standards.",
  },
  {
    title: "Smart Controls and User-Friendly Operation",
    content:
      "Our elevators feature intuitive controls, soft-touch buttons, clear display panels, and optional smart automation features, making them easy to operate for users of all ages.",
  },
];

const featuresClosing =
  "Choosing a home elevator in Hyderabad from Kashome Elevators means investing in a solution that combines modern engineering, premium quality, and long-lasting performance. From compact residential lifts to luxurious villa elevators, we deliver products that improve accessibility, enhance property value, and provide exceptional comfort for years to come.";

const solutionsIntro =
  "Every home has different architectural requirements, lifestyle preferences, and accessibility needs. At Kashome Elevators, we offer a wide range of home elevator solutions in Hyderabad that combine innovative technology, premium quality, and elegant designs. Whether you're constructing a new home or upgrading an existing property, our customized lift solutions are designed to provide convenience, safety, and long-lasting performance.";

const solutions = [
  {
    title: "Residential Home Elevators",
    content:
      "Our residential elevators in Hyderabad are designed to make everyday living easier and more comfortable. These elevators provide smooth and quiet operation while blending seamlessly with your home's interior. Ideal for independent houses, duplex homes, and multi-storey residences, they offer safe and reliable mobility for every family member.",
  },
  {
    title: "Villa Elevators",
    content:
      "Enhance your luxury home with our premium villa elevators in Hyderabad. Designed with modern aesthetics and advanced engineering, these elevators add elegance while improving accessibility between floors. With customizable cabin designs, premium finishes, and intelligent safety features, our villa elevators deliver the perfect combination of style and functionality.",
  },
  {
    title: "Compact Home Lifts",
    content:
      "Limited space should never stop you from enjoying the convenience of a home elevator. Our compact home lifts are specially designed for homes with minimal installation space. Their space-saving design allows easy integration into existing buildings without major structural modifications.",
  },
  {
    title: "Machine Room-Less (MRL) Elevators",
    content:
      "Our Machine Room-Less elevators offer a modern solution for homeowners looking for maximum space efficiency. These systems eliminate the need for a separate machine room, reduce construction costs, and provide energy-efficient performance without compromising comfort or safety.",
  },
  {
    title: "Hydraulic Home Elevators",
    content:
      "Hydraulic elevators are an excellent choice for low-rise residential buildings. They deliver smooth travel, reliable performance, and exceptional durability, making them ideal for villas and premium homes where comfort and stability are top priorities.",
  },
  {
    title: "Customized Home Lift Solutions",
    content:
      "Every home is unique, which is why we provide fully customized elevator solutions based on your available space, interior design, number of floors, and specific mobility requirements. From cabin finishes and flooring to control panels and lighting, every detail can be tailored to complement your home's style.",
  },
  {
    title: "Professional Home Lift Installation in Hyderabad",
    content:
      "Our experienced team manages the complete home lift installation in Hyderabad, including site inspection, planning, installation, safety testing, and final handover. Every project is executed with precision and follows the highest industry safety standards, ensuring a hassle-free experience from start to finish.",
  },
];

const solutionsClosing =
  "Whether you need a compact residential lift, a luxurious villa elevator, or a fully customized mobility solution, Kashome Elevators delivers dependable products that combine safety, comfort, innovation, and long-term value. Our goal is to provide homeowners with elevator solutions that not only improve accessibility but also enhance the beauty and value of their homes.";

const whyChooseKasIntro =
  "Choosing the right elevator company is just as important as selecting the right elevator. At Kashome Elevators, we are committed to delivering premium home elevators in Hyderabad that combine advanced technology, exceptional safety, and elegant designs. Our focus is not only on installing elevators but also on creating long-term mobility solutions that enhance your lifestyle and increase the value of your home.";

const whyChooseKas = [
  {
    title: "Customized Solutions for Every Home",
    content:
      "Every home is different, and so are its requirements. Whether you own a villa, duplex, bungalow, or independent house, we design and install customized elevator solutions that perfectly match your available space, architectural style, and daily needs.",
  },
  {
    title: "Superior Quality and Safety Standards",
    content:
      "Safety is our highest priority. Every residential elevator in Hyderabad is manufactured using premium-quality materials and equipped with advanced safety features, including emergency battery backup, overload protection, automatic rescue devices, door safety sensors, and smooth braking systems. Each installation is thoroughly tested to ensure reliable and secure performance.",
  },
  {
    title: "Experienced Installation Team",
    content:
      "Our skilled engineers have extensive experience in home lift installation in Hyderabad. From the initial site inspection and design consultation to installation, testing, and final handover, every project is completed with precision, professionalism, and strict quality standards.",
  },
  {
    title: "Premium Designs That Complement Your Home",
    content:
      "A home elevator should not only improve accessibility but also enhance your home's aesthetics. We offer a wide range of modern cabin designs, luxury finishes, glass panels, elegant lighting, and customizable interiors that blend beautifully with contemporary and traditional homes.",
  },
  {
    title: "Energy-Efficient and Low-Maintenance Elevators",
    content:
      "Our elevators are designed with advanced technology that ensures smooth performance while consuming less electricity. Their durable construction and high-quality components help reduce maintenance requirements, making them a cost-effective solution for homeowners.",
  },
  {
    title: "Reliable After-Sales Support",
    content:
      "Our relationship with customers continues even after installation. We provide timely maintenance services, technical assistance, and prompt support to ensure your elevator operates safely and efficiently throughout its lifespan.",
  },
  {
    title: "Trusted by Homeowners Across Hyderabad",
    content:
      "Homeowners choose Kashome Elevators because of our commitment to quality, transparent service, and customer satisfaction. From compact home lifts to premium villa elevators in Hyderabad, we have earned the trust of families by delivering reliable elevator solutions that stand the test of time.",
  },
  {
    title: "End-to-End Elevator Solutions",
    content:
      "We manage every stage of your project, including consultation, planning, design, manufacturing, installation, testing, and maintenance. This complete approach ensures a hassle-free experience and consistent quality from start to finish.",
  },
];

const whyChooseKasClosing =
  "If you're looking for a reliable home elevator in Hyderabad, Kashome Elevators is the partner you can trust. With innovative technology, personalized solutions, experienced professionals, and dedicated customer support, we deliver home elevator systems that combine safety, comfort, elegance, and long-term value. Whether you need a compact residential lift or a luxurious villa elevator, we are committed to providing solutions that exceed your expectations.";

const whyChooseUsIntro =
  "Finding the right partner for your home elevator project is essential to ensure safety, quality, and long-term reliability. At Kashome Elevators, we are dedicated to providing premium home elevators in Hyderabad that combine innovative technology, elegant design, and exceptional performance. From consultation to installation and after-sales support, we focus on delivering a seamless experience for every homeowner.";

const whyChooseUs = [
  {
    title: "Tailor-Made Elevator Solutions",
    content:
      "Every home is unique, and we believe your elevator should be too. We design customized lift solutions that match your home's layout, available space, and interior style, ensuring a perfect balance of functionality and aesthetics.",
  },
  {
    title: "Premium Quality Products",
    content:
      "Our elevators are built using high-quality components and advanced engineering standards. Every residential elevator in Hyderabad is designed to deliver smooth operation, durability, and dependable performance for years to come.",
  },
  {
    title: "Safety Comes First",
    content:
      "We never compromise on safety. Our home elevators are equipped with modern safety features such as emergency battery backup, automatic rescue devices, overload protection, door sensors, and emergency alarm systems to provide complete peace of mind.",
  },
  {
    title: "Professional Installation",
    content:
      "Our experienced technicians handle every stage of home lift installation in Hyderabad, from site inspection and planning to installation, testing, and final handover. Every project is completed with precision and follows industry safety standards.",
  },
  {
    title: "Elegant Designs for Modern Homes",
    content:
      "Whether you prefer a sleek contemporary cabin or a luxurious finish for your villa, we offer a variety of customizable designs that enhance the beauty of your home while providing maximum comfort.",
  },
  {
    title: "Energy-Efficient and Low Maintenance",
    content:
      "Our elevators are engineered for energy efficiency and reliable performance. With low maintenance requirements and durable construction, they offer an economical solution without compromising quality.",
  },
  {
    title: "Dedicated Customer Support",
    content:
      "Our commitment doesn't end after installation. We provide responsive after-sales service, regular maintenance support, and technical assistance to ensure your elevator continues to perform at its best.",
  },
  {
    title: "Trusted Choice for Homeowners in Hyderabad",
    content:
      "Homeowners trust Kashome Elevators for delivering reliable home elevators in Hyderabad, premium craftsmanship, transparent service, and customer-focused solutions. Whether you need a compact home lift or a luxury villa elevator in Hyderabad, we are committed to providing solutions that improve accessibility, comfort, and property value.",
  },
];

const whyChooseUsClosing =
  "Choose Kashome Elevators for a home elevator solution that combines safety, innovation, quality, and long-term reliability—all backed by a team that puts your satisfaction first.";

const elevatorTypesIntro =
  "Choosing the right home elevator in Hyderabad depends on your home's layout, available space, budget, and lifestyle needs. At Kashome Elevators, we offer a wide range of residential elevator solutions designed to provide maximum comfort, safety, and long-term reliability. Whether you're building a new home or upgrading an existing one, our experts help you select the ideal elevator that perfectly suits your requirements.";

const elevatorTypes = [
  {
    title: "Hydraulic Home Elevators",
    content:
      "Hydraulic elevators are a popular choice for villas and low-rise residential buildings. They provide smooth and stable operation, making them ideal for homeowners looking for a reliable and comfortable lifting solution. Their durable design and quiet performance make them suitable for everyday use.",
  },
  {
    title: "Machine Room-Less (MRL) Home Elevators",
    content:
      "Machine Room-Less (MRL) elevators are designed for homes where space optimization is a priority. Since they do not require a separate machine room, they reduce construction costs while maintaining excellent performance, energy efficiency, and safety. MRL elevators are perfect for modern homes, duplexes, and compact residential spaces.",
  },
  {
    title: "Gearless Home Elevators",
    content:
      "Gearless home elevators use advanced traction technology to deliver exceptionally smooth, quiet, and energy-efficient operation. These elevators require less maintenance and offer superior ride comfort, making them an excellent choice for luxury homes and premium residential projects.",
  },
  {
    title: "Villa Elevators",
    content:
      "Our villa elevators in Hyderabad are specially designed for elegant homes that demand both style and functionality. Available in a variety of premium finishes, cabin designs, and customization options, these elevators enhance your home's aesthetics while providing effortless mobility between floors.",
  },
  {
    title: "Residential Home Lifts",
    content:
      "Our residential elevators in Hyderabad are suitable for independent houses, duplex homes, bungalows, and multi-storey residences. Designed with advanced safety features and modern technology, they provide a secure, comfortable, and convenient solution for everyday living.",
  },
  {
    title: "Customized Home Elevator Solutions",
    content:
      "Every home has unique requirements, which is why we offer fully customized elevator solutions. From cabin interiors and control panels to dimensions and finishes, every detail can be tailored to match your home's architecture and your personal preferences.",
  },
];

const elevatorTypesClosing =
  "No matter which type of elevator you choose, Kashome Elevators ensures professional home lift installation in Hyderabad, premium quality components, and reliable after-sales support. Our goal is to provide homeowners with safe, stylish, and efficient elevator solutions that improve accessibility while adding long-term value to their property.";

const serviceAreas = [
  "Jubilee Hills",
  "Banjara Hills",
  "Gachibowli",
  "Kondapur",
  "Kokapet",
  "Financial District",
  "Nallagandla",
];

const faqs = [
  {
    question: "What is the cost of a home elevator in Hyderabad?",
    answer:
      "The cost of a home elevator in Hyderabad depends on several factors, including the type of elevator, the number of floors, cabin size, customization options, and installation requirements. Contact Kashome Elevators for a free site inspection and a customized quotation based on your home's needs.",
  },
  {
    question: "Which type of home elevator is best for residential properties?",
    answer:
      "The ideal home elevator depends on your available space, budget, and building structure. Hydraulic, Machine Room-Less (MRL), and gearless elevators are among the most popular choices for villas, duplex homes, and independent houses. Our experts can recommend the most suitable solution after evaluating your property.",
  },
  {
    question: "Can a home elevator be installed in an existing house?",
    answer:
      "Yes. Modern home elevators can be installed in both newly constructed and existing homes. Our team carefully assesses the available space and recommends the best installation method with minimal structural modifications.",
  },
  {
    question: "How long does home lift installation take?",
    answer:
      "The installation timeline varies depending on the elevator type and project requirements. In most cases, a residential home elevator can be installed within a few weeks after finalizing the design and site preparation.",
  },
  {
    question: "Are home elevators safe for children and senior citizens?",
    answer:
      "Absolutely. Our home elevators are equipped with advanced safety features such as emergency battery backup, automatic rescue devices, door safety sensors, overload protection, and emergency alarm systems, making them safe and reliable for users of all ages.",
  },
  {
    question: "Do home elevators require regular maintenance?",
    answer:
      "Yes. Regular maintenance helps ensure smooth operation, improves safety, and extends the lifespan of your elevator. Kashome Elevators offers professional maintenance and after-sales support to keep your elevator performing at its best.",
  },
  {
    question: "How much space is required to install a home elevator?",
    answer:
      "The space required depends on the elevator model you choose. We offer compact home elevators designed for homes with limited space, making installation possible in most villas, duplex homes, and independent houses.",
  },
  {
    question: "Are your home elevators energy efficient?",
    answer:
      "Yes. Our home elevators are built with advanced, energy-efficient technology that consumes less electricity while providing smooth, reliable, and quiet operation for everyday use.",
  },
  {
    question: "Do you provide customized home elevator solutions?",
    answer:
      "Yes. We offer fully customized home elevator solutions to match your home's architecture, interior design, and accessibility requirements. You can choose from various cabin designs, finishes, lighting options, and control panels.",
  },
  {
    question: "Why choose Kashome Elevators for home elevators in Hyderabad?",
    answer:
      "Kashome Elevators provides premium home elevator solutions with customized designs, high-quality components, advanced safety features, professional installation, and dependable after-sales support. Our focus on quality, customer satisfaction, and reliable service makes us a trusted choice for homeowners looking for a home elevator in Hyderabad.",
  },
];

const contactIntro =
  "Looking for a reliable home elevator in Hyderabad? Kashome Elevators is here to help you find the perfect solution for your home. Whether you're planning a new installation or upgrading an existing property, our experienced team is ready to guide you through every step—from consultation and site inspection to installation and ongoing support.";

const contactDetails = [
  "We provide customized home elevator installation in Hyderabad for villas, duplex homes, independent houses, and other residential properties. Our focus is on delivering safe, stylish, and energy-efficient home elevator solutions that match your space, budget, and lifestyle.",
  "Get in touch with our experts today to schedule a free site inspection or request a personalized quotation. We'll help you choose the ideal home elevator that combines comfort, convenience, and long-term reliability.",
  "Call us today or fill out our enquiry form to discuss your requirements. Experience premium quality, professional service, and dependable support with Kashome Elevators—your trusted partner for home elevators in Hyderabad.",
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
  name: "Home Elevator in Hyderabad",
  description:
    "Premium residential home elevator installation and support in Hyderabad by Kashome Elevators.",
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
  name: "Home Elevator in Hyderabad",
  description:
    "Looking for a home elevator in Hyderabad? KAS installs safe, compact, gearless home lifts for villas & duplex homes. Free site visit & quote.",
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
      name: "Home Elevator in Hyderabad",
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

export default function HomeElevatorHyderabadPage() {
  const linkSeoKeywords = createSeoLinker(currentPageHref);

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <main>
        <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_45%)]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 lg:mb-10 max-w-4xl">
              Home Elevator in Hyderabad - Safe, Compact Lifts for Every Home
            </h1>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 text-lg sm:text-xl text-slate-100 leading-relaxed">
                <p>{linkSeoKeywords(heroIntro)}</p>
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

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Benefits of Installing a Home Elevator in Hyderabad
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

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex justify-center">
            <div className="relative aspect-[4/3] w-full max-w-xl rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src={secondImagePath}
                alt={secondImageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 576px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Features of Our Home Elevators in Hyderabad
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
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(featuresClosing)}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Home Elevator Solutions in Hyderabad
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(solutionsIntro)}
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

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Kashome Elevators for Home Elevators in Hyderabad?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(whyChooseKasIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {whyChooseKas.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
            <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4">
              Your Trusted Partner for Home Elevators in Hyderabad
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {linkSeoKeywords(whyChooseKasClosing)}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(whyChooseUsIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {whyChooseUs.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(whyChooseUsClosing)}
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Types of Home Elevators
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(elevatorTypesIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {elevatorTypes.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">{item.title}</strong>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(elevatorTypesClosing)}
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-white p-8 sm:p-10 shadow-sm">
              <div className="max-w-3xl mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Service Areas in Hyderabad
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We install and service home elevators across Hyderabad&apos;s top residential
                  neighbourhoods. Wherever you are in the city, our team can visit your site,
                  recommend the right lift, and handle installation end to end.
                </p>
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
              <p className="mt-8 text-sm text-gray-600 leading-relaxed">
                Don&apos;t see your area listed?{" "}
                <Link href="/contact" className="font-semibold text-green-700 hover:text-green-800">
                  Contact us
                </Link>{" "}
                — we cover most residential locations across Hyderabad and nearby areas.
              </p>
            </div>
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

        <section className="py-16">
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
              Get a Free Home Elevator Quote in Hyderabad
            </h2>
            <p className="text-green-50 text-lg leading-relaxed mb-8">
              Book a free site visit with KAS Home Elevators and get a tailored recommendation
              for your villa, duplex, or independent home.
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
