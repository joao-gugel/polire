import { describe, expect, test } from "bun:test";
import { parseNewContent, parseNoteId, parseUpdateInput } from "./validation";

const noteId = "d7e1e972-0924-4adb-90bb-b6d6aacd49de";

describe("notes IPC validation", () => {
	test("accepts note creation and update inputs", () => {
		expect(parseNewContent("Conteudo")).toBe("Conteudo");
		expect(parseUpdateInput({ id: noteId, content: "" })).toEqual({
			id: noteId,
			content: "",
		});
		expect(parseNoteId(noteId)).toBe(noteId);
	});

	test("rejects empty new notes and malformed ids", () => {
		expect(() => parseNewContent("  ")).toThrow(
			"Note content cannot be empty.",
		);
		expect(() => parseNoteId("invalid")).toThrow("Invalid note id.");
	});
});
