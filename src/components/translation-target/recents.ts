import {
	findLanguage,
	type LanguageCode,
} from "@/components/translation-target/languages";

const STORAGE_KEY = "polire:translation:recents";
const MAX_RECENTS = 3;

function isLanguageCode(value: unknown): value is LanguageCode {
	return (
		typeof value === "string" &&
		findLanguage(value as LanguageCode) !== undefined
	);
}

/** Read the persisted list of recently-used languages, newest first. */
export function getRecentLanguages(): LanguageCode[] {
	if (typeof localStorage === "undefined") return [];
	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) return [];
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isLanguageCode).slice(0, MAX_RECENTS);
	} catch {
		return [];
	}
}

/** Move the given language to the top of the recents list and persist. */
export function pushRecentLanguage(code: LanguageCode): LanguageCode[] {
	const current = getRecentLanguages().filter((existing) => existing !== code);
	const next = [code, ...current].slice(0, MAX_RECENTS);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	return next;
}
