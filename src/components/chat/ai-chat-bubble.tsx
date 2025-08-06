"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Minus, SendHorizontal, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const conversationStarters = [
  "Tell me about your services",
  "Show me case studies", 
  "Schedule a consultation",
];

const AIChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Progress bar state
  const [progress, setProgress] = useState(0);
  const [showBookCall, setShowBookCall] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Progress bar effect when AI is typing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTyping) {
      setProgress(0);
      setShowBookCall(false);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) {
            // Progress increases faster before 60%, then slows down
            if (prev < 60) return prev + 2.5;
            if (prev < 95) return prev + 1.2;
            return prev + 0.5;
          }
          return 100;
        });
      }, 30);
    } else {
      setProgress(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTyping]);

  // Show "Book a Call" when progress passes 60%
  useEffect(() => {
    if (progress >= 60 && !showBookCall) {
      setShowBookCall(true);
    }
    if (progress < 60 && showBookCall) {
      setShowBookCall(false);
    }
  }, [progress, showBookCall]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: crypto.randomUUID(),
            role: "ai",
            content: "Hi! I\'m your AI assistant. How can I help you today?",
          },
        ]);
        setIsTyping(false);
      }, 1200);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSendMessage = async (e: FormEvent<HTMLFormElement> | string) => {
    if (typeof e !== "string") {
      e.preventDefault();
    }
    
    const content = typeof e === "string" ? e : inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: "ai",
        content: `I\'ve received your message: "${content}". As a demo assistant, I\'m still learning but am here to help with your queries!`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 h-[70vh] sm:h-[480px] z-50 flex flex-col bg-card border border-border rounded-lg shadow-2xl font-body"
            style={{ transformOrigin: "bottom right" }}
          >
            <header className="flex items-center justify-between p-4 border-b border-border bg-card rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-8 h-8 text-primary" />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                </div>
                <h3 className="text-base font-semibold text-text-primary">AI Assistant</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={handleToggle} aria-label="Minimize chat">
                <Minus className="w-5 h-5 text-muted-foreground" />
              </Button>
            </header>

            {/* Progress bar */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 8 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full px-4 pt-2"
                >
                  <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-2 bg-gradient-to-r from-primary to-primary/70 rounded-full"
                      style={{ width: `${progress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isTyping && <TypingIndicator />}

              {messages.length === 1 && !isTyping && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-3 text-center">Or, you can start with...</p>
                  <div className="flex flex-col items-center gap-2">
                    {conversationStarters.map((starter) => (
                      <Button
                        key={starter}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start h-auto py-2"
                        onClick={() => handleSendMessage(starter)}
                      >
                        {starter}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Book a Call button appears after 60% progress */}
              <AnimatePresence>
                {showBookCall && isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex justify-center mt-4"
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
                      onClick={() => window.open("https://cal.com/", "_blank")}
                    >
                      <Calendar className="w-5 h-5" />
                      Book a Call
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <footer className="p-4 border-t border-border bg-card rounded-b-lg flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-input"
                  aria-label="Chat input"
                />
                <Button type="submit" size="icon" disabled={!inputValue.trim()} aria-label="Send message">
                  <SendHorizontal className="w-5 h-5" />
                </Button>
              </form>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[60px] h-[60px] rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 z-50"
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      > 
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "minus" : "bot"}
            initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 500, damping: 25, duration: 0.2 }}
          >
            {isOpen ? <Minus className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </>
  );
};

const MessageBubble = ({ message }: { message: Message }) => {
  const isAi = message.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-end gap-2 w-full", !isAi && "justify-end")}
    >
      {isAi && (
        <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      <div className={cn(
        "px-3.5 py-2.5 rounded-2xl max-w-[85%] sm:max-w-[80%] text-sm leading-relaxed",
        isAi 
          ? "bg-secondary text-text-primary rounded-bl-sm"
          : "bg-primary text-primary-foreground rounded-br-sm"
      )}>
        <p>{message.content}</p>
      </div>
    </motion.div>
  );
};

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex items-end gap-2"
  >
    <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
      <Bot className="w-5 h-5 text-primary" />
    </div>
    <div className="flex items-center space-x-1.5 px-3.5 py-[1.125rem] bg-secondary rounded-2xl rounded-bl-sm">
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      />
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
      />
      <motion.span
        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
    </div>
  </motion.div>
);

export default AIChatBubble;