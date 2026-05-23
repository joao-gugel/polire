import type {
	ImproveTextRequest,
	TransformPrompt,
	TransformRequest,
	TranslateTextRequest,
} from "./types";

const SHARED_INSTRUCTIONS = [
	"You are Mend, a writing assistant.",
	"Return only the transformed text, without commentary or quotation marks.",
	"Preserve formatting, line breaks, URLs, code blocks, and proper nouns.",
	"Do not add new facts or change the intended meaning.",
].join(" ");

function buildImprovePrompt(request: ImproveTextRequest): TransformPrompt {
	return {
		system: SHARED_INSTRUCTIONS,
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
		system: SHARED_INSTRUCTIONS,
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
