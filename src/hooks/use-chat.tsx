import { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";
import { useUI } from "./use-ui";

const PLACE_HOLDERS = {
	GOAL: "Tell us the biggest problem you want to solve (e.g. increase restaurant bookings, automate support).",
	CLARIFICATION:
		"Thanks! What’s the biggest obstacle that’s stopping more customers from booking tables right now?",
	DEFAULT: "Type a question or describe what you need.",
};

const THINKING_PLACEHOLDER = {
	GOAL: "Thinking about your goal...",
	CLARIFICATION: "Rendering ...",
	DEFAULT: "Thinking about your request...",
};

export const useChat = () => {
	const store = useGlobalStore();
	const { showPersonalized } = useUI();
	const [isThisLatestAssistantMessage, setIsThisLatestAssistantMessage] =
		useState(false);
	const [placeHolder, setPlaceHolder] = useState(
		showPersonalized
			? PLACE_HOLDERS.DEFAULT
			: store.hasGoal()
			? PLACE_HOLDERS.CLARIFICATION
			: PLACE_HOLDERS.GOAL
	);
	const [thinkingPlaceholder, setThinkingPlaceholder] = useState(
		showPersonalized
			? THINKING_PLACEHOLDER.DEFAULT
			: store.hasGoal()
			? THINKING_PLACEHOLDER.CLARIFICATION
			: THINKING_PLACEHOLDER.GOAL
	);
	const [aiChatBubbleIsOpen, setAiChatBubbleIsOpen] = useState(false);
	const aiOpenRef = useRef(aiChatBubbleIsOpen);

	useEffect(() => {
		aiOpenRef.current = aiChatBubbleIsOpen;
	}, [aiChatBubbleIsOpen]);

	const getPersonalizedContent = useCallback(async () => {
		const response = await apiClient.getPersonalizedContent();
		setPlaceHolder(
			response.status === "INITIAL"
				? PLACE_HOLDERS.GOAL
				: response.status === "GOAL_SET"
				? PLACE_HOLDERS.CLARIFICATION
				: PLACE_HOLDERS.DEFAULT
		);
		store.setPersonalised(response);
		store.setIsThinking(false);
	}, [store]);

	useEffect(() => {
		if (!aiChatBubbleIsOpen) setIsThisLatestAssistantMessage(false);
	}, [aiChatBubbleIsOpen]);

	const sendMessage = useCallback(
		async (content: string) => {
			setIsThisLatestAssistantMessage(true);
			store.setInputValue("");
			store.addChatMessage({
				role: "user",
				message: content,
				timestamp: new Date().toISOString(),
			});
			store.setIsThinking(true);

			try {
				if (showPersonalized && aiOpenRef.current) {
					// Track last request for retry
					store.setLastRequest("chat", content);
					const response = await apiClient.chatWithAssistant(
						content,
						{
							page: "",
							section: "",
							metadata: { additionalProp1: null },
						}
					);
					store.setIsThinking(false);
					store.addChatMessage({
						role: "assistant",
						message: response.reply,
						timestamp: new Date().toISOString(),
					});
					if (aiOpenRef.current) {
						const target = document.getElementById(
							response.navigate.metadata.missionId !== "N/A"
								? response.navigate.metadata.missionId
								: response.navigate.metadata.caseStudyId !==
								  "N/A"
								? response.navigate.metadata.caseStudyId
								: ""
						);
						const targetSection = document.getElementById(
							response.navigate.sectionId
						);

						if (target && aiOpenRef.current) {
							if ("scrollMarginTop" in target.style) {
								target.style.scrollMarginTop = "100px";
								target.scrollIntoView({
									behavior: "smooth",
									block: "start",
								});
							} else {
								const y = Math.max(
									0,
									target.getBoundingClientRect().top +
										window.pageYOffset -
										100
								);
								window.scrollTo({ top: y, behavior: "smooth" });
							}
						} else if (targetSection && aiOpenRef.current) {
							if ("scrollMarginTop" in targetSection.style) {
								targetSection.style.scrollMarginTop = "100px";
								targetSection.scrollIntoView({
									behavior: "smooth",
									block: "start",
								});
							} else {
								const y = Math.max(
									0,
									targetSection.getBoundingClientRect().top +
										window.pageYOffset -
										100
								);
								window.scrollTo({ top: y, behavior: "smooth" });
							}
						}
					}
					getPersonalizedContent();
				} else if (store.hasGoal()) {
					store.setLastRequest("clarify", content);
					setThinkingPlaceholder(THINKING_PLACEHOLDER.GOAL);
					await apiClient.clarifyGoal(content);
					store.setIsThinking(false);
					store.addChatMessage({
						role: "assistant",
						message:
							"🤖 Tool call: I've processed your clarification and rendered a personalized version of the site based on your needs.",
						timestamp: new Date().toISOString(),
					});
					store.setIsThinking(false);
					setTimeout(() => {
						getPersonalizedContent();
					}, 3000);
				} else {
					store.setLastRequest("goal", content);
					setThinkingPlaceholder(THINKING_PLACEHOLDER.CLARIFICATION);
					const response = await apiClient.submitGoal(content);
					store.setIsThinking(false);
					store.addChatMessage({
						role: "assistant",
						message: response.message,
						timestamp: response.timestamp,
					});
					store.setGoal(response.message);
				}
			} catch (error) {
				console.error("sendMessage failed", error);
				// Map endpoint-specific friendly errors and persist until user acts
				if (showPersonalized && aiOpenRef.current) {
					store.setLastError("Failed to generate response");
				} else if (store.hasGoal()) {
					store.setLastError("Failed to generate clarification questions");
				} else {
					store.setLastError("Failed to process your goal");
				}
			} finally {
				store.setIsThinking(false);
			}
		},
		[store, showPersonalized]
	);

	return {
		messages: store.chatHistory,
		isThinking: store.isThinking,
		inputValue: store.inputValue,
		hasMessages: store.chatHistory.length > 0,
		voiceInputValue: store.voiceInputValue,
		sendMessage,
		isThisLatestAssistantMessage: isThisLatestAssistantMessage,
		setInputValue: store.setInputValue,
		setVoiceInputValue: store.setVoiceInputValue,
		clearMessages: store.clearChatHistory,
		setCurrentContext: store.setCurrentContext,
		placeHolder,
		thinkingPlaceholder,
		getPersonalizedContent,
		aiChatBubbleIsOpen,
		setAiChatBubbleIsOpen,
	};
};
