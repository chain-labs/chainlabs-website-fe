export type Hero = {
	title: string;
	description: string;
};

export type Process = {
	name: string;
	description: string;
};

export type Mission = {
	id: string;
	title: string;
	description: string;
	points: number;
	status: "pending" | "completed";
	icon: string;
	input: {
		required: boolean;
		type: "text";
		placeholder: string;
	};
	missionType:
		| "ADDITIONAL_INPUT"
		| "READ_CASE_STUDY"
		| "VIEW_PROCESS"
		| "VAPI_WEB_CALL"
		| "GOAL_CLARIFICATION"
		| "GOAL_INPUT"
		| "CHAT";
	options: {
		targetCaseStudyId: "N/A" | string;
	};
	artifact: {
		answer: string;
	};
};

export type CaseStudy = {
	id: string;
	title: string;
	description: string;
	shortDescription: string;
	thumbnail: string;
};

export type History = {
	role: "user" | "assistant";
	message: string;
	datetime: string;
};

export type Message = {
	content: string;
	additional_kwargs: {};
	response_metadata: {};
	type: "human" | "ai";
	name: string | null;
	id: string | null;
};
export type ChatHistory = {
	content: string;
	additional_kwargs: {};
	response_metadata: {};
	type: "human" | "ai";
	name: null;
	id: null;
};
