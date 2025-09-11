"use client";

import React from "react";
import { motion } from "motion/react";
import { Bot } from "lucide-react";
import ShinyText from "../ui/shiny-text";
import { useChat } from "@/hooks/use-chat";

const ThinkingIndicator = React.memo(() => {
	const { thinkingPlaceholder } = useChat();
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3 }}
			className="flex gap-4 max-w-4xl mx-auto justify-start"
		>
			<div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center shadow-sm">
				<motion.div>
					<Bot className="w-5 h-5 text-primary" />
				</motion.div>
			</div>

			<div className="bg-muted/50 border border-border/50 rounded-2xl rounded-bl-md px-5 py-4 shadow-lg backdrop-blur-sm">
				<div className="flex items-center space-x-3">
					<ShinyText
						text={thinkingPlaceholder}
						disabled={false}
						speed={5}
					/>
				</div>
			</div>
		</motion.div>
	);
});
ThinkingIndicator.displayName = "ThinkingIndicator";

export default ThinkingIndicator;
