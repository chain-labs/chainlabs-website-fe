import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChainLabsHero from "@/components/hero/chain-labs-hero";

jest.mock("@/hooks/use-chat", () => ({
	useChat: jest.fn(),
}));

jest.mock("@/hooks/use-ui", () => ({
	useUI: jest.fn(),
}));

jest.mock("@/global-store", () => ({
	useGlobalStore: jest.fn(),
}));

jest.mock("@/api-client", () => ({
	apiClient: {
		resetSession: jest.fn().mockResolvedValue(undefined),
		clearAuth: jest.fn(),
		initializeSession: jest.fn().mockResolvedValue(undefined),
	},
}));

jest.mock("react-speech-recognition", () => ({
	__esModule: true,
	default: {
		startListening: jest.fn(),
		stopListening: jest.fn(),
	},
	useSpeechRecognition: jest.fn(),
}));

function createStore(overrides: Partial<Record<string, any>> = {}) {
	return {
		lastError: null,
		lastRequestType: null,
		lastRequestPayload: null,
		clearErrorAndRequest: jest.fn(),
		resetSession: jest.fn(),
		resetSessionState: jest.fn(),
		personalised: null,
		personalisedSiteRequested: false,
		setPersonalisedSiteRequested: jest.fn(),
		setSelectedSuggestionKey: jest.fn(),
		hasGoal: () => false,
		...overrides,
	};
}

const baseChatState = {
	messages: [],
	isThinking: false,
	inputValue: "",
	voiceInputValue: "",
	hasMessages: false,
	isThisLatestAssistantMessage: false,
	sendMessage: jest.fn().mockResolvedValue(undefined),
	setInputValue: jest.fn(),
	setVoiceInputValue: jest.fn(),
};

const baseUIState = {
	isFocused: false,
	isRecording: false,
	goalSuggestions: [],
	clarificationSuggestions: [],
	selectedSuggestionKey: null,
	setSelectedSuggestionKey: jest.fn(),
	setIsFocused: jest.fn(),
	toggleRecording: jest.fn(),
	stopRecording: jest.fn(),
	personalisedReady: false,
	personalisedSiteRequested: false,
	showPersonalized: false,
};

const baseSpeechRecognition = {
	transcript: "",
	listening: false,
	resetTranscript: jest.fn(),
	browserSupportsSpeechRecognition: false,
};

const { useChat } = jest.requireMock("@/hooks/use-chat") as {
	useChat: jest.Mock;
};
const { useUI } = jest.requireMock("@/hooks/use-ui") as { useUI: jest.Mock };
const { useGlobalStore } = jest.requireMock("@/global-store") as {
	useGlobalStore: jest.Mock;
};
const { useSpeechRecognition } = jest.requireMock(
	"react-speech-recognition"
) as { useSpeechRecognition: jest.Mock };

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			matchMedia?: (query: string) => MediaQueryList;
		}
	}
}

const setup = ({
	chatOverrides = {},
	uiOverrides = {},
	storeOverrides = {},
	speechOverrides = {},
}: {
	chatOverrides?: Partial<typeof baseChatState>;
	uiOverrides?: Partial<typeof baseUIState>;
	storeOverrides?: Partial<ReturnType<typeof createStore>>;
	speechOverrides?: Partial<typeof baseSpeechRecognition>;
} = {}) => {
	const chatState = { ...baseChatState, ...chatOverrides };
	const uiState = { ...baseUIState, ...uiOverrides };
	const storeState = createStore(storeOverrides);
	const speechState = { ...baseSpeechRecognition, ...speechOverrides };

	useChat.mockReturnValue(chatState);
	useUI.mockReturnValue(uiState);
	useGlobalStore.mockImplementation((selector?: (state: any) => any) => {
		if (typeof selector === "function") {
			return selector(storeState);
		}
		return storeState;
	});
	useSpeechRecognition.mockReturnValue(speechState);

	return { chatState, uiState, storeState };
};

