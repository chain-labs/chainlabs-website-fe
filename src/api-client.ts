const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const accessToken = localStorage.getItem('access_token');
    return accessToken ? {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        throw new Error('AUTHENTICATION_FAILED');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Initialize session - call this once on app startup
  async initializeSession(): Promise<void> {
    // Check if we already have tokens
    const existingToken = localStorage.getItem('access_token');
    if (existingToken) {
      return; // Already authenticated
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      const data = await response.json();
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      console.log('Session initialized successfully');
    } catch (error) {
      console.error('Failed to initialize session:', error);
      throw error;
    }
  }

  // Helper method for authenticated requests
  private async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers
      }
    });

    return this.handleResponse(response);
  }

  // Goal & Personalization endpoints
  async submitGoal(input: string) {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/goal`, {
      method: 'POST',
      body: JSON.stringify({ input })
    });
  }

  async clarifyGoal(clarification: string) {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/clarify`, {
      method: 'POST',
      body: JSON.stringify({ clarification })
    });
  }

  async getPersonalizedContent() {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/personalised`, {
      method: 'GET'
    });
  }

  // Progress & Missions endpoints
  async getProgress() {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/progress`, {
      method: 'GET'
    });
  }

  async completeMission(missionId: string, answer: string) {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/mission/complete`, {
      method: 'POST',
      body: JSON.stringify({
        mission_id: missionId,
        artifact: { answer }
      })
    });
  }

  async checkUnlockStatus() {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/unlock-status`, {
      method: 'GET'
    });
  }

  // Session Management
  async getFullSession() {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/session`, {
      method: 'GET'
    });
  }

  // Chat endpoint
  async chatWithAssistant(message: string, context: any) {
    return this.makeAuthenticatedRequest(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, context })
    });
  }

  // Utility method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Utility method to clear authentication
  clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

export const apiClient = new ApiClient();