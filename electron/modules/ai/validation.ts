import { isLocale } from "../settings/validation";
import type {
	AiProvider,
	AiSettings,
	TransformRequest,
	WritingTone,
} from "./types";

const MAX_TRANSFORM_TEXT_LENGTH = 50_000;
const MAX_MODEL_LENGTH = 128;

export type SaveApiKeyInput = {
	provider: AiProvider;
	apiKey: string;
};

export function isAiProvider(value: unknown): value is AiProvider {
	return (
		value === "openai" ||
		value === "anthropic" ||
		value === "google" ||
		value === "deepseek"
	);
}

export function isAiSettings(value: unknown): value is AiSettings {
	if (!value || typeof value !== "object") return false;
	if (!("provider" in value) || !isAiProvider(value.provider)) return false;
	if (!("model" in value) || typeof value.model !== "string") return false;
	const model = value.model.trim();
	return model.length > 0 && model.length <= MAX_MODEL_LENGTH;
}

function isWritingTone(value: unknown): value is WritingTone {
	return (
		value === "preserve" ||
		value === "professional" ||
		value === "casual" ||
		value === "friendly" ||
		value === "concise" ||
		value === "persuasive" ||
		value === "playful"
	);
}

function isValidText(value: unknown): value is string {
	return (
		typeof value === "string" &&
		value.trim().length > 0 &&
		value.length <= MAX_TRANSFORM_TEXT_LENGTH
	);
}

export function parseTransformRequest(value: unknown): TransformRequest {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid transformation request.");
	}
	if (!("text" in value) || !isValidText(value.text)) {
		throw new Error("Invalid text for transformation.");
	}
	if ("kind" in value && value.kind === "improve") {
		if (!("tone" in value) || !isWritingTone(value.tone)) {
			throw new Error("Invalid writing tone.");
		}
		if (!("explanationLocale" in value) || !isLocale(value.explanationLocale)) {
			throw new Error("Invalid hint explanation locale.");
		}
		return {
			kind: value.kind,
			text: value.text,
			tone: value.tone,
			explanationLocale: value.explanationLocale,
		};
	}
	if ("kind" in value && value.kind === "translate") {
		if (!("targetLanguage" in value) || !isValidText(value.targetLanguage)) {
			throw new Error("Invalid target language.");
		}
		return {
			kind: value.kind,
			text: value.text,
			targetLanguage: value.targetLanguage,
		};
	}
	throw new Error("Invalid transformation type.");
}

export function parseSaveApiKeyInput(value: unknown): SaveApiKeyInput {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid API key input.");
	}
	if (!("provider" in value) || !isAiProvider(value.provider)) {
		throw new Error("Invalid AI provider.");
	}
	if (!("apiKey" in value) || typeof value.apiKey !== "string") {
		throw new Error("Invalid API key input.");
	}
	return { provider: value.provider, apiKey: value.apiKey };
}
