import { render, screen, fireEvent } from "@testing-library/react";
import { OurMissions } from "@/components/missions/missions-section";
import type { Mission } from "@/types/store";

jest.mock("@/components/missions/mission-card", () =>
	jest.fn(({ mission }: { mission: Mission }) => (
		<div data-testid="mission-card">{mission.id}</div>
	))
);

jest.mock("@/hooks/use-missions", () => ({
	useMissions: jest.fn(),
}));

const MissionCardMock = jest.requireMock("@/components/missions/mission-card") as jest.Mock;
const { useMissions } = jest.requireMock("@/hooks/use-missions") as {
	useMissions: jest.Mock;
};

let personalisedState: any = null;

jest.mock("@/global-store", () => ({
	useGlobalStore: jest.fn((selector?: (state: any) => any) => {
		const state = personalisedState;
		if (selector) {
			return selector(state);
		}
		return state;
	}),
}));

const { useGlobalStore } = jest.requireMock("@/global-store") as {
	useGlobalStore: jest.Mock;
};

const buildMission = (overrides: Partial<Mission> = {}): Mission => ({
	id: "mission-a",
	title: "Mission A",
	description: "",
	points: 10,
	status: "pending",
	icon: "Target",
	input: { required: false, type: "text", placeholder: "" },
	missionType: "ADDITIONAL_INPUT",
	options: { targetCaseStudyId: "N/A" },
	artifact: { answer: "" },
	...overrides,
});

const createPersonalised = (missions: Mission[], points = 20) => ({
	personalised: {
		personalisation: {
			missions,
			points_total: points,
			call_unlocked: false,
		},
	},
});

describe("OurMissions", () => {
	beforeEach(() => {
		MissionCardMock.mockClear();
		useGlobalStore.mockClear();
		useMissions.mockReset();
		useMissions.mockReturnValue({ hasCompleted: jest.fn(() => false) });
		personalisedState = createPersonalised([]);
	});

	it("returns null when no personalised missions are available", () => {
		personalisedState = { personalised: null };
		expect(render(<OurMissions />).container.firstChild).toBeNull();

		personalisedState = createPersonalised([]);
		expect(render(<OurMissions />).container.firstChild).toBeNull();
	});

	it("splits missions into incomplete and completed lists", () => {
		const missions = [
			buildMission({ id: "mission-incomplete", status: "pending" }),
			buildMission({ id: "mission-complete", status: "completed" }),
		];
		const hasCompleted = jest.fn((id: string) => id === "mission-complete");
		useMissions.mockReturnValue({ hasCompleted });
		personalisedState = createPersonalised(missions, 35);

		render(<OurMissions />);

		const cards = screen.getAllByTestId("mission-card").map((el) => el.textContent);
		expect(cards).toEqual(["mission-incomplete", "mission-complete"]);
		const progress = screen.getByRole("progressbar", {
			name: /Points progress to unlock call/i,
		});
		expect(progress).toHaveAttribute("aria-valuenow", "35");
	});

	it("toggles visibility of completed missions", () => {
		const missions = [
			buildMission({ id: "mission-1", status: "pending" }),
			buildMission({ id: "mission-2", status: "completed" }),
		];
		useMissions.mockReturnValue({
			hasCompleted: (id: string) => id === "mission-2",
		});
		personalisedState = createPersonalised(missions);

		render(<OurMissions />);

		const toggle = screen.getByRole("button", { name: /Hide completed/i });
		expect(toggle).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByText("mission-2")).toBeInTheDocument();

		fireEvent.click(toggle);
		expect(toggle).toHaveAttribute("aria-expanded", "false");
		expect(screen.queryByText("mission-2")).not.toBeInTheDocument();

		fireEvent.click(toggle);
		expect(toggle).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByText("mission-2")).toBeInTheDocument();
	});
});
