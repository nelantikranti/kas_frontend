/**
 * Chatbot API client – sends user messages to the AI_service backend
 * and returns the bot response. Used by the home page chatbot UI.
 */

const getChatApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_AI_CHAT_URL || "http://localhost:8000";
  }
  return process.env.NEXT_PUBLIC_AI_CHAT_URL || "http://localhost:8000";
};

export interface ChatResponse {
  response: string;
}

/**
 * Send a user message to the chatbot API and return the bot's response.
 * @param message – The user's message text
 * @returns The bot's reply string
 * @throws On network error or non-OK response (caller can fall back to mock/local response)
 */
export async function sendChatMessage(message: string): Promise<string> {
  const baseUrl = getChatApiBaseUrl();
  const res = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message.trim() }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Chat API error ${res.status}: ${errText || res.statusText}`);
  }

  const data: ChatResponse = await res.json();
  return typeof data?.response === "string" ? data.response : "";
}
