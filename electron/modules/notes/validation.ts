const MAX_NOTE_LENGTH = 100_000;
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function parseContent(value: unknown) {
	if (typeof value !== "string") throw new Error("Invalid note content.");
	if (value.length > MAX_NOTE_LENGTH) {
		throw new Error("Note content is too long.");
	}
	return value;
}

export function parseNewContent(value: unknown) {
	const content = parseContent(value);
	if (!content.trim()) throw new Error("Note content cannot be empty.");
	return content;
}

export function parseUpdateInput(value: unknown) {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid note input.");
	}
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

export function parseNoteId(value: unknown) {
	if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
		throw new Error("Invalid note id.");
	}
	return value;
}
