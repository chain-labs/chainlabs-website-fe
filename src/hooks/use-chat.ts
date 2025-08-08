import { useCallback, useState } from "react";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";

export const useChat = () => {
	const store = useGlobalStore();
	const [isThisLatestAssistantMessage, setIsThisLatestAssistantMessage] =
		useState(false);

	const sendMessage = useCallback(
		async (content: string) => {
			const context = {
				page: store.currentContext?.page || "hero",
				section: store.currentContext?.section || "chat-input",
				metadata:
					store.currentContext?.metadata &&
					typeof store.currentContext.metadata === "object"
						? {
								...store.currentContext.metadata,
								additionalProp1:
									store.currentContext.metadata
										.additionalProp1 ?? null,
						  }
						: { additionalProp1: null },
			};

			// Ensure we have a session
			try {
				await apiClient.ensureSession();
			} catch (e) {
				console.error("Failed to ensure session", e);
			}

			// Add user message to history
			const userMessage = {
				role: "user" as const,
				message: content,
				timestamp: new Date().toISOString(),
			};

			store.addChatMessage(userMessage);
			store.setInputValue("");
			store.setIsThinking(true);
			setIsThisLatestAssistantMessage(true);

			try {
				let response;

				// Check if this is the first user message (goal vs chat)
				const userMessages = store.chatHistory.filter(
					(msg) => msg.role === "user"
				);
				const isFirstMessage = userMessages.length === 1; // We just added one, so check if it's the only one

				if (isFirstMessage) {
					// First message goes to /api/goal
					console.log("Sending first message to /api/goal");
					response = await apiClient.submitGoal(content);

					// For goal endpoint, response is already formatted correctly
					const assistantMessage = {
						role: "assistant" as const,
						message: response.message || "I'm here to help.",
						timestamp:
							response.timestamp || new Date().toISOString(),
					};
					store.addChatMessage(assistantMessage);
				} else {
					// Subsequent messages go to /api/chat
					console.log("Sending message to /api/chat");
					const chatResponse = await apiClient.chatWithAssistant(
						content,
						context
					);

					// For chat endpoint, response is already formatted correctly
					const assistantMessage = {
						role: "assistant" as const,
						message: chatResponse.message || "I'm here to help.",
						timestamp:
							chatResponse.timestamp || new Date().toISOString(),
					};
					store.addChatMessage(assistantMessage);

					// Handle additional data from chat response if needed
					// Note: The full chat response contains more data that could be used
					// for missions, progress updates, etc.
				}

				store.setIsThinking(false);
				return response;
			} catch (error) {
				console.error("Failed to send message:", error);
				store.setIsThinking(false);

				// Try to recover session automatically once
				try {
					await apiClient.startSession();
				} catch {
					// If session recovery fails, continue with error handling
				}

				const errorMessage = {
					role: "assistant" as const,
					message:
						error instanceof Error &&
						error.message === "AUTHENTICATION_FAILED"
							? "Your session has expired. Please refresh the page to continue."
							: error instanceof Error
							? `Error: ${error.message}`
							: "I'm sorry, I encountered an error. Please try again.",
					timestamp: new Date().toISOString(),
				};
				store.addChatMessage(errorMessage);

				throw error;
			}
		},
		[store]
	);

	const sendGoalClarification = useCallback(
		async (clarification: string) => {
			// Ensure we have a session
			try {
				await apiClient.ensureSession();
			} catch (e) {
				console.error("Failed to ensure session", e);
			}

			store.setIsThinking(true);

			try {
				const response = await apiClient.clarifyGoal(clarification);

				// Handle the clarification response - this contains goal, missions, etc.
				// You might want to update the global store with this data
				if (response.goal) {
					// Update goal in store if you have such functionality
					// store.setGoal(response.goal);
				}

				if (response.missions) {
					// Update missions in store if you have such functionality
					// store.setMissions(response.missions);
				}

				// Add a message to chat about the clarification
				const assistantMessage = {
					role: "assistant" as const,
					message:
						response.headline ||
						"Thank you for the clarification! I've updated your goal and created personalized missions for you.",
					timestamp: new Date().toISOString(),
				};
				store.addChatMessage(assistantMessage);

				store.setIsThinking(false);
				return response;
			} catch (error) {
				console.error("Failed to clarify goal:", error);
				store.setIsThinking(false);

				const errorMessage = {
					role: "assistant" as const,
					message:
						"I'm sorry, I couldn't process your clarification. Please try again.",
					timestamp: new Date().toISOString(),
				};
				store.addChatMessage(errorMessage);

				throw error;
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
		sendGoalClarification,
		setInputValue: store.setInputValue,
		setVoiceInputValue: store.setVoiceInputValue,
		clearMessages: store.clearChatHistory,
		setCurrentContext: store.setCurrentContext,
	};
};
