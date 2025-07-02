import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LottieAnimation } from "@/components/ui/lottie-animation";
import { Send, Bot, User, Plus, Menu, Home, MessageSquare } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import loadingAnimation from "@/lib/lotties/loading.json";
import chatbotAnimation from "@/lib/lotties/chatbot.json";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastActive: Date;
}

const parseMarkdown = (text: string): React.ReactNode => {
  const lines = text.split("\n");

  return lines.map((line, lineIndex) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={lineIndex} className="text-lg font-bold mb-2 mt-4">
          {line.slice(4)}
        </h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={lineIndex} className="text-xl font-bold mb-2 mt-4">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("# ")) {
      return (
        <h1 key={lineIndex} className="text-2xl font-bold mb-2 mt-4">
          {line.slice(2)}
        </h1>
      );
    }

    if (line.trim() === "") {
      return <br key={lineIndex} />;
    }

    const formattedLine = line
      .split(/(\*\*.*?\*\*|__.*?__)/g)
      .map((part, partIndex) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("__") && part.endsWith("__")) {
          return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

    return (
      <p key={lineIndex} className="mb-2">
        {formattedLine}
      </p>
    );
  });
};

const SidebarContent = ({
  conversations,
  currentConversationId,
  setCurrentConversationId,
  createNewConversation,
  closeSidebar,
}: {
  conversations: Conversation[];
  currentConversationId: string | null;
  setCurrentConversationId: (id: string) => void;
  createNewConversation: () => void;
  closeSidebar?: () => void;
}) => (
  <>
    <div className="p-4 border-b">
      <Button
        onClick={() => {
          createNewConversation();
          closeSidebar?.();
        }}
        className="w-full justify-start gap-2"
        variant="outline"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </Button>
    </div>

    <ScrollArea className="flex-1">
      <div className="p-2">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs">Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={
                currentConversationId === conversation.id
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start mb-1 h-auto p-3 text-left"
              onClick={() => {
                setCurrentConversationId(conversation.id);
                closeSidebar?.();
              }}
            >
              <div className="truncate w-full">
                <div className="font-medium truncate">{conversation.title}</div>
                <div className="text-xs text-muted-foreground">
                  {conversation.messages.length} message
                  {conversation.messages.length !== 1 ? "s" : ""}
                </div>
              </div>
            </Button>
          ))
        )}
      </div>
    </ScrollArea>
  </>
);

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const currentConversation = conversations.find(
    (c) => c.id === currentConversationId,
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentConversationId]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      if (currentConversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId
              ? {
                  ...conv,
                  messages: [
                    ...conv.messages,
                    {
                      id: `msg-${Date.now()}-bot`,
                      text: data.response,
                      isUser: false,
                      timestamp: new Date(),
                    },
                  ],
                  lastActive: new Date(),
                }
              : conv,
          ),
        );
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    },
  });

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: "New Conversation",
      messages: [],
      lastActive: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    let conversationId = currentConversationId;

    if (!conversationId) {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        messages: [],
        lastActive: new Date(),
      };
      setConversations((prev) => [newConversation, ...prev]);
      conversationId = newConversation.id;
      setCurrentConversationId(conversationId);
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              title:
                conv.messages.length === 0
                  ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
                  : conv.title,
              lastActive: new Date(),
            }
          : conv,
      ),
    );

    const messageText = input;
    setInput("");
    chatMutation.mutate(messageText);
  };

  return (
    <div className="fixed inset-0 flex bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-80 bg-card border-r flex-shrink-0 flex flex-col">
          <SidebarContent
            conversations={conversations}
            currentConversationId={currentConversationId}
            setCurrentConversationId={setCurrentConversationId}
            createNewConversation={createNewConversation}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b p-3 md:p-4 flex items-center gap-3 flex-shrink-0">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <h2 className="font-semibold">Conversations</h2>
                  </div>
                  <SidebarContent
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    setCurrentConversationId={setCurrentConversationId}
                    createNewConversation={createNewConversation}
                    closeSidebar={() => setSidebarOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 flex-shrink-0">
              <LottieAnimation animationData={chatbotAnimation} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm md:text-base truncate">
                AIIA Assistant
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                AI Institute Africa's helpful assistant
              </p>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <Home className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Home</span>
            </Button>
          </Link>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-3 md:p-4">
            {!currentConversation ||
            currentConversation.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-4">
                <div className="w-12 h-12 md:w-16 md:h-16 mb-4">
                  <LottieAnimation animationData={chatbotAnimation} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  Welcome to AIIA Assistant
                </h2>
                <p className="text-muted-foreground mb-6 text-sm md:text-base">
                  I'm here to help you with information about AI Institute
                  Africa's programs, courses, events, and initiatives. Ask me
                  anything!
                </p>
                <div className="grid grid-cols-1 gap-3 w-full max-w-lg">
                  {[
                    "What programs does AIIA offer?",
                    "How can I become a member?",
                    "Tell me about upcoming events",
                    "What is AI Institute Africa's mission?",
                  ].map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-3 whitespace-normal text-sm"
                      onClick={() => setInput(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 pb-4">
                {currentConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 md:gap-3 ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!message.isUser && (
                      <div className="w-6 h-6 md:w-8 md:h-8 mt-1 flex-shrink-0">
                        <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                          <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}

                    <Card
                      className={`max-w-[85%] md:max-w-[80%] ${
                        message.isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="p-3 md:p-4">
                        <div className="prose prose-sm dark:prose-invert">
                          {message.isUser
                            ? message.text
                            : parseMarkdown(message.text)}
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </Card>

                    {message.isUser && (
                      <div className="w-6 h-6 md:w-8 md:h-8 mt-1 flex-shrink-0">
                        <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 md:h-4 md:w-4 text-secondary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {chatMutation.isPending && (
                  <div className="flex gap-2 md:gap-3 justify-start">
                    <div className="w-6 h-6 md:w-8 md:h-8 mt-1">
                      <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 md:h-4 md:w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <Card className="bg-muted">
                      <div className="p-3 md:p-4">
                        <div className="w-6 h-6 md:w-8 md:h-8">
                          <LottieAnimation animationData={loadingAnimation} />
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t p-3 md:p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 md:gap-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 text-sm md:text-base"
                disabled={chatMutation.isPending}
              />
              <Button
                type="submit"
                disabled={!input.trim() || chatMutation.isPending}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AIIA Assistant can make mistakes. Please verify important
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
