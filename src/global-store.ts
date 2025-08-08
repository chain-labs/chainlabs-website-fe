import { create } from "zustand";
import { persist } from "zustand/middleware";

// API Types (matching your OpenAPI spec)
export interface Goal {
	description: string;
	category?: string;
	priority?: string;
}

export interface Mission {
	id: string;
	title: string;
	points: number;
	status: "pending" | "completed";
}

export interface MissionStatus {
	id: string;
	status: "pending" | "completed";
	points: number;
}

export interface CaseStudy {
	id: string;
	title: string;
	summary: string;
}

export interface ChatMessage {
	role: "user" | "assistant";
	message: string;
	timestamp: string; // ISO string
}

export interface ChatContext {
	page: string;
	section: string;
	metadata?: Record<string, any>;
}

// Session State (removed authentication tokens)
interface SessionState {
	// Goal & Personalization
	goal: Goal | null;
	headline: string | null;
	missions: Mission[];
	recommendedCaseStudies: CaseStudy[];

	// Progress
	pointsTotal: number;
	callUnlocked: boolean;

	// Chat
	chatHistory: ChatMessage[];
	isThinking: boolean;
	currentContext: ChatContext | null;

	// UI State
	inputValue: string;
	voiceInputValue: string;
	isFocused: boolean;
	isRecording: boolean;
	showPersonalized: boolean;
	sidebarOpen: boolean;

	// App State
	hasCompletedOnboarding: boolean;
	theme: "light" | "dark";
	animations: boolean;
}

interface SessionActions {
	// Goal & Personalization
	setGoal: (goal: Goal) => void;
	setHeadline: (headline: string) => void;
	setMissions: (missions: Mission[]) => void;
	updateMissionStatus: (
		missionId: string,
		status: "pending" | "completed"
	) => void;
	setRecommendedCaseStudies: (caseStudies: CaseStudy[]) => void;

	// Progress
	setPointsTotal: (points: number) => void;
	setCallUnlocked: (unlocked: boolean) => void;
	updateProgress: (progress: {
		points_total: number;
		missions: MissionStatus[];
		call_unlocked: boolean;
	}) => void;

	// Chat
	addChatMessage: (message: ChatMessage) => void;
	setChatHistory: (history: ChatMessage[]) => void;
	clearChatHistory: () => void;
	setIsThinking: (thinking: boolean) => void;
	setCurrentContext: (context: ChatContext | null) => void;

	// UI Actions
	setInputValue: (value: string) => void;
	setVoiceInputValue: (value: string) => void;
	setIsFocused: (focused: boolean) => void;
	setIsRecording: (recording: boolean) => void;
	toggleRecording: () => void;
	stopRecording: () => void;
	setShowPersonalized: (show: boolean) => void;
	setSidebarOpen: (open: boolean) => void;
	toggleSidebar: () => void;

	// App Actions
	setHasCompletedOnboarding: (completed: boolean) => void;
	setTheme: (theme: "light" | "dark") => void;
	toggleTheme: () => void;
	setAnimations: (enabled: boolean) => void;

	// Session Management
	hydrateFromSession: (sessionData: any) => void;
	resetSession: () => void;

	// Computed
	hasGoal: () => boolean;
	completedMissionsCount: () => number;
	pendingMissionsCount: () => number;
	progressPercentage: () => number;
	canShowPersonalized: () => boolean;
}

