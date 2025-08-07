import { useCallback } from "react";
import { useGlobalStore } from "@/global-store";
import { apiClient } from "@/api-client";

export const useChat = () => {
  const store = useGlobalStore();

  const sendMessage = useCallback(
    async (content: string) => {
      const context = store.currentContext || {
        page: "hero",
        section: "chat-input"
      };

      // Add user message to history
      const userMessage = {
        role: "user" as const,
        message: content,
        timestamp: new Date().toISOString(),
      };

      store.addChatMessage(userMessage);
      store.setInputValue("");
      store.setIsThinking(true);

      try {
        const response = await apiClient.chatWithAssistant(content, context);
        
        // Add assistant response to history
        const assistantMessage = {
          role: "assistant" as const,
          message: response.reply,
          timestamp: new Date().toISOString(),
        };
        
        store.addChatMessage(assistantMessage);
        store.setIsThinking(false);
        
        // Update progress if provided
        if (response.progress) {
          store.updateProgress(response.progress);
        }
        
        return response;
      } catch (error) {
        console.error("Failed to send message:", error);
        store.setIsThinking(false);
        
        // Handle authentication failure
        if (error instanceof Error && error.message === 'AUTHENTICATION_FAILED') {
          const errorMessage = {
            role: "assistant" as const,
            message: "Your session has expired. Please refresh the page to continue.",
            timestamp: new Date().toISOString(),
          };
          store.addChatMessage(errorMessage);
          return;
        }
        
        // Generic error message
        const errorMessage = {
          role: "assistant" as const,
          message: "I'm sorry, I encountered an error. Please try again.",
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
    sendMessage,
    setInputValue: store.setInputValue,
    clearMessages: store.clearChatHistory,
    setCurrentContext: store.setCurrentContext,
  };
};