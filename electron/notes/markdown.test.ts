import { describe, expect, test } from "bun:test";
import { parseNote, serializeNote } from "./markdown";
import type { Note } from "./types";

const note: Note = {
	id: "d7e1e972-0924-4adb-90bb-b6d6aacd49de",
	content: "Primeira linha\n\nSegunda linha",
	createdAt: "2026-05-24T10:00:00.000Z",
	updatedAt: "2026-05-24T11:00:00.000Z",
};

describe("notes Markdown format", () => {
	test("round-trips note metadata and content", () => {
		expect(parseNote(note.id, serializeNote(note))).toEqual(note);
	});

	test("rejects a document whose metadata does not match its file identity", () => {
		expect(parseNote("different-id", serializeNote(note))).toBeNull();
	});
});
