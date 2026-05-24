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
		expect(prompt.prompt).toContain("Requested tone: preserve.");
		expect(prompt.prompt).toContain("I has a issue.");
	});

	test("builds translation instructions with the requested language", () => {
		const prompt = buildTransformPrompt({
			kind: "translate",
			text: "Bom dia",
			targetLanguage: "English",
		});

		expect(prompt.system).toContain("Return only the transformed text");
		expect(prompt.prompt).toContain("Translate the following text to English.");
		expect(prompt.prompt).toContain("Bom dia");
	});
});
