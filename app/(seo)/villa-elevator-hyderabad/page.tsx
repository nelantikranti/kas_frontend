import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { ReactNode } from "react";

const currentPageHref = "/villa-elevator-hyderabad";
const seoLinkClass =
  "text-green-700 underline underline-offset-2 hover:text-green-800";

function createSeoLinker(excludeHref?: string) {
  const linkedHrefs = new Set<string>();
  const links = [
    { phrase: "residential elevators in Hyderabad", href: "/residential-elevator-hyderabad" },
    { phrase: "residential elevator in Hyderabad", href: "/residential-elevator-hyderabad" },
    { phrase: "residential elevators", href: "/residential-elevator-hyderabad" },
    { phrase: "residential elevator", href: "/residential-elevator-hyderabad" },
    { phrase: "residential elevator solutions", href: "/residential-elevator-hyderabad" },
    { phrase: "home elevators", href: "/home-elevator-in-hyderabad" },
    { phrase: "home elevator", href: "/home-elevator-in-hyderabad" },
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

const pageUrl = "https://www.kashomeelevators.com/villa-elevator-hyderabad/";
const imageFileName = "villa-elevator-hyderabad.webp";
const imagePath = `/${imageFileName}`;
const imageUrl = `https://www.kashomeelevators.com/${imageFileName}`;
const imageAlt = "Luxury Villa Elevator in Hyderabad Installed by Kashome Elevators";

const ctaButtons = [
  { href: "/contact", label: "Get Free Quote" },
  { href: "/contact", label: "Book Free Site Visit" },
  { href: "/contact", label: "Schedule Consultation" },
  { href: "/contact", label: "Request a Callback" },
  { href: "/contact", label: "Talk to Our Experts" },
  { href: "/contact", label: "Get Pricing" },
  { href: "/contact", label: "Contact Us Today" },
];

export const metadata: Metadata = {
  title: "Best Villa Elevator in Hyderabad | Luxury Home Lifts",
  description:
    "Upgrade your villa with premium villa elevators in Hyderabad. Kashome Elevators offers safe, stylish, and customized villa elevator installation for luxury homes.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Best Villa Elevator in Hyderabad | Luxury Home Lifts",
    description:
      "Upgrade your villa with premium villa elevators in Hyderabad. Kashome Elevators offers safe, stylish, and customized villa elevator installation for luxury homes.",
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
  "Looking for a premium villa elevator in Hyderabad that combines luxury, safety, and exceptional performance? Kashome Elevators offers customized villa elevator solutions, residential elevators, and home lifts in Hyderabad designed to enhance the comfort, accessibility, and elegance of modern villas and independent homes. Whether you're constructing a new luxury villa or upgrading an existing property, our advanced elevator systems provide seamless vertical mobility while perfectly complementing your home's architecture.",
  "A villa elevator in Hyderabad is more than just a convenience—it's a smart investment that improves your lifestyle and increases the value of your property. As villas continue to feature multiple floors and contemporary designs, homeowners are choosing modern elevator systems that make everyday movement effortless for every family member, including senior citizens, children, and people with mobility challenges.",
  "At Kashome Elevators, we specialize in villa elevator installation in Hyderabad, offering tailor-made solutions that match your space, interior design, and functional requirements. Our elevators are engineered using advanced technology and premium-quality components to ensure smooth operation, energy efficiency, and long-lasting reliability. Every elevator is equipped with modern safety features, elegant cabin designs, and intelligent control systems to deliver a comfortable and secure riding experience.",
  "From compact elevators for space-conscious villas to luxurious panoramic elevators that create a stunning visual statement, we provide a wide range of luxury villa elevators in Hyderabad to suit different architectural styles and customer preferences. Our experienced team manages every stage of the project, including site inspection, customized design, professional installation, testing, and dependable after-sales support.",
  "If you're searching for a trusted company that delivers high-quality villa elevator solutions in Hyderabad, Kashome Elevators is your ideal partner. We are committed to providing innovative, safe, and aesthetically pleasing elevator systems that transform your villa into a smarter, more accessible, and future-ready living space.",
];

const whyChooseParagraphs = [
  "Investing in a villa elevator in Hyderabad is about much more than moving between floors—it's about enhancing your lifestyle, improving accessibility, and adding lasting value to your home. As Hyderabad continues to grow with premium residential communities and luxury villas, homeowners are increasingly choosing modern villa elevators to combine convenience with sophisticated living. A well-designed villa elevator not only provides effortless mobility but also complements your home's architecture and reflects a premium lifestyle.",
  "Whether you own a newly built villa or are renovating an existing property, a professionally installed villa elevator in Hyderabad offers unmatched comfort for every member of the family. It allows senior citizens, children, pregnant women, and individuals with mobility challenges to move safely and independently throughout the home. In addition to improving daily convenience, a villa elevator makes carrying groceries, luggage, furniture, and other household items between floors quick and effortless.",
  "At Kashome Elevators, we specialize in villa elevator installation in Hyderabad, delivering customized solutions that perfectly match your villa's layout, interior design, and functional requirements. Our elevators are built using advanced technology, energy-efficient systems, and premium-quality components to ensure smooth performance, maximum safety, and long-term reliability. Every installation is carefully planned to integrate seamlessly into your home's design while maintaining exceptional aesthetics.",
  "Choosing a luxury villa elevator in Hyderabad is also a smart investment in your property's future. Modern homebuyers value features that improve accessibility, convenience, and elegance, making a villa elevator an attractive addition that enhances your property's market value. With customizable cabin interiors, intelligent control systems, advanced safety features, and stylish finishes, today's villa elevators offer the perfect balance of functionality and luxury.",
  "When you choose Kashome Elevators, you partner with a team dedicated to quality, innovation, and customer satisfaction. From free site inspections and personalized consultation to professional installation and reliable after-sales support, we ensure every villa elevator solution in Hyderabad exceeds your expectations. Our mission is to deliver safe, elegant, and future-ready elevator systems that make everyday living more comfortable while adding timeless value to your villa.",
];

const benefitsIntro =
  "Installing a villa elevator in Hyderabad is one of the most valuable upgrades you can make to your luxury home. Beyond adding convenience, a villa elevator enhances accessibility, improves safety, increases property value, and elevates your overall living experience. Whether you own a modern villa, duplex residence, or independent house, a professionally installed elevator provides effortless mobility while blending seamlessly with your home's architecture. At Kashome Elevators, we deliver customized villa elevator installation in Hyderabad that combines advanced technology, elegant design, and reliable performance to meet the expectations of modern homeowners.";

const benefits = [
  {
    title: "Improved Accessibility for Every Family Member",
    content:
      "A villa elevator makes daily life easier for everyone in your home. Senior citizens, children, pregnant women, and individuals with mobility challenges can move comfortably and safely between floors without relying on stairs. It creates a barrier-free living environment and allows every family member to enjoy greater independence.",
  },
  {
    title: "Adds Luxury and Enhances Your Lifestyle",
    content:
      "A premium villa elevator in Hyderabad is more than a transportation system—it's a symbol of modern luxury. With elegant cabin interiors, stylish finishes, panoramic glass options, and smart control systems, a villa elevator enhances the beauty of your home while providing unmatched comfort and sophistication.",
  },
  {
    title: "Increases Property Value",
    content:
      "Installing a villa elevator in Hyderabad significantly boosts your property's market value. Luxury homebuyers prefer villas equipped with premium amenities that improve convenience and accessibility. A professionally installed elevator makes your villa more attractive and future-ready, giving it a competitive advantage in the real estate market.",
  },
  {
    title: "Superior Safety and Peace of Mind",
    content:
      "Every villa elevator installation in Hyderabad by Kashome Elevators includes advanced safety features such as Automatic Rescue Device (ARD), emergency battery backup, door interlock systems, overload protection, emergency alarms, and smooth start-stop technology. These intelligent features ensure a secure and reliable riding experience every day.",
  },
  {
    title: "Convenient Everyday Living",
    content:
      "Moving luggage, groceries, furniture, shopping bags, or household items between floors becomes effortless with a villa elevator. Instead of climbing stairs multiple times a day, you can enjoy smooth and convenient movement throughout your home, saving time and reducing physical strain.",
  },
  {
    title: "Energy-Efficient and Low-Maintenance Operation",
    content:
      "Our luxury villa elevators in Hyderabad are designed using energy-efficient technology that delivers excellent performance while consuming less electricity. Built with premium-quality components, they require minimal maintenance, helping homeowners reduce long-term operating costs without compromising reliability.",
  },
  {
    title: "Fully Customized to Match Your Villa",
    content:
      "Every villa has a unique architectural style, and every homeowner has different preferences. That's why we offer fully customized villa elevator solutions in Hyderabad, allowing you to choose cabin designs, finishes, door styles, lighting, control panels, and other features that perfectly complement your home's interiors and lifestyle.",
  },
  {
    title: "Professional Installation and Reliable After-Sales Support",
    content:
      "Choosing Kashome Elevators means receiving end-to-end support throughout your project. From free site inspection and customized planning to villa elevator installation in Hyderabad, testing, maintenance, and prompt after-sales service, our experienced team ensures your elevator delivers safe, smooth, and dependable performance for years.",
  },
];

const benefitsClosing =
  "Investing in a villa elevator in Hyderabad is a smart decision that combines luxury, convenience, safety, and long-term value. With innovative technology, elegant designs, and expert installation, Kashome Elevators helps you create a modern, accessible, and future-ready villa that offers exceptional comfort for every generation.";

const featuresIntro =
  "At Kashome Elevators, we offer premium villa elevators in Hyderabad that combine luxury, innovation, and advanced engineering to deliver an exceptional living experience. Every elevator is thoughtfully designed to complement the elegance of modern villas while ensuring maximum safety, smooth performance, and long-term reliability. Whether you are building a new luxury villa or upgrading an existing home, our customized villa elevator solutions in Hyderabad are tailored to match your lifestyle, architectural preferences, and mobility requirements.";

const features = [
  {
    title: "Elegant and Premium Cabin Designs",
    content:
      "Our villa elevators are available in a wide range of premium cabin finishes, designer interiors, panoramic glass options, LED lighting, and stylish control panels. Every elevator is customized to blend perfectly with your villa's interior décor while adding a sophisticated and luxurious touch.",
  },
  {
    title: "Advanced Safety Technology",
    content:
      "Safety is built into every villa elevator installation in Hyderabad. Our elevators are equipped with Automatic Rescue Devices (ARD), emergency battery backup, overload protection, door interlock systems, emergency alarm buttons, and smooth start-stop technology to ensure safe and reliable operation for every family member.",
  },
  {
    title: "Smooth, Silent, and Comfortable Ride",
    content:
      "Our advanced drive systems provide vibration-free movement, low noise levels, and gentle acceleration for a comfortable riding experience. The smooth operation enhances daily convenience while maintaining the peaceful environment of your luxury home.",
  },
  {
    title: "Space-Efficient Installation",
    content:
      "Whether your villa has limited installation space or a large dedicated elevator shaft, our engineering team designs customized solutions that maximize available space while minimizing structural modifications during installation.",
  },
  {
    title: "Smart and Energy-Efficient Performance",
    content:
      "Every villa elevator in Hyderabad is designed with energy-efficient technology that reduces power consumption without compromising performance. Smart control systems, automatic operation, and intelligent features make our elevators an ideal choice for modern homes.",
  },
  {
    title: "Durable Construction and Low Maintenance",
    content:
      "Manufactured using premium-quality materials and internationally recognized engineering standards, our villa elevators deliver long-lasting durability with minimal maintenance requirements, ensuring dependable performance for years.",
  },
  {
    title: "Fully Customized Solutions",
    content:
      "Every villa is different, which is why we offer customized cabin sizes, door configurations, premium finishes, intelligent controls, and personalized design options. Our goal is to deliver a villa elevator that perfectly matches your home's architecture and your family's lifestyle.",
  },
];

const featuresClosing =
  "Choosing Kashome Elevators means investing in a premium villa elevator in Hyderabad that offers exceptional comfort, elegant aesthetics, advanced safety, and reliable performance, making your luxury villa more accessible and future-ready.";

const elevatorTypesIntro =
  "Every luxury villa has unique architectural requirements, which is why choosing the right villa elevator in Hyderabad is essential for achieving the perfect balance of functionality, aesthetics, and long-term performance. At Kashome Elevators, we offer a wide range of premium villa elevator solutions designed to suit different home layouts, space availability, and lifestyle preferences. Our experts help homeowners select the ideal elevator system that enhances accessibility while seamlessly integrating with the overall design of the villa.";

const elevatorTypes = [
  {
    title: "Hydraulic Villa Elevators",
    content:
      "Hydraulic villa elevators are known for their smooth performance, excellent load capacity, and reliable operation. They are an ideal choice for low-rise luxury villas where comfort, durability, and long-term performance are the top priorities.",
  },
  {
    title: "Machine Room-Less (MRL) Villa Elevators",
    content:
      "MRL villa elevators eliminate the need for a separate machine room, making them perfect for villas where space optimization is important. They offer energy-efficient operation, modern technology, and an elegant installation without compromising performance.",
  },
  {
    title: "Gearless Villa Elevators",
    content:
      "Gearless elevators are a premium solution for homeowners seeking silent operation, energy efficiency, and superior ride comfort. Their advanced traction technology provides smooth movement while reducing maintenance requirements.",
  },
  {
    title: "Panoramic Glass Villa Elevators",
    content:
      "Panoramic glass elevators add a luxurious visual appeal to modern villas. Featuring elegant glass cabins and contemporary designs, they create a stunning architectural statement while providing uninterrupted views and exceptional riding comfort.",
  },
  {
    title: "Compact Villa Elevators",
    content:
      "Compact villa elevators are specially designed for homes with limited installation space. Their intelligent engineering allows seamless installation with minimal structural changes, making them ideal for both new and existing villas.",
  },
  {
    title: "Customized Villa Elevators",
    content:
      "Every luxury home deserves a personalized solution. Our customized villa elevator solutions in Hyderabad allow homeowners to choose cabin interiors, premium finishes, door styles, safety features, and smart technologies that perfectly match their home's architecture and lifestyle.",
  },
];

const elevatorTypesClosing =
  "Selecting the right villa elevator in Hyderabad is an investment in comfort, convenience, and long-term property value. Kashome Elevators provides expert consultation to help you choose the ideal elevator solution that combines luxury, safety, and reliable performance.";

const solutionsIntro =
  "Kashome Elevators provides complete villa elevator solutions in Hyderabad for homeowners who expect the highest standards of quality, safety, and luxury. From the initial consultation to final installation and ongoing maintenance, we deliver end-to-end elevator solutions that are fully customized to meet the unique requirements of every villa. Our experienced team works closely with homeowners, architects, and builders to ensure every elevator integrates seamlessly into the property's design while providing exceptional comfort and reliability.";

const solutions = [
  {
    title: "Villa Elevators for Luxury Homes",
    content:
      "We design premium villa elevators in Hyderabad that enhance the elegance and functionality of luxury homes. Every elevator is customized to complement modern interiors while delivering smooth, safe, and quiet operation.",
  },
  {
    title: "Villa Elevators for Duplex Villas",
    content:
      "Our customized elevators provide effortless mobility between multiple floors, making duplex villas more accessible and convenient for every family member. The compact and efficient design ensures optimal use of available space.",
  },
  {
    title: "Smart Elevator Solutions",
    content:
      "Our smart villa elevators feature intelligent control systems, automatic rescue devices, digital displays, energy-efficient technology, and advanced safety mechanisms that deliver a modern and user-friendly experience.",
  },
  {
    title: "Space-Saving Elevator Solutions",
    content:
      "For villas with limited installation space, we provide compact elevator systems engineered to maximize functionality while requiring minimal structural modifications. These solutions are ideal for both newly constructed and existing villas.",
  },
  {
    title: "Premium Customization Options",
    content:
      "Every homeowner has different design preferences. We offer customized cabin interiors, luxury finishes, panoramic glass cabins, automatic doors, designer lighting, premium flooring, and personalized control panels to create an elevator that reflects your lifestyle.",
  },
  {
    title: "Professional Installation and Lifetime Support",
    content:
      "Our certified engineers manage every stage of villa elevator installation in Hyderabad, including planning, engineering, installation, testing, commissioning, and preventive maintenance. With responsive after-sales support and regular servicing, we ensure your elevator continues to deliver safe and reliable performance for years.",
  },
];

const solutionsClosing =
  "At Kashome Elevators, our mission is to provide premium villa elevator solutions in Hyderabad that combine advanced technology, elegant design, and world-class safety. Whether you are constructing a new luxury villa or upgrading an existing property, we deliver customized elevator solutions that improve accessibility, increase property value, and elevate your everyday living experience.";

const whyKashomeIntro =
  "Choosing the right company for your villa elevator in Hyderabad is just as important as selecting the elevator itself. At Kashome Elevators, we combine innovation, engineering excellence, and customer-focused service to deliver premium villa elevator solutions that exceed expectations. Our team understands that every luxury villa is unique, which is why we provide customized elevator systems designed to enhance accessibility, safety, comfort, and architectural elegance. From planning and design to installation and long-term maintenance, we are committed to delivering a seamless experience with uncompromising quality.";

const whyKashome = [
  {
    title: "Customized Villa Elevator Solutions",
    content:
      "Every villa has a different layout, design, and lifestyle requirement. We provide fully customized villa elevator solutions in Hyderabad that are tailored to your property's architecture, available space, and interior aesthetics. Our elevators are designed to integrate seamlessly into both modern and traditional luxury villas.",
  },
  {
    title: "Advanced Safety Standards",
    content:
      "Your family's safety is our highest priority. Every villa elevator installation in Hyderabad includes advanced safety features such as Automatic Rescue Device (ARD), emergency battery backup, overload protection, door interlock systems, emergency alarms, and smooth start-stop technology, ensuring secure and dependable operation every day.",
  },
  {
    title: "Premium Quality Engineering",
    content:
      "Our villa elevators are manufactured using premium-quality materials, advanced engineering, and cutting-edge technology. Every component undergoes strict quality inspections to ensure exceptional durability, smooth performance, and long-term reliability.",
  },
  {
    title: "Elegant Designs for Luxury Villas",
    content:
      "We believe a villa elevator should enhance the beauty of your home. That's why we offer premium cabin interiors, panoramic glass options, designer lighting, luxury finishes, and modern control systems that perfectly complement sophisticated villa interiors.",
  },
  {
    title: "Professional Installation by Experts",
    content:
      "Our experienced engineers manage every stage of the villa elevator installation in Hyderabad, including site inspection, planning, installation, testing, and commissioning. We follow industry best practices to ensure every project is completed safely, efficiently, and on schedule.",
  },
  {
    title: "Energy-Efficient Technology",
    content:
      "Our villa elevators are designed with energy-efficient systems that reduce electricity consumption while maintaining outstanding performance. Homeowners benefit from lower operating costs without compromising comfort or safety.",
  },
  {
    title: "Reliable After-Sales Support",
    content:
      "Our commitment continues even after installation. We provide preventive maintenance, regular servicing, prompt technical support, and genuine spare parts to ensure your villa elevator continues operating safely and efficiently for years.",
  },
];

const whyKashomeClosing =
  "Choosing Kashome Elevators means choosing a trusted partner for villa elevator installation in Hyderabad. With customized designs, advanced safety, premium craftsmanship, and dedicated customer support, we deliver elevator solutions that enhance your lifestyle, improve accessibility, and add long-term value to your luxury villa.";

const faqs = [
  {
    question: "What is the cost of installing a villa elevator in Hyderabad?",
    answer:
      "The cost of a villa elevator in Hyderabad depends on factors such as the number of floors, elevator type, cabin size, customization, design preferences, and installation requirements. Kashome Elevators provides customized solutions and transparent pricing based on your specific project.",
  },
  {
    question: "Can a villa elevator be installed in an existing villa?",
    answer:
      "Yes. Our experienced engineers can install a villa elevator in Hyderabad in both newly constructed and existing villas. After a detailed site inspection, we recommend the most suitable elevator solution with minimal structural modifications.",
  },
  {
    question: "Which type of villa elevator is best for luxury homes?",
    answer:
      "The ideal elevator depends on your villa's architecture, available space, and personal preferences. Hydraulic, Machine Room-Less (MRL), gearless, and panoramic glass elevators are among the most popular options for luxury villas.",
  },
  {
    question: "Are villa elevators safe for children and senior citizens?",
    answer:
      "Absolutely. Every villa elevator installation in Hyderabad includes advanced safety features such as Automatic Rescue Device (ARD), emergency battery backup, overload protection, emergency alarms, door interlock systems, and smooth start-stop technology to ensure complete safety.",
  },
  {
    question: "How long does villa elevator installation take?",
    answer:
      "Installation time depends on the elevator type and project requirements. Most villa elevator installations in Hyderabad are completed within a few weeks after design approval and site readiness.",
  },
  {
    question: "Do villa elevators consume a lot of electricity?",
    answer:
      "No. Our modern villa elevators are built with energy-efficient technology that minimizes electricity consumption while delivering smooth, reliable, and high-performance operation.",
  },
  {
    question: "Do villa elevators require regular maintenance?",
    answer:
      "Yes. Regular maintenance is essential for safe operation and long-term reliability. Kashome Elevators provides preventive maintenance, scheduled servicing, and prompt technical support for every installed elevator.",
  },
  {
    question: "Why should I choose Kashome Elevators for a villa elevator in Hyderabad?",
    answer:
      "Kashome Elevators is a trusted provider of villa elevator solutions in Hyderabad, offering customized designs, premium-quality products, expert installation, advanced safety features, transparent pricing, and dependable after-sales support. We are committed to delivering elegant, reliable, and future-ready elevator solutions for luxury villas.",
  },
];

const contactParagraphs = [
  "Looking for a trusted villa elevator in Hyderabad? Kashome Elevators is your reliable partner for premium villa elevator design, installation, and maintenance services. Whether you're building a new luxury villa or upgrading an existing property, our experienced team is ready to help you choose the perfect elevator solution that combines elegance, advanced technology, and exceptional safety.",
  "From free consultation and site inspection to villa elevator installation in Hyderabad, customization, testing, and after-sales support, we provide complete end-to-end solutions tailored to your home's architecture and lifestyle. Our experts carefully assess your requirements and recommend the most suitable elevator system to ensure maximum comfort, accessibility, and long-term performance.",
  "If you have questions about our villa elevator solutions in Hyderabad, pricing, installation process, maintenance services, or customization options, feel free to contact our team. We are committed to delivering transparent communication, timely project execution, and outstanding customer satisfaction.",
];

const contactPoints = [
  "📞 Schedule a Free Consultation with Our Elevator Experts",
  "🏡 Book a Free Site Inspection for Your Villa",
  "💰 Request a Customized Quote Based on Your Requirements",
  "📧 Send Us Your Enquiry and Get a Quick Response",
  "🔧 Speak with Our Experts About Installation, Design, or Maintenance",
];

const contactClosing =
  "Upgrade your luxury home with a premium villa elevator in Hyderabad from Kashome Elevators. Contact us today and let our specialists help you create a safer, smarter, and more elegant living experience with customized elevator solutions built to last.";

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
  name: "Villa Elevator in Hyderabad",
  description:
    "Upgrade your villa with premium villa elevators in Hyderabad. Kashome Elevators offers safe, stylish, and customized villa elevator installation for luxury homes.",
  provider: {
    "@type": "LocalBusiness",
    name: "Kashome Elevators",
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
  name: "Villa Elevator in Hyderabad",
  url: pageUrl,
  description:
    "Upgrade your villa with premium villa elevators in Hyderabad. Kashome Elevators offers safe, stylish, and customized villa elevator installation for luxury homes.",
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
      name: "Villa Elevator in Hyderabad",
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

export default function VillaElevatorHyderabadPage() {
  const linkSeoKeywords = createSeoLinker(currentPageHref);

  return (
    <div className="min-h-screen bg-green-50">
      <Navigation />

      <main>
        <section className="relative pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.12),_transparent_45%)]" />
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 lg:mb-10 max-w-4xl">
              Villa Elevator in Hyderabad
            </h1>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              <div className="lg:col-span-7 space-y-5 text-base sm:text-lg text-slate-100 leading-relaxed">
                <p>
                  {linkSeoKeywords(heroParagraphs[0])}
                </p>
                <p>
                  {linkSeoKeywords(heroParagraphs[1])}
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
                  {linkSeoKeywords(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Why Choose a Villa Elevator in Hyderabad?
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
              Benefits of Installing a Villa Elevator
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(benefitsIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {benefits.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold">{item.title}</h3>
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
              Features of Our Villa Elevators
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(featuresIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {features.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold">{item.title}</h3>
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

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Types of Villa Elevators
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(elevatorTypesIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {elevatorTypes.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold">{item.title}</h3>
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

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Villa Elevator Solutions
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(solutionsIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {solutions.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold">{item.title}</h3>
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
              Why Choose Kashome Elevators?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              {linkSeoKeywords(whyKashomeIntro)}
            </p>
            <ul className="space-y-6 list-disc pl-6">
              {whyKashome.map((item) => (
                <li key={item.title} className="text-gray-700 leading-relaxed">
                  <h3 className="text-gray-900 font-bold">{item.title}</h3>
                  <p className="mt-2">
                    {linkSeoKeywords(item.content)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-gray-700 leading-relaxed mt-8">
              {linkSeoKeywords(whyKashomeClosing)}
            </p>
          </div>
        </section>

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
