import React, { useState } from "react";
import { Button } from "./button";
import { MessageSquare, X, Send } from "lucide-react";
import { Card } from "./card";
import { Input } from "./input";
import { ScrollArea } from "./scroll-area";
import { LottieAnimation } from "./lottie-animation";
import loadingAnimation from "@/lib/lotties/loading.json";
import chatbotAnimation from "@/lib/lotties/chatbot.json";

interface Message {
  text: string;
  isUser: boolean;
}

const parseMarkdown = (text: string): React.ReactNode => {
  // Handle headers
  if (text.startsWith("# ")) {
    return (
      <h1 className="text-2xl font-bold">{parseMarkdown(text.slice(2))}</h1>
    );
  }
  if (text.startsWith("## ")) {
    return (
      <h2 className="text-xl font-bold">{parseMarkdown(text.slice(3))}</h2>
    );
  }
  if (text.startsWith("### ")) {
    return (
      <h3 className="text-lg font-bold">{parseMarkdown(text.slice(4))}</h3>
    );
  }

  // Handle bold text with ** or __
  return text.split(/(\*\*.*?\*\*|__.*?__)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export function ChatAssistant() {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I help you today?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    setIsLoading(true); // Set loading to true

    try {
      const response = await fetch("https://agents-9rvt.onrender.com/aiia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          thread_id: null, // The API will generate a thread_id if not provided
        }),
      });

      const data = await response.json();

      // Add assistant response
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false); // Set loading to false after request completes
    }

    setInput("");
  };
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <Card className="w-[90vw] md:w-[300px] lg:w-[480px] h-[60vh] flex flex-col shadow-lg">
          <div className="p-3 border-b flex justify-between items-center bg-primary text-primary-foreground">
            <h3 className="font-semibold flex items-center">
              <div className="w-14 h-14 mr-2">
                <LottieAnimation animationData={chatbotAnimation} />
              </div>
              <span> AIIA Assistant </span>
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.text.split("\n").map((line, i) => {
                      // Handle bullet points
                      if (line.startsWith("* ")) {
                        return (
                          <div key={i} className="ml-4">
                            • {parseMarkdown(line.substring(2))}
                          </div>
                        );
                      }
                      // Handle numbered lists
                      if (/^\d+\.\s/.test(line)) {
                        return (
                          <div key={i} className="ml-4">
                            {parseMarkdown(line)}
                          </div>
                        );
                      }
                      return <div key={i}>{parseMarkdown(line)}</div>;
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="w-12 h-12">
                    <LottieAnimation animationData={loadingAnimation} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 shadow-lg p-0 overflow-hidden"
        >
          <LottieAnimation
            animationData={chatbotAnimation}
            className="w-full h-full"
          />
        </Button>
      )}
    </div>
  );
}
