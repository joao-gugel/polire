import type {
	ImproveTextRequest,
	TransformPrompt,
	TransformRequest,
	TranslateTextRequest,
	WritingTone,
} from "./types";

const SHARED_INSTRUCTIONS = [
	"You are Polire, a writing assistant for short-form text.",
	"Preserve the input's formatting, line breaks, URLs, code blocks, lists, markdown, emoji, and proper nouns exactly as written.",
	"Preserve any quoted content verbatim — do not paraphrase quotes.",
	"Do not add facts, claims, examples, or content the user did not write, and do not change the intended meaning.",
	"Keep the result roughly the same length as the input — do not pad with explanations or extra sentences.",
	"Output only the requested result — no prefaces, sign-offs, apologies, or commentary.",
].join(" ");

const IMPROVE_INSTRUCTIONS = [
	SHARED_INSTRUCTIONS,
	"Keep the response in the exact same language as the input — never translate it.",
	'Respond with a single JSON object matching this shape: {"text": string, "hints": Array<{"original": string, "corrected": string, "explanation": string}>}.',
	"`text` is the full transformed version of the input.",
	"`hints` lists up to 6 meaningful changes, prioritized by impact. Each entry: `original` is the exact original snippet (word or short phrase), `corrected` is its replacement, `explanation` is one short sentence in the same language as the input.",
	"Skip cosmetic changes (whitespace, identical casing) from `hints`. If nothing changed, return an empty `hints` array.",
	"Output JSON only — no markdown, no code fences, no commentary.",
].join(" ");

const TRANSLATE_INSTRUCTIONS = [
	SHARED_INSTRUCTIONS,
	"Translate idiomatically — prefer natural target-language phrasings over literal word-for-word renderings.",
	"Preserve numbers, dates, and units as written unless the target language strictly demands a different convention.",
	"Output only the translated text, with no quotation marks or commentary.",
].join(" ");

const TONE_GUIDANCE: Record<Exclude<WritingTone, "preserve">, string> = {
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

function buildImproveTask(tone: ImproveTextRequest["tone"]): string {
	if (tone === "preserve") {
		return [
			"Fix spelling, grammar, punctuation, and obvious clarity issues in the following text.",
			"Keep the same language as the input.",
			"Keep the author's voice, tone, and sentence structure intact — only fix problems, do not rewrite for style.",
		].join(" ");
	}
	return [
		`Rewrite the following text in a ${tone} tone.`,
		"Keep the same language as the input — do not translate it.",
		"Fix any spelling or grammar issues along the way, but do not add new facts, examples, or content.",
		`Tone guidance: ${TONE_GUIDANCE[tone]}`,
		"Since the rewrite may touch most of the text, surface only the 3–6 most impactful changes in `hints` rather than every word swap.",
	].join(" ");
}

function buildImprovePrompt(request: ImproveTextRequest): TransformPrompt {
	return {
		system: IMPROVE_INSTRUCTIONS,
		prompt: [buildImproveTask(request.tone), "", request.text].join("\n"),
	};
}

function buildTranslatePrompt(request: TranslateTextRequest): TransformPrompt {
	return {
		system: TRANSLATE_INSTRUCTIONS,
		prompt: [
			`Translate the following text into ${request.targetLanguage}.`,
			"Preserve the original tone, register, and level of formality.",
			"",
			request.text,
		].join("\n"),
	};
}

/** Builds the model instructions for one supported text transformation. */
export function buildTransformPrompt(
	request: TransformRequest,
): TransformPrompt {
	if (request.kind === "improve") return buildImprovePrompt(request);
	return buildTranslatePrompt(request);
}
