"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./chain-labs-hero";
import { Bot, User } from "lucide-react";

// Memoized components to prevent unnecessary re-renders
const ChatBubble = React.memo(({ message }: { message: ChatMessage }) => {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "flex gap-3 max-w-4xl mx-auto",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4 text-primary" />
                </div>
            )}

            <div
                className={cn(
                    "max-w-[80%] rounded-xl px-4 py-3 shadow-sm backdrop-blur-sm",
                    isUser
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
                        : "bg-muted/50 border border-border/50 rounded-bl-sm"
                )}
            >
                <p
                    className={cn(
                        "text-sm leading-relaxed",
                        isUser ? "text-primary-foreground" : "text-foreground"
                    )}
                >
                    {message.content}
                </p>
            </div>

            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-primary-foreground" />
                </div>
            )}
        </motion.div>
    );
});
ChatBubble.displayName = "ChatBubble";

export default ChatBubble;