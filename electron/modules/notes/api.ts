import { ipcRenderer } from "electron";
import { NOTES_CHANNELS } from "./channels";
import type { Note } from "./types";

export type NotesApi = {
	list: () => Promise<Note[]>;
	create: (content: string) => Promise<Note>;
	update: (id: string, content: string) => Promise<Note>;
	remove: (id: string) => Promise<void>;
};

export const notesApi: NotesApi = {
	list: () => ipcRenderer.invoke(NOTES_CHANNELS.list),
	create: (content) => ipcRenderer.invoke(NOTES_CHANNELS.create, content),
	update: (id, content) =>
		ipcRenderer.invoke(NOTES_CHANNELS.update, { id, content }),
	remove: (id) => ipcRenderer.invoke(NOTES_CHANNELS.remove, id),
};
