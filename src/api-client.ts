const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

class ApiClient {
    // Helper to check if we're in browser environment
    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }

    // Safe localStorage access
    private getStorageItem(key: string): string | null {
        if (!this.isBrowser()) return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('localStorage access failed:', error);
            return null;
        }
    }

    private setStorageItem(key: string, value: string): void {
        if (!this.isBrowser()) return;
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('localStorage write failed:', error);
        }
    }

    private removeStorageItem(key: string): void {
        if (!this.isBrowser()) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('localStorage removal failed:', error);
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

            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Initialize session - call this once on app startup
    async initializeSession(): Promise<void> {
        // Only run in browser
        if (!this.isBrowser()) {
            console.warn('initializeSession called on server side, skipping...');
            return;
        }

        // Check if we already have tokens
        const existingToken = this.getStorageItem("access_token");
        if (existingToken) {
            return; // Already authenticated
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to create session");
            }

            const data = await response.json();

            // Store tokens in localStorage
            this.setStorageItem("access_token", data.access_token);
            this.setStorageItem("refresh_token", data.refresh_token);

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
        return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/goal`, {
            method: "POST",
            body: JSON.stringify({ input }),
        });
    }

    async clarifyGoal(clarification: string) {
        return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/clarify`, {
            method: "POST",
            body: JSON.stringify({ clarification }),
        });
    }

    async getPersonalizedContent() {
        return this.makeAuthenticatedRequest(
            `${API_BASE_URL}/api/personalised`,
            {
                method: "GET",
            }
        );
    }

    // Progress & Missions endpoints
    async getProgress() {
        return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/progress`, {
            method: "GET",
        });
    }

    async completeMission(missionId: string, answer: string) {
        return this.makeAuthenticatedRequest(
            `${API_BASE_URL}/api/mission/complete`,
            {
                method: "POST",
                body: JSON.stringify({
                    mission_id: missionId,
                    artifact: { answer },
                }),
            }
        );
    }

    async checkUnlockStatus() {
        return this.makeAuthenticatedRequest(
            `${API_BASE_URL}/api/unlock-status`,
            {
                method: "GET",
            }
        );
    }

    // Session Management
    async getFullSession() {
        return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/session`, {
            method: "GET",
        });
    }

    // Chat endpoint
    async chatWithAssistant(message: string, context: any) {
        return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/chat`, {
            method: "POST",
            body: JSON.stringify({ message, context }),
        });
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