import { describe, expect, test } from "bun:test";
import { parseLocale } from "./validation";

describe("settings IPC validation", () => {
	test("accepts supported locales and rejects unknown values", () => {
		expect(parseLocale("pt-BR")).toBe("pt-BR");
		expect(parseLocale("en")).toBe("en");
		expect(() => parseLocale("fr")).toThrow("Invalid locale.");
	});
});
