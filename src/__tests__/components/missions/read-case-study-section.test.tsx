import { render, screen, fireEvent } from "@testing-library/react";
import ReadCaseStudySection from "@/components/missions/read-case-study-section";
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

const caseStudyMission: Mission = {
	id: "mission-case-study",
	title: "Review the hospitality playbook",
	description: "Read the recommended case study.",
	points: 20,
	status: "pending",
	icon: "BookOpen",
	input: {
		required: false,
		type: "text",
		placeholder: "",
	},
	missionType: "READ_CASE_STUDY",
	options: { targetCaseStudyId: "case-42" },
	artifact: { answer: "" },
};

type MissionState = {
	completed: boolean;
	submitting: boolean;
	error: string | null;
	targetCaseStudy: { id: string; title: string } | null;
	requiredSeconds: number;
	timeSpent: number;
};

const createState = (
	overrides: Partial<MissionState> = {}
): MissionState => ({
	completed: false,
	submitting: false,
	error: null,
	targetCaseStudy: { id: "case-42", title: "AI-led hospitality growth" },
	requiredSeconds: 30,
	timeSpent: 0,
	...overrides,
});

describe("ReadCaseStudySection", () => {
	beforeAll(() => {
		if (!window.scrollTo) {
			window.scrollTo = jest.fn();
		}
	});

	beforeEach(() => {
		jest.clearAllMocks();
		useInView.mockReturnValue(false);
	});

	it("opens the case study when not yet ready", () => {
		const openCaseStudy = jest.fn();

	render(
		<ReadCaseStudySection
			mission={caseStudyMission}
			state={createState({ timeSpent: 0 })}
			onConfirm={jest.fn()}
			openCaseStudy={openCaseStudy}
		/>
	);

	fireEvent.click(screen.getByRole("button", { name: /Open/i }));
		expect(openCaseStudy).toHaveBeenCalled();
	});

	it("confirms the mission once sufficient time has been tracked", () => {
		const onConfirm = jest.fn();

		render(
			<ReadCaseStudySection
				mission={caseStudyMission}
				state={createState({ timeSpent: 40 })}
				onConfirm={onConfirm}
				openCaseStudy={jest.fn()}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
		expect(onConfirm).toHaveBeenCalled();
	});

	it("auto-submits when the section is in view and requirements are met", () => {
		const onConfirm = jest.fn();
		useInView.mockReturnValue(true);

		render(
			<ReadCaseStudySection
				mission={caseStudyMission}
				state={createState({ timeSpent: 35 })}
				onConfirm={onConfirm}
				openCaseStudy={jest.fn()}
			/>
		);

		expect(onConfirm).toHaveBeenCalled();
	});

	it("renders contextual helper text and error messages", () => {
		const { rerender } = render(
			<ReadCaseStudySection
				mission={caseStudyMission}
				state={createState({ error: "Could not record time" })}
				onConfirm={jest.fn()}
				openCaseStudy={jest.fn()}
			/>
		);

		expect(
			screen.getByText("Could not record time")
		).toBeInTheDocument();

		rerender(
			<ReadCaseStudySection
				mission={caseStudyMission}
				state={createState({ timeSpent: 30 })}
				onConfirm={jest.fn()}
				openCaseStudy={jest.fn()}
			/>
		);

		expect(
			screen.getByText("You can now confirm")
		).toBeInTheDocument();
	});
});
