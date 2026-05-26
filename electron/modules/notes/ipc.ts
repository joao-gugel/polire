import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { assertMainWindowSender } from "../../ipc/assert-renderer";
import { NOTES_CHANNELS } from "./channels";
import { createNote, listNotes, removeNote, updateNote } from "./store";
import { parseNewContent, parseNoteId, parseUpdateInput } from "./validation";

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
