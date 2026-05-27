import { afterAll, beforeEach, describe, expect, mock, test } from "bun:test";
import type { AiProvider } from "./types";

let generatedText = "";
let savedApiKey: string | null = "test-api-key";

const loadAiSettings = mock(async () => ({
	provider: "openai" as const,
	model: "test-model",
}));
const loadApiKey = mock(async (_provider: AiProvider) => savedApiKey);
const generateText = mock(async (_options: unknown) => ({
	text: generatedText,
}));
const createOpenAI = mock(
	(_options: { apiKey: string }) => (_model: string) => ({
		provider: "openai",
	}),
);

mock.module("./settings-store", () => ({ loadAiSettings }));
mock.module("./secret-store", () => ({ loadApiKey }));
mock.module("ai", () => ({ generateText }));
mock.module("@ai-sdk/openai", () => ({ createOpenAI }));

const { transformText } = await import("./transform");

const improveRequest = {
	kind: "improve" as const,
	text: "I has a issue.",
	tone: "preserve" as const,
	explanationLocale: "en" as const,
};

describe("transformText", () => {
	beforeEach(() => {
		generatedText = "";
		savedApiKey = "test-api-key";
		mock.clearAllMocks();
	});

	afterAll(() => {
		mock.restore();
	});

	test("returns corrected text and valid change hints from a model response", async () => {
		generatedText = JSON.stringify({
			text: "I have an issue.",
			hints: [
				{
					original: "has a",
					corrected: "have an",
					explanation: "Use agreement and the correct article.",
				},
			],
		});

		expect(await transformText(improveRequest)).toEqual({
			text: "I have an issue.",
			hints: [
				{
					original: "has a",
					corrected: "have an",
					explanation: "Use agreement and the correct article.",
				},
			],
		});
	});

	test("accepts correction JSON wrapped in markdown code fences", async () => {
		generatedText = [
			"```json",
			'{"text":"I have an issue.","hints":[]}',
			"```",
		].join("\n");

		expect(await transformText(improveRequest)).toEqual({
			text: "I have an issue.",
			hints: [],
		});
	});

	test("shows the raw model response when correction JSON is invalid", async () => {
		generatedText = "I have an issue.";

		expect(await transformText(improveRequest)).toEqual({
			text: "I have an issue.",
		});
	});

	test("discards malformed change hints while retaining valid ones", async () => {
		generatedText = JSON.stringify({
			text: "I have an issue.",
			hints: [
				{
					original: "has",
					corrected: "have",
					explanation: "Match the subject.",
				},
				{ original: "a", corrected: "an" },
			],
		});

		expect(await transformText(improveRequest)).toEqual({
			text: "I have an issue.",
			hints: [
				{
					original: "has",
					corrected: "have",
					explanation: "Match the subject.",
				},
			],
		});
	});

	test("returns translated model text directly", async () => {
		generatedText = "Good morning";

		expect(
			await transformText({
				kind: "translate",
				text: "Bom dia",
				targetLanguage: "English",
			}),
		).toEqual({ text: "Good morning" });
	});

	test("fails before contacting a model when no API key is configured", async () => {
		savedApiKey = null;

		await expect(transformText(improveRequest)).rejects.toThrow(
			"No API key is configured for this provider.",
		);
		expect(generateText).not.toHaveBeenCalled();
	});
});
