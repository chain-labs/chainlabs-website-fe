"use client";

import React, {
	useState,
	KeyboardEvent,
	FormEvent,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Mic,
	ArrowRight,
	Sparkles,
	Bot,
	User,
	Globe,
	Zap,
	Blocks,
	Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChatBubble from "./chat-bubble";
import ThinkingIndicator from "./think-indicator";
import InputContainer from "./input-container";
import RecordingStatus from "./recording-status";

export interface ChatMessage {
	id: string;
	role: "user" | "ai";
	content: string;
	timestamp: Date;
}

interface ChainLabsHeroProps {
	isFullscreen?: boolean;
}

// Move outside component to prevent recreation on every render
const AI_RESPONSES = [
	"I understand your business needs! Based on your requirements, I'll create a custom website design with AI-powered features. Let me analyze your industry and suggest the perfect layout, functionality, and blockchain integrations.",
	"Excellent! I'm processing your website requirements using our AI algorithms. I can build you a modern, responsive site with smart automation, personalized user experiences, and blockchain-powered features tailored to your business.",
	"Perfect! Our AI is analyzing your business model and target audience. I'll create a comprehensive website solution with intelligent features, automated workflows, and blockchain integrations that will help scale your business.",
	"Great input! I'm using our proprietary AI to design your website architecture. This will include smart user interfaces, automated business processes, and blockchain security features that align with your goals.",
	"Fantastic! Let me leverage our AI and blockchain expertise to build your ideal website. I'll create a solution with intelligent automation, personalized user journeys, and cutting-edge technology integrations.",
];

const WEBSITE_BUILDING_FEATURES = [
	{ icon: Globe, text: "AI-Powered Design" },
	{ icon: Zap, text: "Smart Automation" },
	{ icon: Blocks, text: "Blockchain Integration" },
	{ icon: Code2, text: "Custom Development" },
];

const ChainLabsHero = ({ isFullscreen = false }: ChainLabsHeroProps) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [isRecording, setIsRecording] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const [isThinking, setIsThinking] = useState<boolean>(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Memoize expensive calculations
	const hasMessages = messages.length > 0;
	const hasInputValue = inputValue.trim().length > 0;

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (hasMessages || isThinking) {
			scrollToBottom();
		}
	}, [hasMessages, isThinking, scrollToBottom]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.code === "Space" && inputValue.trim() === "") {
				e.preventDefault();
				setIsRecording((prev) => !prev);
			}
		},
		[inputValue]
	);

	const toggleRecording = useCallback(() => {
		setIsRecording((prev) => {
			const newValue = !prev;
			console.log(
				newValue ? "Recording started..." : "Recording stopped."
			);
			return newValue;
		});
	}, []);

	const simulateAIResponse = useCallback((query: string): string => {
		return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
	}, []);

	const handleSubmit = useCallback(
		async (e: FormEvent) => {
			e.preventDefault();
			const trimmedInput = inputValue.trim();

			if (trimmedInput) {
				const userMessage: ChatMessage = {
					id: crypto.randomUUID(),
					role: "user",
					content: trimmedInput,
					timestamp: new Date(),
				};

				setMessages((prev) => [...prev, userMessage]);
				setInputValue("");
				setIsThinking(true);

				// Simulate AI processing time (2-4 seconds)
				const thinkingTime = Math.random() * 2000 + 2000;

				setTimeout(() => {
					const aiMessage: ChatMessage = {
						id: crypto.randomUUID(),
						role: "ai",
						content: simulateAIResponse(trimmedInput),
						timestamp: new Date(),
					};

					setMessages((prev) => [...prev, aiMessage]);
					setIsThinking(false);
				}, thinkingTime);
			}
		},
		[inputValue, simulateAIResponse]
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setInputValue(e.target.value);
		},
		[]
	);

	const handleFocus = useCallback(() => setIsFocused(true), []);
	const handleBlur = useCallback(() => setIsFocused(false), []);

	return (
		<section className="relative min-h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
			{/* Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Main spherical gradient */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1.2, ease: "easeOut" }}
					className="absolute left-1/2 top-[15%] size-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/15 via-primary/25 to-primary/35 blur-3xl"
				/>

				{/* Secondary accent orbs */}
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
					className="absolute left-[10%] top-[60%] size-24 rounded-full bg-gradient-to-r from-primary/8 to-transparent blur-2xl"
				/>

				<motion.div
					initial={{ opacity: 0, x: 100 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
					className="absolute right-[15%] top-[25%] size-20 rounded-full bg-gradient-to-l from-primary/12 to-transparent blur-xl"
				/>

				{/* Grid pattern overlay */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_1px,hsl(var(--muted))_1px)] bg-[length:40px_40px] opacity-[0.015]" />

				{/* Floating code elements - only show when no messages */}
				{!hasMessages && (
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 0.08, y: 0 }}
							transition={{
								duration: 2,
								ease: "easeOut",
								delay: 1,
							}}
							className="absolute left-[15%] top-[35%] font-mono text-xs text-primary"
						>
							{"<Website />"}
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 0.08, y: 0 }}
							transition={{
								duration: 2,
								ease: "easeOut",
								delay: 1.5,
							}}
							className="absolute right-[20%] top-[30%] font-mono text-xs text-primary"
						>
							{"function buildSite() {"}
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							animate={{ opacity: 0.08, x: 0 }}
							transition={{
								duration: 2,
								ease: "easeOut",
								delay: 2,
							}}
							className="absolute left-[12%] bottom-[35%] font-mono text-xs text-primary"
						>
							{"AI.analyze(requirements)"}
						</motion.div>
					</div>
				)}
			</div>

			{/* Main Content */}
			<div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full">
				{/* Header spacing */}
				<div className="h-12 md:h-16" />

				{/* Content Container */}
				<div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8">
					<div className="w-full max-w-4xl mx-auto flex flex-col">
						{/* Hero Text - Only show when no messages */}
						<AnimatePresence mode="wait">
							{!hasMessages && (
								<motion.div
									key="hero-text"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{
										duration: 0.6,
										ease: "easeOut",
									}}
									className="text-center mb-8 md:mb-12"
								>
									<motion.div
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.7,
											ease: "easeOut",
											delay: 0.2,
										}}
										className="flex items-center justify-center gap-2 mb-4"
									>
										<Sparkles className="w-4 h-4 text-primary" />
										<span className="text-sm font-medium text-muted-foreground">
											AI-Powered Website Builder
										</span>
									</motion.div>

									<motion.h1
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.7,
											ease: "easeOut",
											delay: 0.3,
										}}
										className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight"
									>
										Build Your{" "}
										<span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
											Dream Website
										</span>
									</motion.h1>

									<motion.p
										initial={{ opacity: 0, y: 15 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.7,
											ease: "easeOut",
											delay: 0.4,
										}}
										className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
									>
										Tell our AI about your business and
										watch it create a custom website with
										smart automation and blockchain
										integration.
									</motion.p>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Chat Messages */}
						<AnimatePresence>
							{hasMessages && (
								<motion.div
									key="chat-messages"
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{
										duration: 0.5,
										ease: "easeOut",
									}}
									className="flex-1 mb-6"
								>
									<div className="max-h-[55vh] overflow-y-auto space-y-4 px-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
										{messages.map((message) => (
											<ChatBubble
												key={message.id}
												message={message}
											/>
										))}

										{/* Thinking indicator */}
										<AnimatePresence>
											{isThinking && (
												<ThinkingIndicator />
											)}
										</AnimatePresence>

										<div ref={messagesEndRef} />
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Input Form */}
						<AnimatePresence mode="wait">
							{!isThinking && (
								<motion.div
									key="input-section"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{
										duration: 0.4,
										ease: "easeOut",
									}}
									className="w-full"
								>
									<form
										onSubmit={handleSubmit}
										className="space-y-4"
									>
										<InputContainer
											inputValue={inputValue}
											isFocused={isFocused}
											isRecording={isRecording}
											hasMessages={hasMessages}
											onInputChange={handleInputChange}
											onKeyDown={handleKeyDown}
											onFocus={handleFocus}
											onBlur={handleBlur}
											onToggleRecording={toggleRecording}
											onSubmit={() =>
												handleSubmit({} as FormEvent)
											}
										/>

										<div className="flex flex-col sm:flex-row items-center justify-between gap-3">
											<RecordingStatus
												isRecording={isRecording}
											/>
										</div>
									</form>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>

				{/* Footer spacing */}
				<div className="h-8 md:h-12" />
			</div>
		</section>
	);
};

export default ChainLabsHero;
