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