export const useGlobalStore = create<SessionState & SessionActions>()(
	persist(
		(set, get) => ({
			// Initial State - Goal & Personalization
			goal: null,
			headline: null,
			missions: [],
			recommendedCaseStudies: [],

			// Initial State - Progress
			pointsTotal: 0,
			callUnlocked: false,

			// Initial State - Chat
			chatHistory: [],
			isThinking: false,
			currentContext: null,

			// Initial State - UI
			inputValue: "",
			voiceInputValue: "",
			isFocused: false,
			isRecording: false,
			showPersonalized: false,
			sidebarOpen: true,

			// Initial State - App
			hasCompletedOnboarding: false,
			theme: "dark",
			animations: true,

			// Actions - Goal & Personalization
			setGoal: (goal) => set({ goal }),
			setHeadline: (headline) => set({ headline }),
			setMissions: (missions) => set({ missions }),
			updateMissionStatus: (missionId, status) =>
				set((state) => ({
					missions: state.missions.map((mission) =>
						mission.id === missionId
							? { ...mission, status }
							: mission
					),
				})),
			setRecommendedCaseStudies: (recommendedCaseStudies) =>
				set({ recommendedCaseStudies }),

			// Actions - Progress
			setPointsTotal: (pointsTotal) => set({ pointsTotal }),
			setCallUnlocked: (callUnlocked) => set({ callUnlocked }),
			updateProgress: (progress) =>
				set((state) => ({
					pointsTotal: progress.points_total,
					callUnlocked: progress.call_unlocked,
					missions: state.missions.map((mission) => {
						const updated = progress.missions.find(
							(m) => m.id === mission.id
						);
						return updated
							? { ...mission, status: updated.status }
							: mission;
					}),
				})),

			// Actions - Chat
			addChatMessage: (message) =>
				set((state) => ({
					chatHistory: [...state.chatHistory, message],
				})),
			setChatHistory: (chatHistory) => set({ chatHistory }),
			clearChatHistory: () => set({ chatHistory: [] }),
			setIsThinking: (isThinking) => set({ isThinking }),
			setCurrentContext: (currentContext) => set({ currentContext }),

			// Actions - UI
			setInputValue: (inputValue) => set({ inputValue }),
			setVoiceInputValue: (voiceInputValue) => set({ voiceInputValue }),
			setIsFocused: (isFocused) => set({ isFocused }),
			setIsRecording: (isRecording) => set({ isRecording }),
			toggleRecording: () =>
				set((state) => ({ isRecording: !state.isRecording })),
			stopRecording: () => {
				set({ isRecording: false });
			},
			setShowPersonalized: (showPersonalized) =>
				set({ showPersonalized }),
			setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
			toggleSidebar: () =>
				set((state) => ({ sidebarOpen: !state.sidebarOpen })),

			// Actions - App
			setHasCompletedOnboarding: (hasCompletedOnboarding) =>
				set({ hasCompletedOnboarding }),
			setTheme: (theme) => set({ theme }),
			toggleTheme: () =>
				set((state) => ({
					theme: state.theme === "dark" ? "light" : "dark",
				})),
			setAnimations: (animations) => set({ animations }),

			// Actions - Session Management
			hydrateFromSession: (sessionData) =>
				set({
					goal: sessionData.goal,
					missions:
						sessionData.missions?.map((m: any) => ({
							id: m.id,
							title: m.title || m.id,
							points: m.points,
							status: m.status,
						})) || [],
					pointsTotal: sessionData.points_total || 0,
					callUnlocked: sessionData.call_unlocked || false,
					showPersonalized: true,
				}),

			resetSession: () =>
				set({
					goal: null,
					headline: null,
					missions: [],
					recommendedCaseStudies: [],
					pointsTotal: 0,
					callUnlocked: false,
					chatHistory: [],
					showPersonalized: false,
					hasCompletedOnboarding: false,
				}),

			// Computed
			hasGoal: () => get().goal !== null,
			completedMissionsCount: () =>
				get().missions.filter((m) => m.status === "completed").length,
			pendingMissionsCount: () =>
				get().missions.filter((m) => m.status === "pending").length,
			progressPercentage: () => {
				const { missions } = get();
				if (missions.length === 0) return 0;
				const completed = missions.filter(
					(m) => m.status === "completed"
				).length;
				return (completed / missions.length) * 100;
			},
			canShowPersonalized: () => {
				const { goal, missions, showPersonalized } = get();
				return showPersonalized && goal !== null && missions.length > 0;
			},
		}),
		{
			name: "chainlabs-session-store",
			partialize: (state) => ({
				goal: state.goal,
				headline: state.headline,
				missions: state.missions,
				recommendedCaseStudies: state.recommendedCaseStudies,
				pointsTotal: state.pointsTotal,
				callUnlocked: state.callUnlocked,
				chatHistory: state.chatHistory,
				hasCompletedOnboarding: state.hasCompletedOnboarding,
				theme: state.theme,
				animations: state.animations,
				sidebarOpen: state.sidebarOpen,
				showPersonalized: state.showPersonalized,
			}),
		}
	)
);
