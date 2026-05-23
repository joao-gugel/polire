import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";
import { buildTransformPrompt } from "./prompts";
import { loadApiKey } from "./secret-store";
import { loadAiSettings } from "./settings-store";
import type {
	AiSettings,
	TransformHint,
	TransformRequest,
	TransformResult,
} from "./types";

function createModel(settings: AiSettings, apiKey: string): LanguageModel {
	if (settings.provider === "openai") {
		return createOpenAI({ apiKey })(settings.model);
	}
	if (settings.provider === "anthropic") {
		return createAnthropic({ apiKey })(settings.model);
	}
	if (settings.provider === "google") {
		return createGoogleGenerativeAI({ apiKey })(settings.model);
	}
	return createDeepSeek({ apiKey })(settings.model);
}

/** Executes one transformation using the locally configured provider and credential. */
export async function transformText(
	request: TransformRequest,
): Promise<TransformResult> {
	const settings = await loadAiSettings();
	const apiKey = await loadApiKey(settings.provider);
	if (!apiKey) throw new Error("No API key is configured for this provider.");

	const instructions = buildTransformPrompt(request);
	const result = await generateText({
		model: createModel(settings, apiKey),
		system: instructions.system,
		prompt: instructions.prompt,
	});

	if (request.kind === "improve") return parseImproveResponse(result.text);
	return { text: result.text };
}

function parseImproveResponse(raw: string): TransformResult {
	const trimmed = stripCodeFences(raw.trim());
	try {
		const parsed = JSON.parse(trimmed) as unknown;
		if (!parsed || typeof parsed !== "object") return { text: raw };
		const text =
			"text" in parsed && typeof parsed.text === "string" ? parsed.text : raw;
		const hints =
			"hints" in parsed && Array.isArray(parsed.hints)
				? parsed.hints.filter(isHint)
				: [];
		return { text, hints };
	} catch {
		return { text: raw };
	}
}

function stripCodeFences(value: string): string {
	if (!value.startsWith("```")) return value;
	const withoutOpen = value.replace(/^```(?:json)?\s*/i, "");
	return withoutOpen.replace(/```\s*$/i, "").trim();
}

function isHint(value: unknown): value is TransformHint {
	return (
		!!value &&
		typeof value === "object" &&
		"original" in value &&
		typeof value.original === "string" &&
		"corrected" in value &&
		typeof value.corrected === "string" &&
		"explanation" in value &&
		typeof value.explanation === "string"
	);
}
