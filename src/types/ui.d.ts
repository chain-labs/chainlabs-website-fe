export interface GoalSuggestionOption {
	key: string;
	label: string;
	helper?: string;
}

export interface UIState {
	isFocused: boolean;
	isRecording: boolean;
	showPersonalized: boolean;
	personalisedReady: boolean;
	personalisedSiteRequested: boolean;
	goalSuggestions: GoalSuggestionOption[];
	clarificationSuggestions: string[];
	selectedSuggestionKey: string | null;
	sidebarOpen: boolean;
	theme: "light" | "dark";
	animations: boolean;
}

export interface UIActions {
	setIsFocused: (focused: boolean) => void;
	setIsRecording: (recording: boolean) => void;
	toggleRecording: () => void;
	setPersonalisedSiteRequested: (requested: boolean) => void;
	setSelectedSuggestionKey: (key: string | null) => void;
	setSidebarOpen: (open: boolean) => void;
	toggleSidebar: () => void;
	setTheme: (theme: "light" | "dark") => void;
	toggleTheme: () => void;
	setAnimations: (enabled: boolean) => void;
}
