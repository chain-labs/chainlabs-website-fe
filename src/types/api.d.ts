export interface APIResponse<T = any> {
	data?: T;
	error?: string;
	message?: string;
	status: number;
	success: boolean;
}

export interface ChatAPIRequest {
	message: string;
	context?: Record<string, any>;
	model?: string;
	temperature?: number;
}

export interface ChatAPIResponse extends APIResponse {
	data: {
		message: string;
		id: string;
		timestamp: string;
		metadata?: {
			tokens: number;
			model: string;
			responseTime: number;
		};
	};
}

export interface UserAPIRequest {
	profile: Partial<UserProfile>;
}

export interface UserAPIResponse extends APIResponse {
	data: UserProfile;
}

export type GoalResponse = {
	assistantMessage: {
		message: string;
		datetime: string;
	};
	history: [
		{
			role: "user" | "assistant";
			message: string;
			datetime: string;
		}
	];
};

export type ClarificationResponse = {
	hero: {
		title: string;
		description: string;
	};
	process: {
		name: string;
		description: string;
	}[];
	goal: string;
	caseStudies: [];
	whyThisCaseStudiesWereSelected: "";
	missions: {
		id: string;
		title: string;
		description: string;
		points: number;
	}[];
	why: string;
};
