import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { assertMainWindowSender } from "../ipc/assert-renderer";
import { NOTES_CHANNELS } from "./channels";
import { createNote, listNotes, removeNote, updateNote } from "./store";

const MAX_NOTE_LENGTH = 100_000;
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseContent(value: unknown) {
	if (typeof value !== "string") throw new Error("Invalid note content.");
	if (value.length > MAX_NOTE_LENGTH)
		throw new Error("Note content is too long.");
	return value;
}

function parseNewContent(value: unknown) {
	const content = parseContent(value);
	if (!content.trim()) throw new Error("Note content cannot be empty.");
	return content;
}

function parseUpdateInput(value: unknown) {
	if (!value || typeof value !== "object")
		throw new Error("Invalid note input.");
	if (
		!("id" in value) ||
		typeof value.id !== "string" ||
		!UUID_PATTERN.test(value.id)
	) {
		throw new Error("Invalid note id.");
	}
	if (!("content" in value)) throw new Error("Invalid note content.");
	return { id: value.id, content: parseContent(value.content) };
}

function parseNoteId(value: unknown) {
	if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
		throw new Error("Invalid note id.");
	}
	return value;
}

/** Registers renderer access to local Markdown notes through validated operations. */
export function registerNotesIpcHandlers(window: BrowserWindow) {
	ipcMain.handle(NOTES_CHANNELS.list, async (event) => {
		assertMainWindowSender(event, window);
		return listNotes();
	});
	ipcMain.handle(NOTES_CHANNELS.create, async (event, content: unknown) => {
		assertMainWindowSender(event, window);
		return createNote(parseNewContent(content));
	});
	ipcMain.handle(NOTES_CHANNELS.update, async (event, input: unknown) => {
		assertMainWindowSender(event, window);
		const note = parseUpdateInput(input);
		return updateNote(note.id, note.content);
	});
	ipcMain.handle(NOTES_CHANNELS.remove, async (event, id: unknown) => {
		assertMainWindowSender(event, window);
		await removeNote(parseNoteId(id));
	});
}
