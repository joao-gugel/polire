import type { Note } from "./types";

export const NOTE_EXTENSION = ".md";

export function serializeNote(note: Note): string {
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

export function parseNote(id: string, serialized: string): Note | null {
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
