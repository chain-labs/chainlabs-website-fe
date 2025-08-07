import { useGlobalStore } from "@/global-store";
import { useCallback } from "react";

export const useChat = () => {
	const store = useGlobalStore();

	const simulateAIResponse = useCallback((userMessage: string) => {
		const responses = [
			"I understand your business needs! Based on your requirements, I'll create a custom website design with AI-powered features.",
			"Excellent! I'm processing your website requirements using our AI algorithms.",
			"Perfect! Our AI is analyzing your business model and target audience.",
		];

		return responses[Math.floor(Math.random() * responses.length)];
	}, []);

	const sendMessage = useCallback(
		(content: string) => {
			// Add user message
			const userMessage = {
				id: crypto.randomUUID(),
				role: "user" as const,
				content,
				timestamp: new Date(),
			};

			store.addMessage(userMessage);
			store.setInputValue("");
			store.setIsThinking(true);
			store.incrementConversationCount();

			// Simulate AI response
			setTimeout(() => {
				const aiMessage = {
					id: crypto.randomUUID(),
					role: "ai" as const,
					content: simulateAIResponse(content),
					timestamp: new Date(),
				};

				store.addMessage(aiMessage);
				store.setIsThinking(false);

				// Check if should show personalized page
				if (store.aiMessageCount() >= 2) {
					setTimeout(() => {
						store.setShowPersonalized(true);
					}, 1000);
				}
			}, 2000 + Math.random() * 2000);
		},
		[store, simulateAIResponse]
	);

	return {
		messages: store.messages,
		isThinking: store.isThinking,
		inputValue: store.inputValue,
		hasMessages: store.hasMessages(),
		sendMessage,
		setInputValue: store.setInputValue,
		clearMessages: store.clearMessages,
	};
};
