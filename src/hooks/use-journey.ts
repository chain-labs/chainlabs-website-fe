// import { useCallback } from "react";
// import { apiClient } from "@/api-client";
// import { useGlobalStore } from "@/global-store";

// export function useJourney() {
//   const store = useGlobalStore();

//   const submitGoal = useCallback(async (input: string) => {
//     await apiClient.ensureSession();
//     const res = await apiClient.submitGoal(input);
//     // Optionally fetch personalized content or progress after goal submission
//     try {
//       const progress = await apiClient.getProgress();
//       if (progress?.data) {
//         store.updateProgress(progress.data);
//       } else if (progress?.points_total) {
//         store.updateProgress(progress);
//       }
//     } catch {}
//     return res;
//   }, [store]);

//   const completeMission = useCallback(async (missionId: string, answer: string) => {
//     await apiClient.ensureSession();
//     const res = await apiClient.completeMission(missionId, answer);
//     // Backend usually returns updated progress
//     if (res?.data?.progress) {
//       store.updateProgress(res.data.progress);
//     } else if (res?.progress) {
//       store.updateProgress(res.progress);
//     }
//     return res;
//   }, [store]);

//   const refreshProgress = useCallback(async () => {
//     await apiClient.ensureSession();
//     const res = await apiClient.getProgress();
//     const progress = res?.data ?? res;
//     if (progress) {
//       store.updateProgress(progress);
//     }
//     return res;
//   }, [store]);

//   return { submitGoal, completeMission, refreshProgress };
// } 