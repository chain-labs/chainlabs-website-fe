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

export type GoalSuggestion = {
  key: string;
  label: string;
  helper?: string;
};

const createDefaultGoalSuggestions = (): GoalSuggestion[] => [
  {
    key: "restaurantBookings",
    label: "Increase table bookings for my restaurant",
    helper: "Drive more reservations and repeat visits",
  },
  // {
  //   key: "SaaSConversions",
  //   label: "Boost conversions for our SaaS onboarding",
  //   helper: "Streamline activation and improve trial-to-paid",
  // },
  {
    key: "blockchainLoyalty",
    label: "Launch a blockchain loyalty experience",
    helper: "Create cross-brand rewards that keep fans engaged",
  },
];

const createDefaultClarificationSuggestions = (): Record<string, string[]> => ({
  restaurantBookings: [
    "Our diners drop off because the booking flow feels clunky on mobile.",
    "Weeknight slots stay empty; we lack targeted promotions.",
    // "Guests churn after one visit—no retention program in place.",
  ],
  // SaaSConversions: [
  //   "Too many steps in onboarding; we lose users during setup.",
  //   "Trial users don’t convert because the value isn’t highlighted early enough.",
  //   "Support tickets spike when customers try advanced features.",
  // ],
  blockchainLoyalty: [
    "Members can’t see real-time rewards, so they disengage.",
    "We need a seamless wallet-less sign-up to drive adoption.",
    // "Partners want better analytics on cross-brand engagement.",
  ],
});

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
  sidebarOpen: boolean;

  // App State
  hasCompletedOnboarding: boolean;
  theme: "light" | "dark";
  animations: boolean;

  callUnlocked: boolean;

  hasSession?: boolean;
  isEnsuringSession?: boolean;
  isSubmittingGoal?: boolean;
  isClarifying?: boolean;
  isFetchingProgress?: boolean;
  isCheckingUnlock?: boolean;

  currentMissionId: string | null;
  lastError: string | null;
  lastRequestType: "goal" | "clarify" | "chat" | null;
  lastRequestPayload: string | null;
  personalisedSiteRequested: boolean;
  goalSuggestions: GoalSuggestion[];
  clarificationSuggestions: Record<string, string[]>;
  selectedSuggestionKey: string | null;

  caseStudyTimeSpent: Record<string, number>;
  processSectionTimeSpent: Record<string, number>;
  vapiTimeSpent: number;
}

