import { useCallback, useState } from "react";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";

export const useChat = () => {
	const store = useGlobalStore();
	const [isThisLatestAssistantMessage, setIsThisLatestAssistantMessage] =
		useState(false);

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
					store.addChatMessage({
						role: "assistant",
						message: response.why,
						timestamp: new Date().toISOString(),
					});
					const personalized = await apiClient.getPersonalizedContent();
					store.setPersonalised(personalized);
				} else {
					const response = await apiClient.submitGoal(content);
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
	};
};
