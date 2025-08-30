"use client";
import React, { useState, useEffect, useMemo } from "react";
import Vapi from "@vapi-ai/web";
import { buildPersonalizationText } from "@/lib/vapi";
import { useGlobalStore } from "@/global-store";

const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY || "";
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "";

export default function VapiSection() {
	const [vapi, setVapi] = useState<Vapi | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [transcript, setTranscript] = useState<
		Array<{ role: string; text: string }>
	>([]);
	const personalizedContent = buildPersonalizationText(
		useGlobalStore((s) => s.personalised)
	);

	// Compose an optimized voice-oriented system prompt using personalization
	const voiceSystemPrompt = useMemo(() => {
		return `You are ChainLabs Voice Assistant — a helpful, friendly AI consultant for website visitors.

Goals
- Understand the user's business goals and constraints.
- Offer clear, practical next steps tailored to their context.
- Keep responses concise for voice: 1–3 short sentences or a 3-point list.

Voice Guidelines
- Speak clearly and naturally; avoid long monologues.
- If user interrupts, adapt and finish the most relevant point.
- Convert links, numbers, and jargon into listener-friendly descriptions.

When Navigating
- If the user asks to view a section (e.g., testimonials), reply briefly like: "Sure — showing testimonials now." The UI handles scrolling/navigation.

If Uncertain
- Be honest. Offer a short suggestion for how to proceed.

Personalization Context
${personalizedContent || "(No personalization provided)"}

Response Pattern
- Brief acknowledgement → direct answer → 1–2 suggested next steps.
- Prefer numbered lists when listing options.
`;
	}, [personalizedContent]);
	useEffect(() => {
		const vapiInstance = new Vapi(apiKey);
		setVapi(vapiInstance);
		// Event listeners
		vapiInstance.on("call-start", () => {
			console.log("Call started");
			setIsConnected(true);
		});
		vapiInstance.on("call-end", () => {
			console.log("Call ended");
			setIsConnected(false);
			setIsSpeaking(false);
		});
		vapiInstance.on("speech-start", () => {
			console.log("Assistant started speaking");
			setIsSpeaking(true);
		});
		vapiInstance.on("speech-end", () => {
			console.log("Assistant stopped speaking");
			setIsSpeaking(false);
		});
		vapiInstance.on("message", (message) => {
			if (message.type === "transcript") {
				setTranscript((prev) => [
					...prev,
					{
						role: message.role,
						text: message.transcript,
					},
				]);
			}
		});
		vapiInstance.on("error", (error) => {
			console.error("Vapi error:", error);
		});
		return () => {
			vapiInstance?.stop();
		};
	}, [apiKey]);
	const startCall = () => {
		if (vapi) {
			vapi.start({
				// Basic assistant configuration
				model: {
					provider: "openai",
					model: "gpt-4o",
					maxTokens: 250,
					temperature: 0.5,
					messages: [
						{
							role: "system",
							content: voiceSystemPrompt,
						},
					],
				},
				// Voice configuration
				voice: {
					provider: "vapi",
					voiceId: "Elliot",
				},

				// Transcriber configuration
				transcriber: {
					provider: "deepgram",
					model: "nova-2",
					language: "en-US",
				},
				// Call settings
				firstMessage:
					"Hi there! I am ChainLabs Voice Assistant. How can I assist you today?",
				endCallMessage: "Thank you for the conversation. Goodbye!",
				endCallPhrases: ["goodbye", "bye", "end call", "hang up"],
				// Max call duration (in seconds) - 10 minutes
				maxDurationSeconds: 600,
			});
		}
	};
	const endCall = () => {
		if (vapi) {
			vapi.stop();
		}
	};
	return (
		<div
			style={{
				position: "fixed",
				bottom: "24px",
				right: "24px",
				zIndex: 1000,
				fontFamily: "Arial, sans-serif",
			}}
		>
			{!isConnected ? (
				<button
					onClick={startCall}
					style={{
						background: "#12A594",
						color: "#fff",
						border: "none",
						borderRadius: "50px",
						padding: "16px 24px",
						fontSize: "16px",
						fontWeight: "bold",
						cursor: "pointer",
						boxShadow: "0 4px 12px rgba(18, 165, 148, 0.3)",
						transition: "all 0.3s ease",
					}}
					onMouseOver={(e) => {
						e.currentTarget.style.transform = "translateY(-2px)";
						e.currentTarget.style.boxShadow =
							"0 6px 16px rgba(18, 165, 148, 0.4)";
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.transform = "translateY(0)";
						e.currentTarget.style.boxShadow =
							"0 4px 12px rgba(18, 165, 148, 0.3)";
					}}
				>
					🎤 Talk to Assistant
				</button>
			) : (
				<div
					style={{
						background: "#fff",
						borderRadius: "12px",
						padding: "20px",
						width: "320px",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
						border: "1px solid #e1e5e9",
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginBottom: "16px",
						}}
					>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: "8px",
							}}
						>
							<div
								style={{
									width: "12px",
									height: "12px",
									borderRadius: "50%",
									background: isSpeaking
										? "#ff4444"
										: "#12A594",
									animation: isSpeaking
										? "pulse 1s infinite"
										: "none",
								}}
							></div>
							<span style={{ fontWeight: "bold", color: "#333" }}>
								{isSpeaking
									? "Assistant Speaking..."
									: "Listening..."}
							</span>
						</div>
						<button
							onClick={endCall}
							style={{
								background: "#ff4444",
								color: "#fff",
								border: "none",
								borderRadius: "6px",
								padding: "6px 12px",
								fontSize: "12px",
								cursor: "pointer",
							}}
						>
							End Call
						</button>
					</div>

					<div
						style={{
							maxHeight: "200px",
							overflowY: "auto",
							marginBottom: "12px",
							padding: "8px",
							background: "#f8f9fa",
							borderRadius: "8px",
						}}
					>
						{transcript.length === 0 ? (
							<p
								style={{
									color: "#666",
									fontSize: "14px",
									margin: 0,
								}}
							>
								Conversation will appear here...
							</p>
						) : (
							transcript.map((msg, i) => (
								<div
									key={i}
									style={{
										marginBottom: "8px",
										textAlign:
											msg.role === "user"
												? "right"
												: "left",
									}}
								>
									<span
										style={{
											background:
												msg.role === "user"
													? "#12A594"
													: "#333",
											color: "#fff",
											padding: "8px 12px",
											borderRadius: "12px",
											display: "inline-block",
											fontSize: "14px",
											maxWidth: "80%",
										}}
									>
										{msg.text}
									</span>
								</div>
							))
						)}
					</div>
				</div>
			)}

			<style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
		</div>
	);
}
