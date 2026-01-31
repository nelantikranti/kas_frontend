import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KAS CRM - Elevator Management System",
  description: "Comprehensive CRM for KAS Elevator sales, projects & AMC management",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/kas img.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/kas img.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}






















