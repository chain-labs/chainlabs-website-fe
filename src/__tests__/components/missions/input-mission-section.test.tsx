import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputMissionSection from "@/components/missions/input-mission-section";
import type { Mission } from "@/types/store";

const baseMission: Mission = {
	id: "mission-1",
	title: "Share your biggest hurdle",
	description: "Tell us where you are blocked.",
	points: 10,
	status: "pending",
	icon: "MessageSquare",
	input: {
		required: true,
		type: "text",
		placeholder: "Describe your current challenge",
	},
	missionType: "ADDITIONAL_INPUT",
	options: {
		targetCaseStudyId: "N/A",
	},
	artifact: {
		answer: "",
	},
};

type MissionState = {
	submitAnswer: jest.Mock<any, any>;
	completed: boolean;
	submitting: boolean;
	error: string | null;
};

const createState = (overrides: Partial<MissionState> = {}): MissionState => ({
	submitAnswer: jest.fn().mockResolvedValue(undefined),
	completed: false,
	submitting: false,
	error: null,
	...overrides,
});

describe("InputMissionSection", () => {
	it("renders placeholder from the mission input and character counter", () => {
		const setAnswer = jest.fn();
		render(
			<InputMissionSection
				mission={baseMission}
				answer=""
				setAnswer={setAnswer}
				state={createState()}
			/>
		);

		const textarea = screen.getByPlaceholderText(
			"Describe your current challenge"
		);
		expect(textarea).toBeInTheDocument();
		expect(screen.getByText("0/280")).toBeInTheDocument();
	});

	it("submits trimmed input and clears the field", async () => {
		const setAnswer = jest.fn();
		const state = createState();
		render(
			<InputMissionSection
				mission={baseMission}
				answer="   Ship faster "
				setAnswer={setAnswer}
				state={state}
			/>
		);

		const textarea = screen.getByLabelText(/Answer for mission/i);
		const form = textarea.closest("form");
		expect(form).not.toBeNull();
		fireEvent.submit(form!);

		await waitFor(() =>
			expect(state.submitAnswer).toHaveBeenCalledWith(
				baseMission.id,
				"Ship faster"
			)
		);
		expect(setAnswer).toHaveBeenCalledWith("");
	});

	it("allows Ctrl+Enter to submit the form", async () => {
		const state = createState();
		const setAnswer = jest.fn();
		render(
			<InputMissionSection
				mission={baseMission}
				answer="Need to reduce churn"
				setAnswer={setAnswer}
				state={state}
			/>
		);

		const textarea = screen.getByLabelText(/Answer for mission/i);
		fireEvent.keyDown(textarea, {
			key: "Enter",
			ctrlKey: true,
		});

		await waitFor(() =>
			expect(state.submitAnswer).toHaveBeenCalledWith(
				baseMission.id,
				"Need to reduce churn"
			)
		);
	});

	it("shows validation errors and disables the form when completed", () => {
		const setAnswer = jest.fn();
		const state = createState({
			completed: true,
			error: "Answer cannot be empty",
		});

		render(
			<InputMissionSection
				mission={baseMission}
				answer=""
				setAnswer={setAnswer}
				state={state}
			/>
		);

		expect(
			screen.getByText("Answer cannot be empty")
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Completed/i })).toBeDisabled();
		expect(
			screen.getByPlaceholderText("This mission is completed.")
		).toBeDisabled();
	});

	it("clears the answer when Clear is pressed", () => {
		const setAnswer = jest.fn();
		const state = createState();

		render(
			<InputMissionSection
				mission={baseMission}
				answer="Draft response"
				setAnswer={setAnswer}
				state={state}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: /Clear/i }));
		expect(setAnswer).toHaveBeenCalledWith("");
	});
});
