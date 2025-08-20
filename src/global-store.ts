import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GoalResponse, PersonalisedResponse } from "./types";
import { CaseStudy, Mission as MissionResponseAPI } from "./types/store";

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

interface Mission extends MissionResponseAPI {
	status: "pending" | "completed";
}

// Session State (removed authentication tokens)
interface SessionState {
	// Goal & Personalization
	goal: string | null;
	headline: string | null;
	missions: Mission[];
	personalised: PersonalisedResponse | null;
	recommendedCaseStudies: CaseStudy[];

	// Progress
	pointsTotal: number;

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

	// Flags
	goalSubmitted: boolean;
	clarificationSubmitted: boolean;
	personalizationGenerated: boolean;
	callUnlocked: boolean;

	// Session/async flags
	hasSession?: boolean;
	isEnsuringSession?: boolean;
	isSubmittingGoal?: boolean;
	isClarifying?: boolean;
	isFetchingProgress?: boolean;
	isCheckingUnlock?: boolean;

	// Missions flow
	currentMissionId: string | null;

	// Errors
	lastError: string | null;
}

interface SessionActions {
	// Goal & Personalization
	setGoal: (goal: string) => void;
	setHeadline: (headline: string) => void;
	setMissions: (missions: Mission[]) => void;
	updateMissionStatus: (
		missionId: string,
		status: "pending" | "completed"
	) => void;
	setRecommendedCaseStudies: (caseStudies: CaseStudy[]) => void;
	setPersonalised: (personalised: PersonalisedResponse | null) => void;

	// Progress
	setPointsTotal: (points: number) => void;
	setCallUnlocked: (unlocked: boolean) => void;
	updateProgress: (progress: {
		pointsTotal: number;
		callUnlocked: boolean;
		missions: { id: string; status: "pending" | "completed" }[];
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

	// Flags
	setHasSession: (has: boolean) => void;
	setIsEnsuringSession: (b: boolean) => void;
	setIsSubmittingGoal: (b: boolean) => void;
	setIsClarifying: (b: boolean) => void;
	setIsFetchingProgress: (b: boolean) => void;
	setIsCheckingUnlock: (b: boolean) => void;

	// Missions flow
	setCurrentMissionId: (id: string | null) => void;
	advanceToNextPendingMission: () => void;

	// Errors
	setLastError: (msg: string | null) => void;

	// Session Management
	hydrateFromSession: (sessionData: any) => void;
	resetSession: () => void;

	// Computed
	hasGoal: () => boolean;
	hasClarification: () => boolean;
	completedMissionsCount: () => number;
	pendingMissionsCount: () => number;
	progressPercentage: () => number;
	canShowPersonalized: () => boolean;
	getCurrentMission: () => Mission | null;
	getNextPendingMission: () => Mission | null;
}

export const useGlobalStore = create<SessionState & SessionActions>()(
	persist(
		(set, get) => ({
			// Initial State - Goal & Personalization
			goal: null,
			headline: null,
			personalised: null,
			missions: [],
			recommendedCaseStudies: [],

			// Initial State - Progress
			pointsTotal: 0,

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

			// Initial Flags
			goalSubmitted: false,
			clarificationSubmitted: false,
			personalizationGenerated: false,
			callUnlocked: false,

			// Session/async flags
			hasSession: false,
			isEnsuringSession: false,
			isSubmittingGoal: false,
			isClarifying: false,
			isFetchingProgress: false,
			isCheckingUnlock: false,

			// Missions flow
			currentMissionId: null,

			// Errors
			lastError: null,

			// Actions - Goal & Personalization
			setGoal: (goal) => set({ goal }),
			setPersonalised: (personalised) => set({ personalised }),
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
					pointsTotal: progress.pointsTotal,
					callUnlocked: progress.callUnlocked,
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
			stopRecording: () => set({ isRecording: false }),
			setShowPersonalized: (showPersonalized) =>
				set({ showPersonalized }),
			setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
			toggleSidebar: () =>
				set((state) => ({ sidebarOpen: !state.sidebarOpen })),

			// App Actions
			setHasCompletedOnboarding: (hasCompletedOnboarding) =>
				set({ hasCompletedOnboarding }),
			setTheme: (theme) => set({ theme }),
			toggleTheme: () =>
				set((state) => ({
					theme: state.theme === "dark" ? "light" : "dark",
				})),
			setAnimations: (animations) => set({ animations }),

			// Flags
			setHasSession: (has) => set({ hasSession: has }),
			setIsEnsuringSession: (b) => set({ isEnsuringSession: b }),
			setIsSubmittingGoal: (b) => set({ isSubmittingGoal: b }),
			setIsClarifying: (b) => set({ isClarifying: b }),
			setIsFetchingProgress: (b) => set({ isFetchingProgress: b }),
			setIsCheckingUnlock: (b) => set({ isCheckingUnlock: b }),

			// Computed
			hasGoal: () => get().goal !== null,
			hasClarification: () => get().personalised?.status !== "CLARIFIED",
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
			canShowPersonalized: () =>
				get().personalised?.status !== "CLARIFIED",
			getCurrentMission: () => {
				const { currentMissionId, missions } = get();
				return missions.find((m) => m.id === currentMissionId) || null;
			},
			getNextPendingMission: () => {
				const { missions } = get();
				return missions.find((m) => m.status === "pending") || null;
			},

			// Missions flow
			setCurrentMissionId: (currentMissionId) =>
				set({ currentMissionId }),
			advanceToNextPendingMission: () =>
				set((state) => {
					const next = state.missions.find(
						(m) => m.status === "pending"
					);
					return { currentMissionId: next ? next.id : null };
				}),

			// Errors
			setLastError: (lastError) => set({ lastError }),

			// Session Management
			hydrateFromSession: (sessionData) =>
				set({
					goal: sessionData.goal,
					personalised: sessionData.personalised || null,
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
					// Initial State - Goal & Personalization
					goal: null,
					headline: null,
					personalised: null,
					missions: [],
					recommendedCaseStudies: [],

					// Initial State - Progress
					pointsTotal: 0,

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

					// Initial Flags
					goalSubmitted: false,
					clarificationSubmitted: false,
					personalizationGenerated: false,
					callUnlocked: false,

					// Session/async flags
					hasSession: false,
					isEnsuringSession: false,
					isSubmittingGoal: false,
					isClarifying: false,
					isFetchingProgress: false,
					isCheckingUnlock: false,

					// Missions flow
					currentMissionId: null,

					// Errors
					lastError: null,
				}),
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
				personalised: state.personalised,
			}),
		}
	)
);
