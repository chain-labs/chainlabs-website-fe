import { render, screen, fireEvent } from "@testing-library/react";
import VapiCallMissionSection from "@/components/missions/vapi-call-mission-section";
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
	id: "mission-vapi",
	title: "Try the guided Vapi call",
	description: "Experience the tailored AI call flow.",
	points: 25,
	status: "pending",
	icon: "Phone",
	input: { required: false, type: "text", placeholder: "" },
	missionType: "VAPI_WEB_CALL",
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
	requiredSeconds: 45,
	timeSpent: 0,
	...overrides,
});

describe("VapiCallMissionSection", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		useInView.mockReturnValue(false);
	});

	it("invites the user to start a call until the timer is satisfied", () => {
		const callVapi = jest.fn();
		render(
			<VapiCallMissionSection
				mission={mission}
				state={createState()}
				onConfirm={jest.fn()}
				callVapi={callVapi}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: /Call Vapi/i }));
		expect(callVapi).toHaveBeenCalled();
	});

	it("switches to confirm once enough time has been logged", () => {
		const onConfirm = jest.fn();
		render(
			<VapiCallMissionSection
				mission={mission}
				state={createState({ timeSpent: 50 })}
				onConfirm={onConfirm}
				callVapi={jest.fn()}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
		expect(onConfirm).toHaveBeenCalled();
	});

	it("auto-submits when ready and in view", () => {
		const onConfirm = jest.fn();
		useInView.mockReturnValue(true);

		render(
			<VapiCallMissionSection
				mission={mission}
				state={createState({ timeSpent: 60 })}
				onConfirm={onConfirm}
				callVapi={jest.fn()}
			/>
		);

		expect(onConfirm).toHaveBeenCalled();
	});

	it("allows calling Vapi again after completion", () => {
		const callVapi = jest.fn();
		render(
			<VapiCallMissionSection
				mission={mission}
				state={createState({ completed: true })}
				onConfirm={jest.fn()}
				callVapi={callVapi}
			/>
		);

		const button = screen.getByRole("button", { name: /Call Again/i });
		expect(button).not.toBeDisabled();
		fireEvent.click(button);
		expect(callVapi).toHaveBeenCalled();
	});
});
