import { describe, expect, test } from "bun:test";
import { parseTrayLabels } from "./validation";

describe("tray IPC validation", () => {
	test("normalizes valid labels and rejects blank labels", () => {
		expect(parseTrayLabels({ open: " Open ", quit: " Quit " })).toEqual({
			open: "Open",
			quit: "Quit",
		});
		expect(() => parseTrayLabels({ open: "", quit: "Quit" })).toThrow(
			"Tray label cannot be empty.",
		);
	});
});
