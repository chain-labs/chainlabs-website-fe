import type { PersonalisedResponse } from "@/types";

export type SectionSynonyms = Record<string, string[]>;

export type BuildStartOptionsParams = {
	assistantId: string;
	personalisation?: PersonalisedResponse | null;
	personalizationText?: string;
	sections?: SectionSynonyms;
	templateVariables?: Record<string, any>;
};

export function buildPersonalizationText(
	p: PersonalisedResponse | null | undefined
): string {
	if (!p?.personalisation) return "";
	const hero = p.personalisation.hero;
	const goal = p.personalisation.goal;
	const processes = (p.personalisation.process || [])
		.map((pr) => `- ${pr.name}: ${pr.description}`)
		.join("\n");
	const caseStudies = (p.personalisation.caseStudies || [])
		.map((cs) => `- ${cs.title}: ${cs.shortDescription || cs.description}`)
		.join("\n");
	// NEW: missions
	const missions = (p.personalisation as any)?.missions
		? (p.personalisation as any).missions
				.map(
					(m: any) =>
						`- ${m.title || "Untitled"} (${
							m.points ?? 0
						} pts, status: ${m.status})${
							m.description ? `: ${m.description}` : ""
						}`
				)
				.join("\n")
		: "";
	const testimonials = (p.personalisation as any)?.testimonials
		? (p.personalisation as any).testimonials
				.map(
					(t: any) =>
						`- ${t.name || t.author || "Anonymous"}${
							t.company ? ` (${t.company})` : ""
						}: ${t.quote || t.testimonial || t.message || ""}`
				)
				.join("\n")
		: "";

	const lines: string[] = [];
	if (goal) lines.push(`User goal: ${goal}`);
	if (hero?.title || hero?.description) {
		lines.push(
			[
				hero?.title ? `Hero headline: ${hero.title}` : "",
				hero?.description
					? `Hero description: ${hero.description}`
					: "",
			]
				.filter(Boolean)
				.join("\n")
		);
	}
	if (processes) lines.push(`Key processes:\n${processes}`);
	if (caseStudies) lines.push(`Recommended case studies:\n${caseStudies}`);
	if (missions) lines.push(`Missions:\n${missions}`);
	if (testimonials) lines.push(`Testimonials:\n${testimonials}`);
	lines.push(
		"Tone: friendly, concise, and helpful. Prefer concrete next steps."
	);
	return lines.filter(Boolean).join("\n\n");
}

// Returns the argument you can pass directly to `vapi.start(...)`.
// If no overrides are needed, returns just the assistantId string.
export function buildAssistantStartOptions({
	assistantId,
	personalisation,
	personalizationText,
	sections,
	templateVariables,
}: BuildStartOptionsParams): any {
	const personalization =
		personalizationText || buildPersonalizationText(personalisation);

	const promptParts: string[] = [];
	if (personalization) {
		promptParts.push(`User personalization:\n${personalization}`);
	}
	if (sections && Object.keys(sections).length > 0) {
		promptParts.push(
			"Available website sections (user may ask to navigate): " +
				Object.keys(sections)
					.map((id) => `"${id}"`)
					.join(", ")
		);
		promptParts.push(
			"When user asks to navigate to a section (or a synonym), briefly acknowledge only — UI handles scrolling."
		);
	}
	const systemPrompt = promptParts.join("\n\n");

	const assistantOverrides =
		systemPrompt || templateVariables
			? {
					model: systemPrompt
						? {
								// @ts-ignore - SDK accepts `messages` system override
								messages: [
									{
										role: "system",
										content: systemPrompt,
									},
								],
						  }
						: undefined,
					templateVariables: templateVariables || undefined,
			  }
			: undefined;

	return assistantOverrides
		? { assistantId, assistantOverrides }
		: assistantId;
}
