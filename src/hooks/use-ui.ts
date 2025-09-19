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

	const showPersonalized =
		store.personalised?.status === "CLARIFIED" &&
		store.personalisedSiteRequested;
	const personalisedReady = store.personalised?.status === "CLARIFIED";

	return {
		isFocused: store.isFocused,
		isRecording: store.isRecording,
		showPersonalized,
		personalisedReady,
		personalisedSiteRequested: store.personalisedSiteRequested,
		sidebarOpen: store.sidebarOpen,
		theme: store.theme,
		animations: store.animations,
		setIsFocused: store.setIsFocused,
		setIsRecording: store.setIsRecording,
		toggleRecording: toggleRecording,
		stopRecording: store.stopRecording,
		setPersonalisedSiteRequested: store.setPersonalisedSiteRequested,
		setSidebarOpen: store.setSidebarOpen,
		toggleSidebar: store.toggleSidebar,
		setTheme: store.setTheme,
		toggleTheme: store.toggleTheme,
		setAnimations: store.setAnimations,
	};
};
