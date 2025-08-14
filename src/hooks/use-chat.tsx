import { useCallback, useEffect, useState } from "react";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";

const PLACE_HOLDERS = {
	GOAL: "Describe your goal, your business",
	CLARIFICATION: "Please clarify your request",
	DEFAULT: "I'm here to help you with anything you need.",
};

export const useChat = () => {
	const store = useGlobalStore();
	const [isThisLatestAssistantMessage, setIsThisLatestAssistantMessage] =
		useState(false);
	const [placeHolder, setPlaceHolder] = useState(
		store.hasGoal() ? PLACE_HOLDERS.GOAL : PLACE_HOLDERS.DEFAULT
	);

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
				if (store.hasGoal()) {
					const response = await apiClient.clarifyGoal(content);
					store.setIsThinking(false);
					store.addChatMessage({
						role: "assistant",
						message: response.why,
						timestamp: new Date().toISOString(),
					});
				} else {
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
				store.setLastError(
					"An error occurred while sending your message."
				);
			} finally {
				store.setIsThinking(false);
				getPersonalizedContent();
			}
		},
		[store]
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
		getPersonalizedContent
	};
};
