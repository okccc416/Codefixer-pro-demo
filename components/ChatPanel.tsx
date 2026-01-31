"use client";

import { useState } from "react";
import { useIDEStore } from "@/store/useIDEStore";
import { useApiKeyValidation } from "@/hooks/useApiKeyValidation";
import { chatWithAI } from "@/lib/apiClient";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function ChatPanel() {
  const { toggleChat, apiProvider } = useIDEStore();
  const { validateApiKey, getApiKey } = useApiKeyValidation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI coding assistant. I can help you with code, answer questions, and provide suggestions. Configure your API key in Settings to get started!",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Validate API key before sending
    if (!validateApiKey("AI chat")) {
      return;
    }

    const apiKey = getApiKey();
    if (!apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call AI API (this would be your backend endpoint)
      const response = await chatWithAI(
        input,
        messages.map(m => ({ role: m.role, content: m.content })),
        apiKey,
        apiProvider
      );

      if (response.success && response.data) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.response,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Show error toast
        toast({
          title: "Chat Error",
          description: response.error || "Failed to get AI response",
          variant: "destructive",
        });
        
        // Add fallback message
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${response.error || "Unknown error"}. This is a demo environment - in production, your API key would connect directly to ${apiProvider === "openai" ? "OpenAI" : "Anthropic"} servers.`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#09090b] border-l border-zinc-800">
      {/* Header */}
      <div className="panel-header justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} />
          <span>AI ASSISTANT</span>
        </div>
        <button
          onClick={toggleChat}
          className="hover:bg-zinc-700 rounded p-1 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === "user"
                  ? "bg-blue-600"
                  : "bg-purple-600"
              }`}
            >
              {message.role === "user" ? (
                <User size={16} />
              ) : (
                <Bot size={16} />
              )}
            </div>
            <div
              className={`flex-1 rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-600/20 border border-blue-600/30"
                  : "bg-zinc-800/50 border border-zinc-700"
              }`}
            >
              <p className="text-sm text-zinc-100 whitespace-pre-wrap">
                {message.content}
              </p>
              <p className="text-xs text-zinc-500 mt-2">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your code..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg px-4 py-2 transition-colors"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
