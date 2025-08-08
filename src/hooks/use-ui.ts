import { useGlobalStore } from "@/global-store";
import SpeechRecognition from "react-speech-recognition";

export const useUI = () => {
	const store = useGlobalStore();

	const toggleRecording = () => {
		if (!store.isRecording)
			SpeechRecognition.startListening({ continuous: true });
		else SpeechRecognition.stopListening();
		store.toggleRecording();
	};

	return {
		isFocused: store.isFocused,
		isRecording: store.isRecording,
		showPersonalized: store.showPersonalized,
		sidebarOpen: store.sidebarOpen,
		theme: store.theme,
		animations: store.animations,
		setIsFocused: store.setIsFocused,
		setIsRecording: store.setIsRecording,
		toggleRecording: toggleRecording,
		setShowPersonalized: store.setShowPersonalized,
		setSidebarOpen: store.setSidebarOpen,
		toggleSidebar: store.toggleSidebar,
		setTheme: store.setTheme,
		toggleTheme: store.toggleTheme,
		setAnimations: store.setAnimations,
	};
};
