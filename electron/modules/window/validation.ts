export function parseExtraHeight(value: unknown): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error("Invalid window height.");
	}
	return value;
}
