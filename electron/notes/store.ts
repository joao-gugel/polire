import { randomUUID } from "node:crypto";
import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { app } from "electron";
import type { Note } from "./types";

const NOTES_FOLDER = "notes";
const NOTE_EXTENSION = ".md";

function getNotesPath() {
	return path.join(app.getPath("userData"), NOTES_FOLDER);
}

function getNotePath(id: string) {
	return path.join(getNotesPath(), `${id}${NOTE_EXTENSION}`);
}

function serializeNote(note: Note) {
	return [
		"---",
		`id: ${JSON.stringify(note.id)}`,
		`createdAt: ${JSON.stringify(note.createdAt)}`,
		`updatedAt: ${JSON.stringify(note.updatedAt)}`,
		"---",
		"",
		note.content,
	].join("\n");
}

function readStringProperty(frontmatter: string, property: string) {
	const line = frontmatter
		.split("\n")
		.find((candidate) => candidate.startsWith(`${property}: `));
	if (!line) return null;
	try {
		const value = JSON.parse(line.slice(property.length + 2)) as unknown;
		return typeof value === "string" ? value : null;
	} catch {
		return null;
	}
}

function parseNote(id: string, serialized: string): Note | null {
	if (!serialized.startsWith("---\n")) return null;
	const endOfFrontmatter = serialized.indexOf("\n---\n", 4);
	if (endOfFrontmatter < 0) return null;
	const frontmatter = serialized.slice(4, endOfFrontmatter);
	const savedId = readStringProperty(frontmatter, "id");
	const createdAt = readStringProperty(frontmatter, "createdAt");
	const updatedAt = readStringProperty(frontmatter, "updatedAt");
	if (savedId !== id || !createdAt || !updatedAt) return null;
	if (
		Number.isNaN(Date.parse(createdAt)) ||
		Number.isNaN(Date.parse(updatedAt))
	) {
		return null;
	}
	const contentStart = endOfFrontmatter + "\n---\n".length;
	const content = serialized.slice(contentStart).replace(/^\n/, "");
	return { id, content, createdAt, updatedAt };
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
