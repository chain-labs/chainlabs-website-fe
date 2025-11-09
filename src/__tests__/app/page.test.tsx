import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

const getPersonalizedContent = jest.fn();

jest.mock("@/hooks/use-chat", () => ({
	useChat: jest.fn(),
}));

jest.mock("@/hooks/use-ui", () => ({
	useUI: jest.fn(),
}));

const { useChat } = jest.requireMock("@/hooks/use-chat") as {
	useChat: jest.Mock;
};
const { useUI } = jest.requireMock("@/hooks/use-ui") as {
	useUI: jest.Mock;
};

jest.mock("@/components/header", () => ({
	Header: ({ showPersonalized }: { showPersonalized: boolean }) => (
		<header data-testid="header">
			header:{showPersonalized ? "personalized" : "default"}
		</header>
	),
}));

jest.mock("@/components/hero/chain-labs-hero", () => () => (
	<section>ChainLabs Hero</section>
));

jest.mock("@/components/footer", () => ({
	Footer: () => <footer>footer</footer>,
}));

jest.mock("@/components/chat/ai-chat-bubble", () => () => (
	<div data-testid="ai-bubble" />
));

jest.mock("@/components/splash/splash-screen", () => ({
	SplashScreen: ({ onComplete }: { onComplete: () => void }) => {
		setTimeout(onComplete, 0);
		return null;
	},
}));

jest.mock("@/components/personalise/personalise-hero-section", () => () => (
	<section>Personalised Hero</section>
));

jest.mock("@/components/process/process-section", () => ({
	ProcessSection: () => <section>Process Section</section>,
}));

jest.mock("@/components/testimonials/scrolling-carousel-testimonials", () => ({
	ScrollingCarouselTestimonials: () => (
		<section>Testimonials Section</section>
	),
}));

jest.mock("@/components/casestudies/responsive-grid-casestudies", () => ({
	ResponsiveGridCasestudies: () => (
		<section>Case Studies Section</section>
	),
}));

jest.mock("@/components/missions/missions-section", () => ({
	OurMissions: () => <section>Missions Section</section>,
}));

jest.mock("@/components/book/book-a-call", () => ({
	BookCallSection: () => <section>Book Call Section</section>,
}));

describe("Home page", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useChat.mockReturnValue({ getPersonalizedContent });
		useUI.mockReturnValue({ showPersonalized: false });
	});

	it("renders default hero when personalization is off", () => {
		render(<Home />);

		expect(screen.getByText("ChainLabs Hero")).toBeInTheDocument();
		expect(screen.queryByText("Personalised Hero")).not.toBeInTheDocument();
		expect(getPersonalizedContent).toHaveBeenCalled();
	});

	it("renders personalized layout when personalization is enabled", () => {
		useUI.mockReturnValue({ showPersonalized: true });

		render(<Home />);

		expect(screen.getByText("Personalised Hero")).toBeInTheDocument();
		expect(screen.getByText("Process Section")).toBeInTheDocument();
		expect(screen.getByText("Testimonials Section")).toBeInTheDocument();
		expect(screen.getByText("Case Studies Section")).toBeInTheDocument();
		expect(screen.getByText("Missions Section")).toBeInTheDocument();
		expect(screen.getByText("Book Call Section")).toBeInTheDocument();
		expect(screen.queryByText("ChainLabs Hero")).not.toBeInTheDocument();
		expect(getPersonalizedContent).toHaveBeenCalled();
	});
});
