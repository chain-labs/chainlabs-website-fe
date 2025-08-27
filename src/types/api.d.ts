import {
	CaseStudy,
	ChatHistory,
	Hero,
	History,
	Message,
	Mission,
	Process,
} from "./store";

export type ErrorResponse = {
	detail: {
		error: {
			code: number;
			message: string;
		};
	};
};

export type SessionResponse = {
	access_token: string;
	expires_in: number;
	refresh_token: string;
	refresh_expires_in: number;
};

export type GoalResponse = {
	assistantMessage: {
		message: string;
		datetime: string;
	};
	history: History[];
};

export type ClarificationResponse = {
	hero: Hero;
	process: Process[];
	goal: string;
	caseStudies: CaseStudy[];
	whyThisCaseStudiesWereSelected: string;
	missions: Mission[];
	why: string;
};

export type PersonalisedResponse = {
	status: "INITIAL" | "GOAL_SET" | "CLARIFIED";
	messages: Message[];
	personalisation: {
		hero: Hero;
		process: Process[];
		goal: string;
		caseStudies: CaseStudy[];
		whyThisCaseStudiesWereSelected: string;
		missions: Mission[];
		why: string;
		fallbackToGenericData: boolean;
		points_total: 0;
		call_unlocked: false;
		call_record: [
			{
				id: string;
				uid: string;
			}
		];
	};
};

export type ChatResponse = {
	reply: string;
	history: ChatHistory[];
	followUpMissions: string[];
	updatedProgress: {
		pointsTotal: number;
		missions: Mission[];
		callUnlocked: false;
	};
	suggestedRead: [];
	navigate: {
		page: string;
		sectionId: string;
		metadata: {
			missionId: string;
			caseStudyId: string;
		};
	};
};
