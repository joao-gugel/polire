import type { WritingTone } from "../types";

export const TONE_GUIDANCE: Record<Exclude<WritingTone, "preserve">, string> = {
	professional:
		"formal vocabulary, no contractions, no slang or informal idioms; clear and businesslike.",
	casual:
		"everyday vocabulary, contractions welcome, light conversational rhythm; avoid corporate-speak.",
	friendly:
		"warm and welcoming, address the reader directly when natural, use positive framing.",
	concise:
		"cut filler words, prefer active voice, aim for shorter sentences while preserving every essential fact.",
	persuasive:
		"active voice with strong verbs, benefit-led phrasing, build toward a clear point that motivates the reader.",
	playful:
		"lighthearted with light wordplay; humor stays kind and never targets the reader.",
};
