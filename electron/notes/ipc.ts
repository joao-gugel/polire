import { pathToFileURL } from "node:url";
import type { BrowserWindow, IpcMainInvokeEvent } from "electron";
import { ipcMain } from "electron";
import { DEV_URL, INDEX_HTML } from "../constants";
import { NOTES_CHANNELS } from "./channels";
import { createNote, listNotes, updateNote } from "./store";

const MAX_NOTE_LENGTH = 100_000;
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isTrustedRendererUrl(url: string): boolean {
	if (DEV_URL) return new URL(url).origin === new URL(DEV_URL).origin;
	return url === pathToFileURL(INDEX_HTML).toString();
}

function assertMainWindowSender(
	event: IpcMainInvokeEvent,
	window: BrowserWindow,
) {
	if (event.sender !== window.webContents)
		throw new Error("Unauthorized IPC sender.");
	if (event.senderFrame !== window.webContents.mainFrame) {
		throw new Error("Unauthorized IPC sender.");
	}
	if (isTrustedRendererUrl(event.senderFrame.url)) return;
	throw new Error("Unauthorized IPC sender.");
}

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
}
