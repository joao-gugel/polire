import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type LanguageModel } from "ai";
import { buildTransformPrompt } from "./prompts";
import { loadApiKey } from "./secret-store";
import { loadAiSettings } from "./settings-store";
import type { AiSettings, TransformRequest, TransformResult } from "./types";

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

	return { text: result.text };
}
