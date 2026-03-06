"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage } from "@/lib/chatApi";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";

function getMockBotResponse(userText: string): string {
  const t = userText.toLowerCase();
  if (t.includes("price") || t.includes("cost"))
    return "Our elevator prices vary by model and configuration. For a detailed quote, please visit our Contact page or request a callback. We offer home elevators, passenger elevators, and custom solutions.";
  if (t.includes("product") || t.includes("elevator") || t.includes("lift"))
    return "We offer a range of elevators: Home elevators (gearless, machine-room-less), Passenger elevators with modern touchscreen panels, and custom solutions. You can explore our Products section for more details.";
  if (t.includes("contact") || t.includes("call"))
    return "You can reach us via the Contact page on this website. We're here to help with enquiries, quotations, and support.";
  if (t.includes("hello") || t.includes("hi") || t.includes("hey"))
    return "Hello! Welcome to KAS Elevators. How can I help you today? Ask about our products, pricing, or support.";
  return "Thanks for your message. For specific enquiries about our elevators, pricing, or support, our team will get back to you. You can also use the Contact page for a quick response.";
}

/** True if current page is a public (home) page — redirect only on these, not on dashboard/login/signup. */
function isPublicPage(pathname: string): boolean {
  return (
    !pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/signup")
  );
}

export default function ChatbotWidget() {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { id: string; role: "user" | "bot"; content: string }[]
  >([]);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    requestAnimationFrame(() => {
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  useEffect(() => {
    if (chatMessages.length > 0 || isBotThinking) scrollChatToBottom();
  }, [chatMessages, isBotThinking]);

  const handleSendMessage = async () => {
    const text = chatMessage.trim();
    if (!text || isBotThinking) return;
    const id = Date.now().toString();
    setChatMessages((prev) => [...prev, { id, role: "user", content: text }]);
    setChatMessage("");
    setIsBotThinking(true);
    const minThinkingMs = 600;
    const start = Date.now();
    let botContent: string;
    let redirectTo: string | null = null;
    try {
      const result = await sendChatMessage(text);
      botContent = result.response || getMockBotResponse(text);
      redirectTo = result.redirect_to ?? null;
    } catch {
      botContent = getMockBotResponse(text);
    }
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minThinkingMs - elapsed);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    setChatMessages((prev) => [
      ...prev,
      { id: id + "-bot", role: "bot", content: botContent },
    ]);
    setIsBotThinking(false);
    if (redirectTo && isPublicPage(pathname)) {
      setTimeout(() => router.push(redirectTo), 1200);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[340px] sm:w-[380px] rounded-2xl shadow-2xl border border-green-300 bg-white overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white shrink-0">
              <span className="font-semibold">Chat with us</span>
              <button
                onClick={() => setChatbotOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Close chat"
              >
                <IoClose className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0 p-4 flex flex-col bg-green-50">
              <div
                ref={chatScrollRef}
                className="flex-1 min-h-[320px] max-h-[380px] overflow-y-auto flex flex-col gap-3 py-1"
              >
                {chatMessages.length === 0 && !isBotThinking && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-600 min-h-[280px]">
                    <IoChatbubbleEllipses className="w-12 h-12 text-green-600 mb-3 shrink-0" />
                    <p className="text-sm font-medium">
                      Hi! How can we help you today?
                    </p>
                    <p className="text-xs mt-2 text-gray-500">
                      Ask about elevators, products, pricing, or support.
                    </p>
                  </div>
                )}
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-green-600 to-green-700 text-white rounded-br-md"
                          : "bg-white text-gray-800 border border-green-200 rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isBotThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-green-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 text-xs font-medium">
                          Thinking
                        </span>
                        <span className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-2 h-2 rounded-full bg-green-500"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="flex gap-2 pt-3 shrink-0 border-t border-green-200">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-green-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  disabled={isBotThinking}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isBotThinking}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <IoSend className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setChatbotOpen((prev) => !prev)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white shadow-lg hover:from-green-500 hover:to-green-600 flex items-center justify-center transition-colors"
        aria-label={chatbotOpen ? "Close chatbot" : "Open chatbot"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoChatbubbleEllipses className="w-7 h-7" />
      </motion.button>
    </div>
  );
}
