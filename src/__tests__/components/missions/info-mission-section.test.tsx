import { render, screen, fireEvent } from "@testing-library/react";
import InfoMissionSection from "@/components/missions/info-mission-section";
import type { Mission } from "@/types/store";

const makeMission = (overrides: Partial<Mission> = {}): Mission => ({
	id: "mission-info",
	title: "Review quick start",
	description: "Read the quick overview.",
	points: 5,
	status: "pending",
	icon: "Info",
	input: {
		required: false,
		type: "text",
		placeholder: "",
	},
	missionType: "GOAL_INPUT",
	options: { targetCaseStudyId: "N/A" },
	artifact: { answer: "" },
	...overrides,
});

type MissionState = {
	completed: boolean;
	submitting: boolean;
	error: string | null;
};

const createState = (overrides: Partial<MissionState> = {}): MissionState => ({
	completed: false,
	submitting: false,
	error: null,
	...overrides,
});

describe("InfoMissionSection", () => {
	it("shows helper copy and triggers confirm when clicked", () => {
		const onConfirm = jest.fn();

		render(
			<InfoMissionSection
				mission={makeMission({ points: 12 })}
				state={createState()}
				onConfirm={onConfirm}
			/>
		);

		expect(
			screen.getByText(/Review this step then confirm/i)
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: /Confirm/i }));
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});

	it("disables the confirm button when submitting or completed", () => {
		const { rerender } = render(
			<InfoMissionSection
				mission={makeMission()}
				state={createState({ submitting: true })}
				onConfirm={jest.fn()}
			/>
		);

		expect(
			screen.getByRole("button", { name: /\.\.\./i })
		).toBeDisabled();

		rerender(
			<InfoMissionSection
				mission={makeMission()}
				state={createState({ completed: true })}
				onConfirm={jest.fn()}
			/>
		);

		expect(
			screen.getByRole("button", { name: /Completed/i })
		).toBeDisabled();
	});

	it("surfaces error messages from mission state", () => {
		render(
			<InfoMissionSection
				mission={makeMission()}
				state={createState({ error: "Network error" })}
				onConfirm={jest.fn()}
			/>
		);

		expect(screen.getByText("Network error")).toBeInTheDocument();
	});
});
