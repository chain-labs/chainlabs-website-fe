import { useGlobalStore } from "@/global-store";

export const useUI = () => {
	const store = useGlobalStore();

	return {
		isFocused: store.isFocused,
		isRecording: store.isRecording,
		showPersonalized: store.showPersonalized,
		sidebarOpen: store.sidebarOpen,
		theme: store.theme,
		animations: store.animations,

		setIsFocused: store.setIsFocused,
		setIsRecording: store.setIsRecording,
		toggleRecording: store.toggleRecording,
		setShowPersonalized: store.setShowPersonalized,
		setSidebarOpen: store.setSidebarOpen,
		toggleSidebar: store.toggleSidebar,
		setTheme: store.setTheme,
		toggleTheme: store.toggleTheme,
		setAnimations: store.setAnimations,
	};
};
