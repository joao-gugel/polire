import type { TrayLabels } from "./types";

const MAX_TRAY_LABEL_LENGTH = 64;

function parseTrayLabel(value: unknown): string {
	if (typeof value !== "string") throw new Error("Invalid tray label.");
	const trimmed = value.trim();
	if (!trimmed) throw new Error("Tray label cannot be empty.");
	if (trimmed.length > MAX_TRAY_LABEL_LENGTH) {
		throw new Error("Tray label is too long.");
	}
	return trimmed;
}

export function parseTrayLabels(value: unknown): TrayLabels {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid tray labels.");
	}
	if (!("open" in value) || !("quit" in value)) {
		throw new Error("Invalid tray labels.");
	}
	return {
		open: parseTrayLabel((value as { open: unknown }).open),
		quit: parseTrayLabel((value as { quit: unknown }).quit),
	};
}
