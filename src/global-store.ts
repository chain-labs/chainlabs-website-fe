import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface ChatMessage {
	id: string;
	role: "user" | "ai";
	content: string;
	timestamp: Date;
}

export interface UserProfile {
	name?: string;
	email?: string;
	businessType?: string;
	preferences?: Record<string, any>;
}

interface GlobalState {
	// Chat State
	messages: ChatMessage[];
	isThinking: boolean;
	inputValue: string;

	// UI State
	isFocused: boolean;
	isRecording: boolean;
	showPersonalized: boolean;
	sidebarOpen: boolean;

	// User State
	userProfile: UserProfile | null;

	// Hero/Personalization State
	conversationCount: number;
	hasCompletedOnboarding: boolean;

	// Theme/Preferences
	theme: "light" | "dark";
	animations: boolean;

	// Actions - Chat
	setMessages: (messages: ChatMessage[]) => void;
	addMessage: (message: ChatMessage) => void;
	clearMessages: () => void;
	setIsThinking: (isThinking: boolean) => void;
	setInputValue: (value: string) => void;

	// Actions - UI
	setIsFocused: (focused: boolean) => void;
	setIsRecording: (recording: boolean) => void;
	toggleRecording: () => void;
	setShowPersonalized: (show: boolean) => void;
	setSidebarOpen: (open: boolean) => void;
	toggleSidebar: () => void;

	// Actions - User
	setUserProfile: (profile: UserProfile) => void;
	updateUserProfile: (updates: Partial<UserProfile>) => void;
	clearUserProfile: () => void;

	// Actions - Hero/Personalization
	incrementConversationCount: () => void;
	setHasCompletedOnboarding: (completed: boolean) => void;
	resetOnboarding: () => void;

	// Actions - Theme/Preferences
	setTheme: (theme: "light" | "dark") => void;
	toggleTheme: () => void;
	setAnimations: (enabled: boolean) => void;

	// Computed/Derived State
	hasMessages: () => boolean;
	userMessageCount: () => number;
	aiMessageCount: () => number;
	shouldShowPersonalized: () => boolean;
}

export const useGlobalStore = create<GlobalState>()(
	persist(
		(set, get) => ({
			// Initial State - Chat
			messages: [],
			isThinking: false,
			inputValue: "",

			// Initial State - UI
			isFocused: false,
			isRecording: false,
			showPersonalized: false,
			sidebarOpen: true,

			// Initial State - User
			userProfile: null,

			// Initial State - Hero/Personalization
			conversationCount: 0,
			hasCompletedOnboarding: false,

			// Initial State - Theme/Preferences
			theme: "dark",
			animations: true,

			// Actions - Chat
			setMessages: (messages) => set({ messages }),
			addMessage: (message) =>
				set((state) => ({
					messages: [...state.messages, message],
				})),
			clearMessages: () => set({ messages: [] }),
			setIsThinking: (isThinking) => set({ isThinking }),
			setInputValue: (inputValue) => set({ inputValue }),

			// Actions - UI
			setIsFocused: (isFocused) => set({ isFocused }),
			setIsRecording: (isRecording) => set({ isRecording }),
			toggleRecording: () =>
				set((state) => ({ isRecording: !state.isRecording })),
			setShowPersonalized: (showPersonalized) =>
				set({ showPersonalized }),
			setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
			toggleSidebar: () =>
				set((state) => ({ sidebarOpen: !state.sidebarOpen })),

			// Actions - User
			setUserProfile: (userProfile) => set({ userProfile }),
			updateUserProfile: (updates) =>
				set((state) => ({
					userProfile: state.userProfile
						? { ...state.userProfile, ...updates }
						: updates,
				})),
			clearUserProfile: () => set({ userProfile: null }),

			// Actions - Hero/Personalization
			incrementConversationCount: () =>
				set((state) => ({
					conversationCount: state.conversationCount + 1,
				})),
			setHasCompletedOnboarding: (hasCompletedOnboarding) =>
				set({ hasCompletedOnboarding }),
			resetOnboarding: () =>
				set({
					hasCompletedOnboarding: false,
					conversationCount: 0,
					showPersonalized: false,
				}),

			// Actions - Theme/Preferences
			setTheme: (theme) => set({ theme }),
			toggleTheme: () =>
				set((state) => ({
					theme: state.theme === "dark" ? "light" : "dark",
				})),
			setAnimations: (animations) => set({ animations }),

			// Computed/Derived State
			hasMessages: () => get().messages.length > 0,
			userMessageCount: () =>
				get().messages.filter((m) => m.role === "user").length,
			aiMessageCount: () =>
				get().messages.filter((m) => m.role === "ai").length,
			shouldShowPersonalized: () => get().showPersonalized,
		}),
		{
			name: "chainlabs-global-store",
			// Only persist certain parts of the state
			partialize: (state) => ({
				messages: state.messages,
				userProfile: state.userProfile,
				conversationCount: state.conversationCount,
				hasCompletedOnboarding: state.hasCompletedOnboarding,
				theme: state.theme,
				animations: state.animations,
				sidebarOpen: state.sidebarOpen,
				showPersonalized: state.showPersonalized,
			}),
		}
	)
);