describe("ChainLabsHero", () => {
	let canvasContextSpy: jest.SpyInstance | undefined;

	beforeAll(() => {
		// jsdom does not provide matchMedia out of the box
		if (!window.matchMedia) {
			window.matchMedia = jest.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			}));
		}
		window.scrollTo = jest.fn();
		canvasContextSpy = jest
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null as unknown as CanvasRenderingContext2D);
	});

	afterAll(() => {
		canvasContextSpy?.mockRestore();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders hero copy when there are no messages", () => {
		setup();

		render(<ChainLabsHero />);

		expect(
			screen.getByText(/Unlock Growth with/i)
		).toBeInTheDocument();
		expect(
			screen.getByText(/AI & Blockchain Innovation Partner/i)
		).toBeInTheDocument();
	});

	it("renders the personalised CTA once a session is clarified", () => {
		const setPersonalisedSiteRequested = jest.fn();
		setup({
			storeOverrides: {
				personalised: { status: "CLARIFIED" },
				personalisedSiteRequested: false,
				setPersonalisedSiteRequested,
			},
		});

		render(<ChainLabsHero />);

		const cta = screen.getByRole("button", {
			name: /Take me to my personalised site/i,
		});
		fireEvent.click(cta);

		expect(setPersonalisedSiteRequested).toHaveBeenCalledWith(true);
	});

	it("shows goal suggestions and sends a message when one is selected", async () => {
		const sendMessage = jest.fn().mockResolvedValue(undefined);
		const setSelectedSuggestionKey = jest.fn();
		const setVoiceInputValue = jest.fn();

		setup({
			chatOverrides: {
				sendMessage,
				setVoiceInputValue,
			},
			uiOverrides: {
				goalSuggestions: [
					{
						key: "goal-1",
						label: "Increase conversions",
					},
				],
				setSelectedSuggestionKey,
			},
			storeOverrides: {
				hasGoal: () => false,
			},
		});

		render(<ChainLabsHero />);

		const suggestionButton = screen.getByRole("button", {
			name: /Increase conversions/i,
		});
		fireEvent.click(suggestionButton);

		await waitFor(() =>
			expect(sendMessage).toHaveBeenCalledWith("Increase conversions")
		);
		expect(setSelectedSuggestionKey).toHaveBeenCalledWith("goal-1");
		expect(setVoiceInputValue).toHaveBeenCalledWith("");
	});

	it("retries the last request when the error banner retry is pressed", async () => {
		const sendMessage = jest.fn().mockResolvedValue(undefined);
		const clearErrorAndRequest = jest.fn();

		setup({
			chatOverrides: {
				sendMessage,
			},
			storeOverrides: {
				lastError: "Failed to process your goal",
				lastRequestType: "goal",
				lastRequestPayload: "Improve retention",
				clearErrorAndRequest,
			},
		});

		render(<ChainLabsHero />);

		const retryButton = screen.getByRole("button", { name: /Try Again/i });
		fireEvent.click(retryButton);

		await waitFor(() =>
			expect(sendMessage).toHaveBeenCalledWith("Improve retention", {
				skipUserMessage: true,
				updateLastRequest: false,
			})
		);
		expect(clearErrorAndRequest).toHaveBeenCalled();
	});

	it("resets the session when restart is chosen for goal errors", async () => {
		const clearErrorAndRequest = jest.fn();
		const resetSession = jest.fn();

		setup({
			storeOverrides: {
				lastError: "Failed to process your goal",
				lastRequestType: "goal",
				lastRequestPayload: "Grow subscribers",
				clearErrorAndRequest,
				resetSession,
			},
		});

		render(<ChainLabsHero />);

		const restartButton = screen.getByRole("button", { name: /Restart/i });
		fireEvent.click(restartButton);

		await waitFor(() => expect(resetSession).toHaveBeenCalled());
		expect(clearErrorAndRequest).toHaveBeenCalled();
	});
});
