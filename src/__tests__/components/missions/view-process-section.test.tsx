import { render, screen, fireEvent } from "@testing-library/react";
import ViewProcessSection from "@/components/missions/view-process-section";
import type { Mission } from "@/types/store";

jest.mock("motion/react", () => {
	const actual = jest.requireActual("motion/react");
	return {
		...actual,
		useInView: jest.fn().mockReturnValue(false),
	};
});

const { useInView } = jest.requireMock("motion/react") as {
	useInView: jest.Mock;
};

const mission: Mission = {
	id: "mission-process",
	title: "Review our delivery process",
	description: "Understand each step we take",
	points: 15,
	status: "pending",
	icon: "List",
	input: {
		required: false,
		type: "text",
		placeholder: "",
	},
	missionType: "VIEW_PROCESS",
	options: { targetCaseStudyId: "N/A" },
	artifact: { answer: "" },
};

type MissionState = {
	completed: boolean;
	submitting: boolean;
	error: string | null;
	requiredSeconds: number;
	timeSpent: number;
};

const createState = (overrides: Partial<MissionState> = {}): MissionState => ({
	completed: false,
	submitting: false,
	error: null,
	requiredSeconds: 30,
	timeSpent: 0,
	...overrides,
});

describe("ViewProcessSection", () => {
	beforeAll(() => {
		if (!window.scrollTo) {
			window.scrollTo = jest.fn();
		}
	});

	beforeEach(() => {
		jest.clearAllMocks();
		useInView.mockReturnValue(false);
	});

	it("opens the process section when not yet ready", () => {
		const onConfirm = jest.fn();
		render(
			<ViewProcessSection
				mission={mission}
				state={createState({ timeSpent: 0 })}
				onConfirm={onConfirm}
			/>
		);

		const scrollIntoView = jest.fn();
		const getElementSpy = jest
			.spyOn(document, "getElementById")
			.mockReturnValue({ scrollIntoView } as unknown as HTMLElement);

		fireEvent.click(screen.getByRole("button", { name: /Open/i }));
		expect(onConfirm).not.toHaveBeenCalled();
		expect(getElementSpy).toHaveBeenCalledWith("processes");
		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
		getElementSpy.mockRestore();
	});

	it("enables confirmation once enough time has been spent", () => {
		const onConfirm = jest.fn();
		render(
			<ViewProcessSection
				mission={mission}
				state={createState({ timeSpent: 35 })}
				onConfirm={onConfirm}
			/>
		);

		const button = screen.getByRole("button", { name: /Confirm/i });
		fireEvent.click(button);
		expect(onConfirm).toHaveBeenCalled();
	});

	it("auto-confirms when the section is in view and requirements met", () => {
		const onConfirm = jest.fn();
		useInView.mockReturnValue(true);

		render(
			<ViewProcessSection
				mission={mission}
				state={createState({ timeSpent: 40 })}
				onConfirm={onConfirm}
			/>
		);

		expect(onConfirm).toHaveBeenCalled();
	});

	it("shows state specific helper copy and error messaging", () => {
		const { rerender } = render(
			<ViewProcessSection
				mission={mission}
				state={createState({ error: "Failed to track time" })}
				onConfirm={jest.fn()}
			/>
		);

		expect(
			screen.getByText("Failed to track time")
		).toBeInTheDocument();

		rerender(
			<ViewProcessSection
				mission={mission}
				state={createState({ timeSpent: 30 })}
				onConfirm={jest.fn()}
			/>
		);

		expect(
			screen.getByText("You can now confirm")
		).toBeInTheDocument();
	});
});
