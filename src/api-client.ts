import {
	ChatResponse,
	ClarificationResponse,
	GoalResponse,
	PersonalisedResponse,
} from "./types";
import { Mission } from "./types/store";

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiClient {
	// Helper to check if we're in browser environment
	private isBrowser(): boolean {
		return (
			typeof window !== "undefined" && typeof localStorage !== "undefined"
		);
	}

	// Safe localStorage access
	private getStorageItem(key: string): string | null {
		if (!this.isBrowser()) return null;
		try {
			return localStorage.getItem(key);
		} catch (error) {
			console.warn("localStorage access failed:", error);
			return null;
		}
	}

	private setStorageItem(key: string, value: string): void {
		if (!this.isBrowser()) return;
		try {
			localStorage.setItem(key, value);
		} catch (error) {
			console.warn("localStorage write failed:", error);
		}
	}

	private removeStorageItem(key: string): void {
		if (!this.isBrowser()) return;
		try {
			localStorage.removeItem(key);
		} catch (error) {
			console.warn("localStorage removal failed:", error);
		}
	}

	private getAuthHeaders(): Record<string, string> {
		const accessToken = this.getStorageItem("access_token");
		return accessToken
			? {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
			  }
			: {
					"Content-Type": "application/json",
			  };
	}

	private async handleResponse(response: Response) {
		if (!response.ok) {
			if (response.status === 401) {
				// Token expired or invalid
				this.removeStorageItem("access_token");
				this.removeStorageItem("refresh_token");
				throw new Error("AUTHENTICATION_FAILED");
			}

			const errorData = await response.json().catch(() => ({} as any));

			// Try to extract the most useful message from nested error shapes
			const nestedMessage =
				errorData?.message ??
				errorData?.detail?.error?.message ??
				errorData?.detail?.message ??
				errorData?.error?.message ??
				errorData?.detail ??
				undefined;

			const message =
				(typeof nestedMessage === "string" && nestedMessage) ||
				`HTTP ${response.status}`;

			throw new Error(message);
		}

		return response.json();
	}

	async startSession() {
		const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		const body = await this.handleResponse(res);

		// Accept both {access_token,...} or {data:{access_token,...}}
		const access = body?.data?.access_token ?? body?.access_token;
		const refresh = body?.data?.refresh_token ?? body?.refresh_token;

		if (!access) {
			throw new Error("SESSION_INIT_FAILED");
		}
		this.setStorageItem("access_token", access);
		if (refresh) this.setStorageItem("refresh_token", refresh);

		return body;
	}

	// Reset session
	async resetSession() {
		try {
			await this.makeAuthenticatedRequest(
				`${API_BASE_URL}/api/auth/reset`,
				{
					method: "POST",
				}
			);
		} catch (error) {
			console.error("Failed to reset session:", error);
			throw error;
		}
		return true;
	}

	// Ensure we have a session before making API calls
	async ensureSession() {
		if (!this.isAuthenticated()) {
			await this.startSession();
		}
	}

	// Initialize session - call this once on app startup
	async initializeSession(): Promise<void> {
		// Only run in browser
		if (!this.isBrowser()) {
			console.warn(
				"initializeSession called on server side, skipping..."
			);
			return;
		}

		// Check if we already have tokens
		const existingToken = this.getStorageItem("access_token");
		if (existingToken) {
			return; // Already authenticated
		}

		try {
			await this.startSession();
			console.log("Session initialized successfully");
		} catch (error) {
			console.error("Failed to initialize session:", error);
			throw error;
		}
	}

	// Helper method for authenticated requests
	private async makeAuthenticatedRequest(
		url: string,
		options: RequestInit = {}
	) {
		const response = await fetch(url, {
			...options,
			headers: {
				...this.getAuthHeaders(),
				...options.headers,
			},
		});

		return this.handleResponse(response);
	}

	// Goal & Personalization endpoints
	async submitGoal(input: string) {
		const response: GoalResponse = await this.makeAuthenticatedRequest(
			`${API_BASE_URL}/api/goal`,
			{
				method: "POST",
				body: JSON.stringify({ input }),
			}
		);
		return {
			role: "assistant",
			message: response.assistantMessage.message,
			timestamp: new Date(
				response.assistantMessage.datetime
			).toISOString(),
		};
	}

	async clarifyGoal(clarification: string) {
		const response: ClarificationResponse =
			await this.makeAuthenticatedRequest(`${API_BASE_URL}/api/clarify`, {
				method: "POST",
				body: JSON.stringify({ clarification }),
			});

		return response;
	}

	async getPersonalizedContent() {
		const response: PersonalisedResponse =
			await this.makeAuthenticatedRequest(
				`${API_BASE_URL}/api/personalised`,
				{
					method: "GET",
				}
			);
		return response;
	}

	// Progress & Missions endpoints
	async getProgress() {
		type ProgressResponse = {
			points_total: number;
			missions: [
				{
					id: string;
					status: string;
					points: number;
				}
			];
			call_unlocked: boolean;
		};
		const response: ProgressResponse = await this.makeAuthenticatedRequest(
			`${API_BASE_URL}/api/progress`,
			{
				method: "GET",
			}
		);
		return response;
	}

	async completeMission(missionId: string, answer: string) {
		type CompleteMissionResponse = {
			points_awarded: number;
			points_total: number;
			call_unlocked: boolean;
			next_mission: Mission;
		};
		const response: CompleteMissionResponse =
			await this.makeAuthenticatedRequest(
				`${API_BASE_URL}/api/mission/complete`,
				{
					method: "POST",
					body: JSON.stringify({
						mission_id: missionId,
						artifact: { answer },
					}),
				}
			);
		return response;
	}

	// async checkUnlockStatus() {
	// 	type UnlockStatusResponse = {
	// 		call_unlocked: boolean;
	// 	};
	// 	const response: UnlockStatusResponse =
	// 		await this.makeAuthenticatedRequest(
	// 			`${API_BASE_URL}/api/unlock-status`,
	// 			{
	// 				method: "GET",
	// 			}
	// 		);
	// 	return response;
	// }

	// Session Management
	// async getFullSession() {
	// 	type SessionResponse = {
	// 		goal: {
	// 			description: string;
	// 			category: string;
	// 			priority: string;
	// 		};
	// 		missions: [
	// 			{
	// 				id: string;
	// 				status: string;
	// 				points: number;
	// 			}
	// 		];
	// 		points_total: number;
	// 		call_unlocked: boolean;
	// 	};
	// 	const response: SessionResponse = await this.makeAuthenticatedRequest(
	// 		`${API_BASE_URL}/api/session`,
	// 		{
	// 			method: "GET",
	// 		}
	// 	);

	// 	return response;
	// }

	// Chat endpoint
	async chatWithAssistant(
		message: string,
		context: {
			page: string;
			section: string;
			metadata: {
				additionalProp1: any;
			};
		}
	) {
		const response: ChatResponse = await this.makeAuthenticatedRequest(
			`${API_BASE_URL}/api/chat`,
			{
				method: "POST",
				body: JSON.stringify({ message, context }),
			}
		);
		return response;
	}

	async sendCallLink({ id, uid }: { id: string; uid: string }) {
		await this.makeAuthenticatedRequest(`${API_BASE_URL}/api/call/link`, {
			method: "POST",
			body: JSON.stringify({ id: `${id}`, uid: `${uid}` }),
		});
		return true;
	}

	// Utility method to check if user is authenticated
	isAuthenticated(): boolean {
		if (!this.isBrowser()) return false;
		return !!this.getStorageItem("access_token");
	}

	// Utility method to clear authentication
	clearAuth(): void {
		if (!this.isBrowser()) return;
		this.removeStorageItem("access_token");
		this.removeStorageItem("refresh_token");
	}

	// Get current access token (useful for debugging)
	getAccessToken(): string | null {
		return this.getStorageItem("access_token");
	}

	// Get current refresh token (useful for debugging)
	getRefreshToken(): string | null {
		return this.getStorageItem("refresh_token");
	}
}

export const apiClient = new ApiClient();
