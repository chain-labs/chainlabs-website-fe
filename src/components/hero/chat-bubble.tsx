"use client";

import React, { useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { ChatMessage } from "@/global-store";
import TextGenerateEffect from "../ui/text-generate-effect";

// Memoized components to prevent unnecessary re-renders
const ChatBubble = React.memo(({ message, isLatest }: { message: ChatMessage, isLatest: boolean }) => {
	const isUser = message.role === "user";
	const hasAnimated = React.useRef(false);
	const [shouldAnimate, setShouldAnimate] = React.useState(false);

	// Only animate if this is the latest assistant message and hasn't animated yet
	useEffect(() => {
		if (!isUser && isLatest && !hasAnimated.current) {
			setShouldAnimate(true);
			hasAnimated.current = true;
		}
	}, [isUser, isLatest]);
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
						"text-sm leading-relaxed w-full break-words whitespace-pre-wrap",
						isUser ? "text-primary-foreground" : "text-foreground"
					)}
				>
					{isUser ? (
						message.message
					) : shouldAnimate ? (
						<TextGenerateEffect text={message.message} />
					) : (
						message.message
					)}
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
