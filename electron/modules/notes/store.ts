import { randomUUID } from "node:crypto";
import {
	mkdir,
	readdir,
	readFile,
	rename,
	unlink,
	writeFile,
} from "node:fs/promises";
import path from "node:path";
import { app } from "electron";
import { NOTE_EXTENSION, parseNote, serializeNote } from "./markdown";
import type { Note } from "./types";

const NOTES_FOLDER = "notes";

function getNotesPath() {
	return path.join(app.getPath("userData"), NOTES_FOLDER);
}

function getNotePath(id: string) {
	return path.join(getNotesPath(), `${id}${NOTE_EXTENSION}`);
}

async function persistNote(note: Note) {
	await mkdir(getNotesPath(), { recursive: true });
	const notePath = getNotePath(note.id);
	const temporaryPath = `${notePath}.${randomUUID()}.tmp`;
	await writeFile(temporaryPath, serializeNote(note), "utf8");
	await rename(temporaryPath, notePath);
}

/** Lists valid Markdown notes, most recently updated first. */
export async function listNotes(): Promise<Note[]> {
	await mkdir(getNotesPath(), { recursive: true });
	const files = await readdir(getNotesPath());
	const notes = await Promise.all(
		files
			.filter((file) => file.endsWith(NOTE_EXTENSION))
			.map(async (file) => {
				const id = file.slice(0, -NOTE_EXTENSION.length);
				try {
					const serialized = await readFile(getNotePath(id), "utf8");
					return parseNote(id, serialized);
				} catch {
					return null;
				}
			}),
	);
	return notes
		.filter((note): note is Note => note !== null)
		.sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
}

/** Creates a Markdown note with a stable UUID suitable for future synchronization. */
export async function createNote(content: string): Promise<Note> {
	const timestamp = new Date().toISOString();
	const note = {
		id: randomUUID(),
		content,
		createdAt: timestamp,
		updatedAt: timestamp,
	};
	await persistNote(note);
	return note;
}

/** Updates the text of one existing note while preserving its creation metadata. */
export async function updateNote(id: string, content: string): Promise<Note> {
	const existing = parseNote(id, await readFile(getNotePath(id), "utf8"));
	if (!existing) throw new Error("Note not found.");
	const note = { ...existing, content, updatedAt: new Date().toISOString() };
	await persistNote(note);
	return note;
}

/** Permanently removes one local note file. */
export async function removeNote(id: string): Promise<void> {
	await unlink(getNotePath(id));
}
