import { describe, expect, mock, test } from "bun:test";
import { buildPaletteOptions } from "@/components/palette/palette-options";

type PaletteDestination = "settings" | "correction" | "translation" | "notes";

function createActions(text: string) {
	const t = (key: string) => key;
	const push = mock((_view: PaletteDestination) => undefined);
	const correctText = mock(async (_text: string) => undefined);
	const translateToEnglish = mock(async (_text: string) => undefined);
	const saveAsNote = mock(async (_text: string) => undefined);
	const openNotes = mock(async () => undefined);
	const options = buildPaletteOptions(
		t,
		push,
		correctText,
		translateToEnglish,
		saveAsNote,
		openNotes,
		text,
	);
	return {
		push,
		correctText,
		translateToEnglish,
		saveAsNote,
		openNotes,
		options,
	};
}

describe("buildPaletteOptions", () => {
	test("does not start text actions when the input is blank", () => {
		const actions = createActions("   ");

		actions.options[0].action();
		actions.options[1].action();
		actions.options[2].action();

		expect(actions.correctText).not.toHaveBeenCalled();
		expect(actions.translateToEnglish).not.toHaveBeenCalled();
		expect(actions.saveAsNote).not.toHaveBeenCalled();
		expect(actions.push).not.toHaveBeenCalled();
	});

	test("starts correction with the entered text and navigates to its result", () => {
		const actions = createActions("Please fix this.");

		actions.options[0].action();

		expect(actions.correctText).toHaveBeenCalledWith("Please fix this.");
		expect(actions.push).toHaveBeenCalledWith("correction");
	});

	test("opens notes without requiring text", () => {
		const actions = createActions("");

		actions.options[3].action();

		expect(actions.openNotes).toHaveBeenCalled();
	});
});
