import { describe, expect, mock, test } from "bun:test";
import { buildPaletteOptions } from "@/components/palette/palette-options";

type PaletteDestination =
	| "settings"
	| "onboarding"
	| "correction"
	| "tone-target"
	| "translation-target"
	| "notes";

function createActions(text: string, aiReady: boolean) {
	const t = (key: string) => key;
	const push = mock((_view: PaletteDestination) => undefined);
	const correctText = mock(async (_text: string) => undefined);
	const startToneChange = mock((_text: string) => undefined);
	const startTranslation = mock((_text: string) => undefined);
	const saveAsNote = mock(async (_text: string) => undefined);
	const openNotes = mock(async () => undefined);
	const options = buildPaletteOptions({
		t,
		push,
		correctText,
		startToneChange,
		startTranslation,
		saveAsNote,
		openNotes,
		text,
		aiReady,
	});
	return {
		push,
		correctText,
		startToneChange,
		startTranslation,
		saveAsNote,
		openNotes,
		options,
	};
}

function findOption(
	options: ReturnType<typeof createActions>["options"],
	id: string,
) {
	const option = options.find((entry) => entry.id === id);
	if (!option) throw new Error(`expected option ${id} to be present`);
	return option;
}

describe("buildPaletteOptions", () => {
	test("does not start text actions when the input is blank", () => {
		const actions = createActions("   ", true);

		findOption(actions.options, "correction").action();
		findOption(actions.options, "tone").action();
		findOption(actions.options, "translation").action();
		findOption(actions.options, "quick-note").action();

		expect(actions.correctText).not.toHaveBeenCalled();
		expect(actions.startToneChange).not.toHaveBeenCalled();
		expect(actions.startTranslation).not.toHaveBeenCalled();
		expect(actions.saveAsNote).not.toHaveBeenCalled();
		expect(actions.push).not.toHaveBeenCalled();
	});

	test("starts correction with the entered text and navigates to its result", () => {
		const actions = createActions("Please fix this.", true);

		findOption(actions.options, "correction").action();

		expect(actions.correctText).toHaveBeenCalledWith("Please fix this.");
		expect(actions.push).toHaveBeenCalledWith("correction");
	});

	test("opens the tone picker with the entered text", () => {
		const actions = createActions("Tudo bem por aí?", true);

		findOption(actions.options, "tone").action();

		expect(actions.startToneChange).toHaveBeenCalledWith("Tudo bem por aí?");
		expect(actions.push).toHaveBeenCalledWith("tone-target");
	});

	test("opens the language picker with the entered text", () => {
		const actions = createActions("Olá, tudo bem?", true);

		findOption(actions.options, "translation").action();

		expect(actions.startTranslation).toHaveBeenCalledWith("Olá, tudo bem?");
		expect(actions.push).toHaveBeenCalledWith("translation-target");
	});

	test("opens notes without requiring text", () => {
		const actions = createActions("", true);

		findOption(actions.options, "notes").action();

		expect(actions.openNotes).toHaveBeenCalled();
	});

	test("disables AI actions and shows the onboarding entry first when no key is set", () => {
		const actions = createActions("texto qualquer", false);

		expect(actions.options[0].id).toBe("onboard-ai");
		expect(actions.options[0].disabled).toBeUndefined();

		const correction = findOption(actions.options, "correction");
		const tone = findOption(actions.options, "tone");
		const translation = findOption(actions.options, "translation");
		expect(correction.disabled).toBe(true);
		expect(tone.disabled).toBe(true);
		expect(translation.disabled).toBe(true);
		expect(correction.hint).toBeTruthy();
		expect(tone.hint).toBeTruthy();
		expect(translation.hint).toBeTruthy();

		correction.action();
		tone.action();
		translation.action();
		expect(actions.correctText).not.toHaveBeenCalled();
		expect(actions.startToneChange).not.toHaveBeenCalled();
		expect(actions.startTranslation).not.toHaveBeenCalled();
	});

	test("keeps the onboarding entry visible even without typed text", () => {
		const actions = createActions("", false);

		expect(actions.options[0].id).toBe("onboard-ai");
		expect(findOption(actions.options, "correction").disabled).toBe(true);
	});

	test("routes the onboarding entry to the onboarding view", () => {
		const actions = createActions("texto", false);

		actions.options[0].action();

		expect(actions.push).toHaveBeenCalledWith("onboarding");
	});
});
