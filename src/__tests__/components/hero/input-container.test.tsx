import { render, screen, fireEvent } from "@testing-library/react";
import InputContainer from "@/components/hero/input-container";

jest.mock("@/hooks/use-chat", () => ({
	useChat: jest.fn().mockReturnValue({ placeHolder: "Describe your goal" }),
}));

jest.mock("@/hooks/use-mobile", () => ({
	useIsMobile: jest.fn(),
}));

const { useIsMobile } = jest.requireMock("@/hooks/use-mobile") as {
	useIsMobile: jest.Mock;
};

const baseProps = {
	inputValue: "",
	isFocused: false,
	isRecording: false,
	hasMessages: false,
	onInputChange: jest.fn(),
	onKeyDown: jest.fn(),
	onFocus: jest.fn(),
	onBlur: jest.fn(),
	onToggleRecording: jest.fn(),
	removeVoiceInput: false,
	disabled: false,
	browserSupportsSpeechRecognition: true,
};

const renderComponent = (overrideProps: Partial<typeof baseProps> = {}) => {
	useIsMobile.mockReturnValue(false);
	const props = { ...baseProps, ...overrideProps };
	return {
		props,
		...render(<InputContainer {...props} />),
	};
};

describe("InputContainer", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useIsMobile.mockReturnValue(false);
	});

	it("renders the placeholder from the chat hook", () => {
		renderComponent();

		expect(
			screen.getByPlaceholderText("Describe your goal")
		).toBeInTheDocument();
	});

	it("shows the send button when there is input", () => {
		renderComponent({ inputValue: "Build an AI assistant" });

		expect(
			screen.getByRole("button", { name: /send/i })
		).toBeInTheDocument();
	});

	it("forwards keyboard events that are not handled internally", () => {
		const onKeyDown = jest.fn();
		renderComponent({ onKeyDown });

		const textarea = screen.getByRole("textbox", {
			name: /Describe your business/i,
		});
		fireEvent.keyDown(textarea, { key: "a", code: "KeyA" });

		expect(onKeyDown).toHaveBeenCalled();
	});

	it("renders the microphone toggle when speech recognition is available", () => {
		const onToggleRecording = jest.fn();
		renderComponent({ onToggleRecording });

		const micButton = screen.getByRole("button", {
			name: /Start recording/i,
		});
		fireEvent.click(micButton);

		expect(onToggleRecording).toHaveBeenCalledTimes(1);
	});

	it("hides microphone controls when speech recognition is unavailable", () => {
		renderComponent({
			removeVoiceInput: true,
			browserSupportsSpeechRecognition: false,
		});

		expect(
			screen.queryByRole("button", { name: /Start recording/i })
		).not.toBeInTheDocument();
	});
});
