import { describe, expect, test } from "bun:test";
import { buildTransformPrompt } from "./index";

describe("buildTransformPrompt", () => {
	test("builds correction instructions requesting structured hints", () => {
		const prompt = buildTransformPrompt({
			kind: "improve",
			text: "I has a issue.",
			tone: "preserve",
			explanationLocale: "pt-BR",
		});

		expect(prompt.system).toContain("JSON object");
		expect(prompt.system).toContain("hints");
		expect(prompt.system).toContain("<SYSTEM_RULES>");
		expect(prompt.system).toContain("<OUTPUT_FORMAT>");
		expect(prompt.system).toContain("CRITICAL LANGUAGE RULE FOR `text`");
		expect(prompt.system).toContain("Never translate any part of `text`");
		expect(prompt.prompt).toContain(
			"preserving style never means preserving an error",
		);
		expect(prompt.prompt).toContain(
			"Write every `hints[].explanation` in Brazilian Portuguese",
		);
		expect(prompt.prompt).toContain("must never change the language of `text`");
		expect(prompt.prompt).toContain("<INPUT_TEXT>");
		expect(prompt.prompt).toContain("I has a issue.");
	});

	test("requires misspelling correction even when input is quoted", () => {
		const prompt = buildTransformPrompt({
			kind: "improve",
			text: "'Test mai fraund hows u gaing'",
			tone: "preserve",
			explanationLocale: "pt-BR",
		});

		expect(prompt.system).toContain(
			"apply the requested transformation to natural-language content inside quotation marks",
		);
		expect(prompt.system).toContain(
			"replace misspellings, phonetic spellings, mistyped words, and grammatical errors",
		);
		expect(prompt.system).toContain("`mai fraund` must become `my friend`");
		expect(prompt.prompt).toContain(
			"fix every recognizable spelling, phonetic spelling",
		);
		expect(prompt.prompt).toContain("'Test mai fraund hows u gaing'");
	});

	test("requires contextual resolution of ambiguous misspellings", () => {
		const prompt = buildTransformPrompt({
			kind: "improve",
			text: "Test mai fraund hows u gain",
			tone: "preserve",
			explanationLocale: "pt-BR",
		});

		expect(prompt.system).toContain(
			"choose the correction that makes the resulting sentence grammatically valid, natural, and meaningful",
		);
		expect(prompt.system).toContain(
			"`hows u gain` should be interpreted contextually",
		);
		expect(prompt.system).toContain("not as `how's you again`");
	});

	test("builds rewrite instructions when a non-preserve tone is requested", () => {
		const prompt = buildTransformPrompt({
			kind: "improve",
			text: "Hey, you should try this out.",
			tone: "professional",
			explanationLocale: "en",
		});

		expect(prompt.prompt).toContain("Rewrite this text in a professional tone");
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
		expect(prompt.system).toContain("<SYSTEM_RULES>");
		expect(prompt.system).toContain("<OUTPUT_FORMAT>");
		expect(prompt.prompt).toContain("Translate this text into English.");
		expect(prompt.prompt).toContain(
			"Preserve the original tone, register, and level of formality.",
		);
		expect(prompt.prompt).toContain("<INPUT_TEXT>");
		expect(prompt.prompt).toContain("Bom dia");
	});
});
