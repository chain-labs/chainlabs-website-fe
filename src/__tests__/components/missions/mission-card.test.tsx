import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MissionCard from "@/components/missions/mission-card";
import type { Mission } from "@/types/store";

jest.mock("@/hooks/use-missions", () => ({
	useMissions: jest.fn(),
}));

jest.mock("@/global-store", () => ({
	useGlobalStore: jest.fn(),
}));

jest.mock("motion/react", () => {
	const actual = jest.requireActual("motion/react");
	return {
		...actual,
		useInView: jest.fn().mockReturnValue(false),
	};
});

const { useMissions } = jest.requireMock("@/hooks/use-missions") as {
	useMissions: jest.Mock;
};
const { useGlobalStore } = jest.requireMock("@/global-store") as {
	useGlobalStore: jest.Mock;
};

const makeMission = (overrides: Partial<Mission> = {}): Mission => ({
	id: "mission-001",
	title: "Explore tailored process",
	description: "Walk through the recommended steps.",
	points: 12,
	status: "pending",
	icon: "Compass",
	input: {
		required: true,
		type: "text",
		placeholder: "Optional placeholder",
	},
	missionType: "VIEW_PROCESS",
	options: { targetCaseStudyId: "N/A" },
	artifact: { answer: "" },
	...overrides,
});

type MissionHook = {
	submitAnswer: jest.Mock;
	getMissionStatus: jest.Mock;
	hasCompleted: jest.Mock;
	isSubmitting: jest.Mock;
	getError: jest.Mock;
};

const createMissionHook = (overrides: Partial<MissionHook> = {}): MissionHook => {
	const hook: MissionHook = {
		submitAnswer: jest.fn().mockResolvedValue(undefined),
		getMissionStatus: jest.fn().mockReturnValue("pending"),
		hasCompleted: jest.fn().mockReturnValue(false),
		isSubmitting: jest.fn().mockReturnValue(false),
		getError: jest.fn().mockReturnValue(null),
		...overrides,
	};
	useMissions.mockReturnValue(hook);
	return hook;
};

let storeState: any;

beforeAll(() => {
	if (!window.scrollTo) {
		window.scrollTo = jest.fn();
	}
});

beforeEach(() => {
	storeState = {
		personalised: {
			personalisation: {
				missions: [],
				caseStudies: [],
				points_total: 0,
			},
		},
		caseStudyTimeSpent: {},
		processSectionTimeSpent: {},
		vapiTimeSpent: 0,
	};
	useGlobalStore.mockImplementation((selector?: (state: any) => any) =>
		selector ? selector(storeState) : storeState
	);
	createMissionHook();
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("MissionCard", () => {
	it("renders mission metadata and shows pending status", () => {
		render(<MissionCard mission={makeMission()} index={0} />);

		expect(
			screen.getByRole("listitem", {
				name: /Explore tailored process/i,
			})
		).toBeInTheDocument();
		expect(screen.getAllByText(/Pending/i).length).toBeGreaterThan(0);
		const pointsBadge = screen.getByLabelText("Points for this mission");
		expect(pointsBadge).toHaveTextContent("12");
	});

	it("confirms a process mission once the required time is met", async () => {
		storeState.processSectionTimeSpent = { sectionA: 45 };
		const hook = createMissionHook();
		const mission = makeMission();

		render(<MissionCard mission={mission} index={0} />);

		fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
		await waitFor(() =>
			expect(hook.submitAnswer).toHaveBeenCalledWith(
				mission.id,
				"Viewed process section"
			)
		);
	});

	it("opens the case study when the mission is a reading step", () => {
		const mission = makeMission({
			id: "mission-case",
			missionType: "READ_CASE_STUDY",
			options: { targetCaseStudyId: "case-study-7" },
		});
		storeState.personalised.personalisation.caseStudies = [
			{ id: "case-study-7", title: "AI-led hospitality growth" } as any,
		];
		storeState.caseStudyTimeSpent = { "case-study-7": 0 };
		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = (cb: FrameRequestCallback) => {
				cb(0);
				return 0;
			};
		}
		const rafSpy = jest
			.spyOn(window, "requestAnimationFrame")
			.mockImplementation((cb) => {
				cb(0);
				return 0;
			});
		const dispatchSpy = jest.spyOn(window, "dispatchEvent");
		const scrollIntoView = jest.fn();
		const getElementSpy = jest
			.spyOn(document, "getElementById")
			.mockImplementation((id: string) => {
				if (id === "case-studies") {
					return { scrollIntoView } as unknown as HTMLElement;
				}
				return null;
			});

		render(<MissionCard mission={mission} index={0} />);

		fireEvent.click(screen.getByRole("button", { name: /Open/i }));

		expect(dispatchSpy).toHaveBeenCalledWith(
			expect.objectContaining({
				type: "openCaseStudy",
				detail: { caseStudyId: "case-study-7" },
			})
		);
		expect(getElementSpy).toHaveBeenCalledWith("case-studies");
		expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

		rafSpy.mockRestore();
		dispatchSpy.mockRestore();
		getElementSpy.mockRestore();
	});

	it("routes input missions through the text workflow", async () => {
		const mission = makeMission({
			id: "mission-input",
			missionType: "ADDITIONAL_INPUT",
			input: {
				required: true,
				type: "text",
				placeholder: "Share your blocker",
			},
		});
		const hook = createMissionHook();

		render(<MissionCard mission={mission} index={0} />);

		const textarea = screen.getByLabelText(
			`Answer for mission ${mission.title}`
		);
		fireEvent.change(textarea, { target: { value: "Need GTM support" } });
		const form = textarea.closest("form");
		expect(form).not.toBeNull();
		fireEvent.submit(form!);

		await waitFor(() =>
			expect(hook.submitAnswer).toHaveBeenCalledWith(
				mission.id,
				"Need GTM support"
			)
		);
	});
});
