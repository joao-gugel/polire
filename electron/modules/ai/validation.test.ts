import { describe, expect, test } from "bun:test";
import {
	isAiSettings,
	parseSaveApiKeyInput,
	parseTransformRequest,
} from "./validation";

describe("AI IPC validation", () => {
	test("accepts valid transformation requests", () => {
		expect(
			parseTransformRequest({
				kind: "improve",
				text: "Fix this.",
				tone: "preserve",
			}),
		).toEqual({ kind: "improve", text: "Fix this.", tone: "preserve" });
		expect(
			parseTransformRequest({
				kind: "translate",
				text: "Bom dia",
				targetLanguage: "English",
			}),
		).toEqual({
			kind: "translate",
			text: "Bom dia",
			targetLanguage: "English",
		});
	});

	test("rejects malformed transformation requests", () => {
		expect(() =>
			parseTransformRequest({
				kind: "improve",
				text: "Fix this.",
				tone: "unknown",
			}),
		).toThrow("Invalid writing tone.");
		expect(() =>
			parseTransformRequest({
				kind: "translate",
				text: " ",
				targetLanguage: "English",
			}),
		).toThrow("Invalid text for transformation.");
	});

	test("validates local AI settings and API key input", () => {
		expect(isAiSettings({ provider: "openai", model: "gpt-5.4" })).toBe(true);
		expect(isAiSettings({ provider: "unknown", model: "gpt-5.4" })).toBe(false);
		expect(
			parseSaveApiKeyInput({ provider: "anthropic", apiKey: "secret" }),
		).toEqual({ provider: "anthropic", apiKey: "secret" });
	});
});
