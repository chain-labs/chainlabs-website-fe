import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Footer } from "@/components/footer";

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

const { useGlobalStore } = jest.requireMock("@/global-store") as {
	useGlobalStore: jest.Mock;
};

const { apiClient } = jest.requireMock("@/api-client") as {
	apiClient: {
		resetSession: jest.Mock;
		clearAuth: jest.Mock;
		initializeSession: jest.Mock;
	};
};

const createStore = (overrides: Partial<Record<string, any>> = {}) => ({
	personalised: {
		personalisation: {
			call_unlocked: false,
		},
	},
	resetSession: jest.fn(),
	...overrides,
});

const renderFooter = (
	storeOverrides: Partial<ReturnType<typeof createStore>> = {}
) => {
	const storeState = createStore(storeOverrides);

	useGlobalStore.mockImplementation((selector?: (state: any) => any) => {
		if (typeof selector === "function") {
			return selector(storeState);
		}
		return storeState;
	});

	return {
		storeState,
		...render(<Footer showPersonalized={false} />),
	};
};

describe("Footer", () => {
	beforeAll(() => {
		window.scrollTo = jest.fn();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("shows the locked book-a-call CTA when missions are incomplete", () => {
		renderFooter();

		expect(
			screen.getByRole("button", { name: /Book a Call/i })
		).toBeInTheDocument();
		expect(
			screen.getByText(/Complete the missions to unlock/i)
		).toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: /Book a Call/i })
		).not.toBeInTheDocument();
	});

	it("renders a direct book-a-call link once unlocked", () => {
		renderFooter({
			personalised: {
				personalisation: { call_unlocked: true },
			},
		});

		const link = screen.getByRole("link", { name: /Book a Call/i });
		expect(link).toHaveAttribute("href", "#book-a-call");
	});

	it("resets the session when reset session is triggered", async () => {
		const resetSession = jest.fn();
		renderFooter({ resetSession });

		const resetButton = screen.getByRole("button", {
			name: /Reset session/i,
		});
		fireEvent.click(resetButton);

		await waitFor(() => expect(apiClient.resetSession).toHaveBeenCalled());
		expect(apiClient.clearAuth).toHaveBeenCalled();
		expect(apiClient.initializeSession).toHaveBeenCalled();
		expect(resetSession).toHaveBeenCalled();
	});
});
