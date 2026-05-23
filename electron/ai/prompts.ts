import type {
	ImproveTextRequest,
	TransformPrompt,
	TransformRequest,
	TranslateTextRequest,
} from "./types";

const SHARED_INSTRUCTIONS = [
	"You are Polire, a writing assistant.",
	"Preserve formatting, line breaks, URLs, code blocks, and proper nouns.",
	"Do not add new facts or change the intended meaning.",
].join(" ");

const IMPROVE_INSTRUCTIONS = [
	SHARED_INSTRUCTIONS,
	'Respond with a single JSON object matching this shape: {"text": string, "hints": Array<{"original": string, "corrected": string, "explanation": string}>}.',
	"`text` is the full corrected version of the input.",
	"`hints` lists each meaningful change: `original` is the exact original snippet (word or short phrase), `corrected` is its replacement, and `explanation` is one short sentence in the same language as the input describing why the change was made.",
	"Skip purely cosmetic changes (whitespace, identical casing) from `hints`. If nothing changed, return an empty `hints` array.",
	"Output JSON only — no markdown, no code fences, no commentary.",
].join(" ");

const TRANSLATE_INSTRUCTIONS = [
	SHARED_INSTRUCTIONS,
	"Return only the transformed text, without commentary or quotation marks.",
].join(" ");

function buildImprovePrompt(request: ImproveTextRequest): TransformPrompt {
	return {
		system: IMPROVE_INSTRUCTIONS,
		prompt: [
			"Improve grammar, spelling, and clarity in the following text.",
			`Requested tone: ${request.tone}.`,
			'When the tone is "preserve", retain the original tone.',
			"",
			request.text,
		].join("\n"),
	};
}

function buildTranslatePrompt(request: TranslateTextRequest): TransformPrompt {
	return {
		system: TRANSLATE_INSTRUCTIONS,
		prompt: [
			`Translate the following text to ${request.targetLanguage}.`,
			"Preserve its tone and level of formality.",
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
