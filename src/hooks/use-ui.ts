import { useGlobalStore } from "@/global-store";
import SpeechRecognition, {
	useSpeechRecognition,
} from "react-speech-recognition";

export const useUI = () => {
	const store = useGlobalStore();
	const { resetTranscript } = useSpeechRecognition();

	const toggleRecording = () => {
		store.toggleRecording();
		if (store.isRecording) {
			SpeechRecognition.stopListening();
			resetTranscript();
		} else {
			SpeechRecognition.startListening({ continuous: true });
		}
	};

	return {
		isFocused: store.isFocused,
		isRecording: store.isRecording,
		showPersonalized: store.personalised?.status === "CLARIFIED",
		sidebarOpen: store.sidebarOpen,
		theme: store.theme,
		animations: store.animations,
		setIsFocused: store.setIsFocused,
		setIsRecording: store.setIsRecording,
		toggleRecording: toggleRecording,
		stopRecording: store.stopRecording,
		setShowPersonalized: store.personalised?.status === "CLARIFIED",
		setSidebarOpen: store.setSidebarOpen,
		toggleSidebar: store.toggleSidebar,
		setTheme: store.setTheme,
		toggleTheme: store.toggleTheme,
		setAnimations: store.setAnimations,
	};
};
