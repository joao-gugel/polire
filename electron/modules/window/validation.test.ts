import { describe, expect, test } from "bun:test";
import { parseExtraHeight } from "./validation";

describe("window IPC validation", () => {
	test("accepts finite heights and rejects invalid values", () => {
		expect(parseExtraHeight(24)).toBe(24);
		expect(() => parseExtraHeight(Number.NaN)).toThrow(
			"Invalid window height.",
		);
		expect(() => parseExtraHeight("24")).toThrow("Invalid window height.");
	});
});
