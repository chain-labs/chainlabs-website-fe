"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiClient } from "@/api-client";
import { useGlobalStore } from "@/global-store";
import type { Mission } from "@/types/store";
import { isErrored } from "stream";
import { useChat } from "./use-chat";

export type CompleteMissionResult = {
	points_awarded: number;
	points_total: number;
	call_unlocked: boolean;
	next_mission?: {
		id: string;
		title: string;
		points: number;
		status: string;
	} | null;
};

type UseMissionsOptions = {
	autoInit?: boolean; // ensure session on mount (default: true)
};

export function useMissions(options: UseMissionsOptions = { autoInit: true }) {
	const { autoInit = true } = options;
	const personalised = useGlobalStore((s) => s.personalised);
	const setPersonalised = useGlobalStore((s) => s.setPersonalised);

	const { getPersonalizedContent } = useChat();

	const [submittingById, setSubmittingById] = useState<
		Record<string, boolean>
	>({});
	const [errorById, setErrorById] = useState<Record<string, string | null>>(
		{}
	);
	const initializedRef = useRef(false);

	const ensureSession = useCallback(async () => {
		try {
			await apiClient.ensureSession();
		} catch {
			await apiClient.startSession();
		}
	}, []);

	useEffect(() => {
		if (
			!initializedRef.current &&
			autoInit &&
			typeof window !== "undefined"
		) {
			initializedRef.current = true;
			ensureSession().catch(() => {
				// ignore; will retry on first submit
			});
		}
	}, [autoInit, ensureSession]);

	const setSubmitting = (id: string, val: boolean) =>
		setSubmittingById((m) => ({ ...m, [id]: val }));
	const setError = (id: string, msg: string | null) =>
		setErrorById((m) => ({ ...m, [id]: msg }));

	const getMissionById = useCallback(
		(id: string): Mission | undefined =>
			personalised?.personalisation?.missions.find((m) => m.id === id),
		[personalised]
	);

	const getMissionStatus = useCallback(
		(id: string): string | undefined => getMissionById(id)?.status as any,
		[getMissionById]
	);

	const hasCompleted = useCallback(
		(id: string) => getMissionStatus(id) === "completed",
		[getMissionStatus]
	);

	const isSubmitting = useCallback(
		(id: string) => !!submittingById[id],
		[submittingById]
	);

	const getError = useCallback(
		(id: string) => errorById[id] ?? null,
		[errorById]
	);

	const submitAnswer = useCallback(
		async (
			missionId: string,
			answer?: string
		): Promise<CompleteMissionResult> => {
			const id = String(missionId);
			const isClickMission =
				id.startsWith("cs_mission_") || id.startsWith("view_process_");
			const isInputMission = id.startsWith("input_") || !isClickMission;

			const trimmed = (answer ?? "").trim();

			if (isSubmitting(missionId)) {
				const err = new Error("Already submitting");
				setError(missionId, err.message);
				throw err;
			}

			// For input missions require non-empty; for click missions allow empty payload
			if (isInputMission && !trimmed) {
				const err = new Error("Answer cannot be empty");
				setError(missionId, err.message);
				throw err;
			}

			setSubmitting(missionId, true);
			setError(missionId, null);

			let triedReauth = false;

			const payload = isClickMission ? "" : trimmed;

			const doSubmit = async (): Promise<CompleteMissionResult> => {
				try {
					await ensureSession();
					const res = await apiClient.completeMission(
						missionId,
						payload
					);
					getPersonalizedContent();

					// Update mission status -> completed; append next_mission if provided
					if (personalised) {
						const current = personalised.personalisation.missions;
						const updated = current.map((m) =>
							m.id === missionId
								? { ...m, status: "completed" }
								: m
						);

						const next = res.next_mission;
						const hasNext =
							next && !updated.some((m) => m.id === next.id);

						setPersonalised({
							...personalised,
							personalisation: {
								...personalised.personalisation,
								missions: hasNext
									? [...updated, next as Mission]
									: updated,
							},
						});
					}

					return res;
				} catch (e: any) {
					const authFail =
						e?.message === "AUTHENTICATION_FAILED" ||
						e?.message === "SESSION_INIT_FAILED";
					if (!triedReauth && authFail) {
						triedReauth = true;
						await apiClient.startSession();
						return doSubmit();
					}
					setError(
						missionId,
						e?.message || "Failed to submit mission"
					);
					throw e;
				} finally {
					setSubmitting(missionId, false);
				}
			};

			return doSubmit();
		},
		[ensureSession, isSubmitting, personalised, setPersonalised]
	);

	return {
		// actions
		submitAnswer,

		// selectors
		getMissionById,
		getMissionStatus,
		hasCompleted,

		// per-mission UI state
		isSubmitting,
		getError,
	};
}
