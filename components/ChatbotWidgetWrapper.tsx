"use client";

import { usePathname } from "next/navigation";
import ChatbotWidget from "./ChatbotWidget";

/**
 * Renders the chatbot only on public pages (home, about, contact, products, services, etc.).
 * Hides it on admin panel, dashboard, login, signup, and any /dashboard/* routes.
 */
export default function ChatbotWidgetWrapper() {
  const pathname = usePathname() ?? "";

  // Don't show chatbot on dashboard/admin or auth panels
  const isPanel =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  if (isPanel) return null;

  return <ChatbotWidget />;
}
