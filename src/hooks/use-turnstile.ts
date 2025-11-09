import { useState, useRef, useCallback } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

interface UseTurnstileReturn {
	turnstileRef: React.RefObject<TurnstileInstance | null>;
	isVerified: boolean;
	isVerifying: boolean;
	error: string | null;
	verifyToken: (token: string) => Promise<boolean>;
	resetVerification: () => void;
}

export const useTurnstile = (): UseTurnstileReturn => {
	const turnstileRef = useRef<TurnstileInstance | null>(null);
	const [isVerified, setIsVerified] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const verifyToken = useCallback(async (token: string): Promise<boolean> => {
		setIsVerifying(true);
		setError(null);

		try {
			const response = await fetch("/api/verify-captcha", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});

			const data = await response.json();

			if (data.success) {
				setIsVerified(true);
				return true;
			} else {
				setError(data.error || "Verification failed");
				setIsVerified(false);
				return false;
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Network error";
			setError(errorMessage);
			setIsVerified(false);
			return false;
		} finally {
			setIsVerifying(false);
		}
	}, []);

	const resetVerification = useCallback(() => {
		setIsVerified(false);
		setError(null);
		turnstileRef.current?.reset();
	}, []);

	return {
		turnstileRef,
		isVerified,
		isVerifying,
		error,
		verifyToken,
		resetVerification,
	};
};