interface SessionActions {
  // Goal & Personalization
  setGoal: (goal: string) => void;
  setHeadline: (headline: string) => void;
  setMissions: (missions: Mission[]) => void;
  updateMissionStatus: (
    missionId: string,
    status: "pending" | "completed",
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
  removeLastChatMessage: () => void;

  // UI Actions
  setInputValue: (value: string) => void;
  setVoiceInputValue: (value: string) => void;
  setIsFocused: (focused: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  toggleRecording: () => void;
  stopRecording: () => void;
  // Removed: setShowPersonalized (no backing state)
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
  setLastRequest: (
    type: "goal" | "clarify" | "chat" | null,
    payload: string | null,
  ) => void;
  clearErrorAndRequest: () => void;
  setPersonalisedSiteRequested: (requested: boolean) => void;
  setSelectedSuggestionKey: (key: string | null) => void;
  getClarificationSuggestions: () => string[];

  // Session Management
  hydrateFromSession: (sessionData: any) => void;
  resetSession: () => void;

  // Computed
  hasGoal: () => boolean;
  isClarified: () => boolean;

  // Time Tracking
  getCaseStudyTimeSpent: () => Record<string, number>;
  getProcessSectionTimeSpent: () => Record<string, number>;
  getVapiTimeSpent: () => number;
  addCaseStudyTime: (id: string, seconds: number) => void;
  addProcessSectionTime: (id: string, seconds: number) => void;
  addVapiTime: (seconds: number) => void;
}

export const useGlobalStore = create<SessionState & SessionActions>()(
  persist(
    (set, get) => ({
      // Initial State
      goal: null,
      headline: null,
      personalised: null,
      missions: [],
      recommendedCaseStudies: [],
      pointsTotal: 0,
      chatHistory: [],
      isThinking: false,
      currentContext: null,
      inputValue: "",
      voiceInputValue: "",
      isFocused: false,
      isRecording: false,
      sidebarOpen: true,
      hasCompletedOnboarding: false,
      theme: "dark",
      animations: true,
      callUnlocked: false,
      hasSession: false,
      isEnsuringSession: false,
      isSubmittingGoal: false,
      isClarifying: false,
      isFetchingProgress: false,
      isCheckingUnlock: false,
      currentMissionId: null,
      lastError: null,
      lastRequestType: null,
      lastRequestPayload: null,
      personalisedSiteRequested: false,
      goalSuggestions: createDefaultGoalSuggestions(),
      clarificationSuggestions: createDefaultClarificationSuggestions(),
      selectedSuggestionKey: null,
      caseStudyTimeSpent: {},
      processSectionTimeSpent: {},
      vapiTimeSpent: 0,

      // Actions - Goal & Personalization
      setGoal: (goal) => set({ goal }),
      setPersonalised: (personalised) => set({ personalised }),
      setHeadline: (headline) => set({ headline }),
      setMissions: (missions) => set({ missions }),
      updateMissionStatus: (missionId, status) =>
        set((state) => ({
          missions: state.missions.map((mission) =>
            mission.id === missionId ? { ...mission, status } : mission,
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
            const updated = progress.missions.find((m) => m.id === mission.id);
            return updated ? { ...mission, status: updated.status } : mission;
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
      removeLastChatMessage: () =>
        set((state) => {
          state.chatHistory.pop();
          return state;
        }),

      // Actions - UI
      setInputValue: (inputValue) => set({ inputValue }),
      setVoiceInputValue: (voiceInputValue) => set({ voiceInputValue }),
      setIsFocused: (isFocused) => set({ isFocused }),
      setIsRecording: (isRecording) => set({ isRecording }),
      toggleRecording: () =>
        set((state) => ({ isRecording: !state.isRecording })),
      stopRecording: () => set({ isRecording: false }),
      // Removed setShowPersonalized
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
      // Single clear selector instead of two duplicates
      isClarified: () => get().personalised?.status === "CLARIFIED",
      completedMissionsCount: () =>
        get().missions.filter((m) => m.status === "completed").length,
      pendingMissionsCount: () =>
        get().missions.filter((m) => m.status === "pending").length,
      progressPercentage: () => {
        const { missions } = get();
        if (missions.length === 0) return 0;
        const completed = missions.filter(
          (m) => m.status === "completed",
        ).length;
        return (completed / missions.length) * 100;
      },
      getCurrentMission: () => {
        const { currentMissionId, missions } = get();
        return missions.find((m) => m.id === currentMissionId) || null;
      },
      getNextPendingMission: () => {
        const { missions } = get();
        return missions.find((m) => m.status === "pending") || null;
      },

      // Missions flow
      setCurrentMissionId: (currentMissionId) => set({ currentMissionId }),
      advanceToNextPendingMission: () =>
        set((state) => {
          const next = state.missions.find((m) => m.status === "pending");
          return { currentMissionId: next ? next.id : null };
        }),

      // Errors
      setLastError: (lastError) => set({ lastError }),
      setLastRequest: (type, payload) =>
        set({ lastRequestType: type, lastRequestPayload: payload }),
      clearErrorAndRequest: () =>
        set({
          lastError: null,
          lastRequestType: null,
          lastRequestPayload: null,
        }),
      setPersonalisedSiteRequested: (requested) =>
        set({ personalisedSiteRequested: requested }),
      setSelectedSuggestionKey: (selectedSuggestionKey) =>
        set({ selectedSuggestionKey }),
      getClarificationSuggestions: () => {
        const state = get();
        if (!state.selectedSuggestionKey) return [];
        const suggestions =
          state.clarificationSuggestions[state.selectedSuggestionKey];
        return suggestions || [];
      },

      // Time Tracking Getters
      getCaseStudyTimeSpent: () => get().caseStudyTimeSpent,
      getProcessSectionTimeSpent: () => get().processSectionTimeSpent,
      getVapiTimeSpent: () => get().vapiTimeSpent,
      addCaseStudyTime: (id, seconds) =>
        set((state) => ({
          caseStudyTimeSpent: {
            ...state.caseStudyTimeSpent,
            [id]: (state.caseStudyTimeSpent[id] || 0) + Math.max(0, seconds),
          },
        })),
      addProcessSectionTime: (id, seconds) =>
        set((state) => ({
          processSectionTimeSpent: {
            ...state.processSectionTimeSpent,
            [id]:
              (state.processSectionTimeSpent[id] || 0) + Math.max(0, seconds),
          },
        })),
      addVapiTime: (seconds) =>
        set((state) => ({
          vapiTimeSpent: state.vapiTimeSpent + Math.max(0, seconds),
        })),

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
          chatHistory: sessionData.chat_history || [],
          hasCompletedOnboarding: sessionData.has_completed_onboarding || false,
          theme: sessionData.theme || "dark",
          animations:
            sessionData.animations !== undefined
              ? sessionData.animations
              : true,
          sidebarOpen: false,
          recommendedCaseStudies: sessionData.recommended_case_studies || [],
          caseStudyTimeSpent: sessionData.case_study_time_spent || 0,
          processSectionTimeSpent: sessionData.process_section_time_spent || 0,
          vapiTimeSpent: sessionData.vapi_time_spent || 0,
          goalSuggestions: createDefaultGoalSuggestions(),
          clarificationSuggestions: createDefaultClarificationSuggestions(),
          selectedSuggestionKey: null,
        }),
      resetSession: () =>
        set({
          goal: null,
          headline: null,
          personalised: null,
          missions: [],
          recommendedCaseStudies: [],
          pointsTotal: 0,
          chatHistory: [],
          isThinking: false,
          currentContext: null,
          inputValue: "",
          voiceInputValue: "",
          isFocused: false,
          isRecording: false,
          sidebarOpen: true,
          hasCompletedOnboarding: false,
          theme: "dark",
          animations: true,
          callUnlocked: false,
          hasSession: false,
          isEnsuringSession: false,
          isSubmittingGoal: false,
          isClarifying: false,
          isFetchingProgress: false,
          isCheckingUnlock: false,
          currentMissionId: null,
          lastError: null,
          lastRequestType: null,
          lastRequestPayload: null,
          personalisedSiteRequested: false,
          selectedSuggestionKey: null,
          goalSuggestions: createDefaultGoalSuggestions(),
          clarificationSuggestions: createDefaultClarificationSuggestions(),
          caseStudyTimeSpent: {},
          processSectionTimeSpent: {},
          vapiTimeSpent: 0,
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
        lastError: state.lastError,
        lastRequestType: state.lastRequestType,
        lastRequestPayload: state.lastRequestPayload,
        personalisedSiteRequested: state.personalisedSiteRequested,
        selectedSuggestionKey: state.selectedSuggestionKey,
        clarificationSuggestions: state.clarificationSuggestions,
        goalSuggestions: state.goalSuggestions,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        theme: state.theme,
        animations: state.animations,
        sidebarOpen: state.sidebarOpen,
        personalised: state.personalised,
        caseStudyTimeSpent: state.caseStudyTimeSpent,
        processSectionTimeSpent: state.processSectionTimeSpent,
        vapiTimeSpent: state.vapiTimeSpent,
      }),
    },
  ),
);
