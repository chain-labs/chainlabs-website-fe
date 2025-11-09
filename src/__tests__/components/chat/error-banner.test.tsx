import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorBanner } from "@/components/chat/error-banner";

describe("ErrorBanner", () => {
	it("renders the message and primary actions", () => {
		const onRetry = jest.fn();
		const onRestart = jest.fn();

		render(
			<ErrorBanner
				type="goal"
				message="Something went wrong"
				onRetry={onRetry}
				onRestart={onRestart}
			/>
		);

		expect(
			screen.getByText("Something went wrong")
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Try Again/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Restart/i })
		).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: /Try Again/i }));
		fireEvent.click(screen.getByRole("button", { name: /Restart/i }));

		expect(onRetry).toHaveBeenCalledTimes(1);
		expect(onRestart).toHaveBeenCalledTimes(1);
	});

	it("switches the secondary button label for chat errors", () => {
		render(
			<ErrorBanner type="chat" message="Cannot send" onRetry={jest.fn()} />
		);

		expect(
			screen.getByRole("button", { name: /Send new message/i })
		).toBeInTheDocument();
	});

	it("disables actions and shows retrying label while loading", () => {
		render(
			<ErrorBanner
				type="clarify"
				message="Clarification failed"
				onRetry={jest.fn()}
				onRestart={jest.fn()}
				loading
			/>
		);

		const retryButton = screen.getByRole("button", {
			name: /Try Again/i,
		});
		const restartButton = screen.getByRole("button", {
			name: /Restart/i,
		});

		expect(retryButton).toBeDisabled();
		expect(restartButton).toBeDisabled();
		expect(retryButton).toHaveTextContent("Retrying...");
	});
});
