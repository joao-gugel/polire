import { describe, expect, test } from "bun:test";
import { parseUpdateLabels } from "./validation";

describe("update IPC validation", () => {
	test("normalizes complete label sets and rejects incomplete data", () => {
		expect(
			parseUpdateLabels({
				available: { title: " Available ", body: " Download " },
				ready: { title: " Ready ", body: " Restart " },
			}),
		).toEqual({
			available: { title: "Available", body: "Download" },
			ready: { title: "Ready", body: "Restart" },
		});
		expect(() => parseUpdateLabels({ available: {} })).toThrow(
			"Invalid update labels.",
		);
	});
});
