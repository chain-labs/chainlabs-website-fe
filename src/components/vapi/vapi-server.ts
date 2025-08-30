import { VapiClient } from "@vapi-ai/server-sdk";

const vapi = new VapiClient({
	token: process.env.VAPI_API_KEY!,
});

// Create an outbound call
const assistant = await vapi.assistants.create({
	name: "Sales Assistant",
	firstMessage:
		"Hi! I'm calling about your interest in our software solutions.",
	model: {
		provider: "openai",
		model: "gpt-4o",
		temperature: 0.7,
		messages: [
			{
				role: "system",
				content:
					"You are a friendly sales representative. Keep responses under 30 words.",
			},
		],
	},
	voice: {
		provider: "11labs",
		voiceId: "21m00Tcm4TlvDq8ikWAM",
	},
});
