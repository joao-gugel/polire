import { describe, expect, test } from "bun:test";
import { buildTransformPrompt } from "./prompts";

describe("buildTransformPrompt", () => {
	test("builds correction instructions requesting structured hints", () => {
		const prompt = buildTransformPrompt({
			kind: "improve",
			text: "I has a issue.",
			tone: "preserve",
		});

		expect(prompt.system).toContain("JSON object");
		expect(prompt.system).toContain("hints");
		expect(prompt.system).toContain("same language as the input");
		expect(prompt.prompt).toContain(
			"Keep the author's voice, tone, and sentence structure intact",
		);
		expect(prompt.prompt).toContain("I has a issue.");
	});

	test("builds rewrite instructions when a non-preserve tone is requested", () => {
		const prompt = buildTransformPrompt({
			kind: "improve",
			text: "Hey, you should try this out.",
			tone: "professional",
		});

		expect(prompt.prompt).toContain(
			"Rewrite the following text in a professional tone",
		);
		expect(prompt.prompt).toContain("Hey, you should try this out.");
	});

	test("builds translation instructions with the requested language", () => {
		const prompt = buildTransformPrompt({
			kind: "translate",
			text: "Bom dia",
			targetLanguage: "English",
		});

		expect(prompt.system).toContain("Output only the translated text");
		expect(prompt.system).toContain("Translate idiomatically");
		expect(prompt.prompt).toContain(
			"Translate the following text into English.",
		);
		expect(prompt.prompt).toContain(
			"Preserve the original tone, register, and level of formality.",
		);
		expect(prompt.prompt).toContain("Bom dia");
	});
});
