import type { UpdateLabels } from "./types";

const MAX_UPDATE_LABEL_LENGTH = 256;

function parseUpdateLabelText(value: unknown): string {
	if (typeof value !== "string") throw new Error("Invalid update label.");
	const trimmed = value.trim();
	if (!trimmed) throw new Error("Update label cannot be empty.");
	if (trimmed.length > MAX_UPDATE_LABEL_LENGTH) {
		throw new Error("Update label is too long.");
	}
	return trimmed;
}

function parseUpdateLabelSet(value: unknown): { title: string; body: string } {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid update label set.");
	}
	if (!("title" in value) || !("body" in value)) {
		throw new Error("Invalid update label set.");
	}
	return {
		title: parseUpdateLabelText((value as { title: unknown }).title),
		body: parseUpdateLabelText((value as { body: unknown }).body),
	};
}

export function parseUpdateLabels(value: unknown): UpdateLabels {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid update labels.");
	}
	if (!("available" in value) || !("ready" in value)) {
		throw new Error("Invalid update labels.");
	}
	return {
		available: parseUpdateLabelSet((value as { available: unknown }).available),
		ready: parseUpdateLabelSet((value as { ready: unknown }).ready),
	};
}
