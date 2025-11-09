// import { useCallback } from "react";
// import { apiClient } from "@/api-client";
// import { useGlobalStore } from "@/global-store";

// export function useJourney() {
// 	const store = useGlobalStore();

// 	const submitGoal = useCallback(
// 		async (input: string) => {
// 			await apiClient.ensureSession();
// 			const res = await apiClient.submitGoal(input);

// 			try {
// 				const progress = await apiClient.getProgress();
// 				if (
// 					progress &&
// 					typeof (progress as any).pointsTotal === "number"
// 				) {
// 					store.updateProgress(progress);
// 				}
// 			} catch {
// 				// ignore
// 			}

// 			return res;
// 		},
// 		[store]
// 	);

// 	const completeMission = useCallback(
// 		async (missionId: string, answer: string) => {
// 			await apiClient.ensureSession();
// 			const res = await apiClient.completeMission(missionId, answer);

// 			// Fetch canonical progress shape after completion
// 			try {
// 				const progress = await apiClient.getProgress();
// 				if (
// 					progress &&
// 					typeof (progress as any).pointsTotal === "number"
// 				) {
// 					store.updateProgress(progress);
// 				}
// 			} catch {
// 				// ignore
// 			}

// 			return res;
// 		},
// 		[store]
// 	);

// 	const refreshProgress = useCallback(async () => {
// 		await apiClient.ensureSession();
// 		const progress = await apiClient.getProgress();
// 		if (progress) {
// 			store.updateProgress(progress);
// 		}
// 		return progress;
// 	}, [store]);

// 	return { submitGoal, completeMission, refreshProgress };
// }
