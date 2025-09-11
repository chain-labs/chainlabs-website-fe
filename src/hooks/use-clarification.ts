import { useCallback, useRef, useState } from "react";
import { apiClient } from "../api-client";

export type ClarificationData = {
	missions: {
		id: string;
		title: string;
		description: string;
		points: number;
	}[];
	hero: {
		title: string;
		description: string;
	};
	process: {
		name: string;
		description: string;
	}[];
    goal: string;
    why: string;
};

type ClarifyError = Error & { code?: string };

export function useClarification() {
	const [data, setData] = useState<ClarificationData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<ClarifyError | null>(null);

	// Avoid race conditions if multiple calls happen quickly
	const latestCallId = useRef(0);

	const reset = useCallback(() => {
		setData(null);
		setError(null);
	}, []);

	const clarify = useCallback(async (clarification: string) => {
		if (!clarification?.trim()) {
			const err = new Error(
				"Clarification text is required"
			) as ClarifyError;
			err.code = "EMPTY_INPUT";
			setError(err);
			return null;
		}

		setLoading(true);
		setError(null);
		const callId = ++latestCallId.current;

		const run = async (): Promise<ClarificationData> => {
			await apiClient.ensureSession();
			return apiClient.clarifyGoal(clarification);
		};

		try {
			let result = await run();
			// If the call became stale, bail without updating state
			if (callId !== latestCallId.current) return result;

			setData(result);
			return result;
		} catch (e: any) {
			// optional retry once on auth failure
			if (e?.message === "AUTHENTICATION_FAILED") {
				try {
					await apiClient.startSession();
					const result = await run();
					if (callId === latestCallId.current) setData(result);
					return result;
				} catch (retryErr: any) {
					const err = retryErr as ClarifyError;
					if (callId === latestCallId.current) setError(err);
					return null;
				}
			}
			const err = e as ClarifyError;
			if (callId === latestCallId.current) setError(err);
			return null;
		} finally {
			if (callId === latestCallId.current) setLoading(false);
		}
	}, []);

	return {
		data,
		loading,
		error,
		clarify,
		reset,
		isPending: loading,
		isError: !!error,
		isSuccess: !!data && !loading && !error,
	};
}
