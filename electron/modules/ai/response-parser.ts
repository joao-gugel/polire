import type { TransformHint, TransformResult } from "./types";

/** Parses the structured response requested for correction and tone transformations. */
export function parseImproveResponse(raw: string): TransformResult {
	const trimmed = stripCodeFences(raw.trim());
	try {
		const parsed = JSON.parse(trimmed) as unknown;
		if (!parsed || typeof parsed !== "object") return { text: raw };
		const text =
			"text" in parsed && typeof parsed.text === "string" ? parsed.text : raw;
		const hints =
			"hints" in parsed && Array.isArray(parsed.hints)
				? parsed.hints.filter(isHint)
				: [];
		return { text, hints };
	} catch {
		return { text: raw };
	}
}

function stripCodeFences(value: string): string {
	if (!value.startsWith("```")) return value;
	const withoutOpen = value.replace(/^```(?:json)?\s*/i, "");
	return withoutOpen.replace(/```\s*$/i, "").trim();
}

function isHint(value: unknown): value is TransformHint {
	return (
		!!value &&
		typeof value === "object" &&
		"original" in value &&
		typeof value.original === "string" &&
		"corrected" in value &&
		typeof value.corrected === "string" &&
		"explanation" in value &&
		typeof value.explanation === "string"
	);
}
