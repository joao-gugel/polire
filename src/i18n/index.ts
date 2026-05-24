/**
 * i18n state — persists the user choice and exposes a `t()` resolver. The
 * initial locale comes from `localStorage` (when the user has picked one) or
 * from the browser/system language, falling back to English when no match is
 * found. The `document.documentElement.lang` attribute is updated whenever the
 * locale changes so the OS spellchecker and other tooling pick up the switch.
 */

import { en } from "@/i18n/locales/en";
import { es } from "@/i18n/locales/es";
import { type Messages, ptBR } from "@/i18n/locales/pt-BR";

export type Locale = "pt-BR" | "en" | "es";

const STORAGE_KEY = "polire:locale";

const MESSAGES: Record<Locale, Messages> = {
	"pt-BR": ptBR,
	en,
	es,
};

export const LOCALES: Locale[] = ["pt-BR", "en", "es"];

function isLocale(value: unknown): value is Locale {
	return value === "pt-BR" || value === "en" || value === "es";
}

/**
 * Pick the closest supported locale for a BCP-47 tag like `pt-BR`, `en-US`,
 * or `es-AR`. Returns `null` when nothing matches so the caller can fall back.
 */
function matchLocale(tag: string | undefined | null): Locale | null {
	if (!tag) return null;
	const lower = tag.toLowerCase();
	if (lower === "pt-br" || lower.startsWith("pt")) return "pt-BR";
	if (lower.startsWith("es")) return "es";
	if (lower.startsWith("en")) return "en";
	return null;
}

function detectSystemLocale(): Locale {
	if (typeof navigator === "undefined") return "en";
	const candidates = [navigator.language, ...(navigator.languages ?? [])];
	for (const candidate of candidates) {
		const matched = matchLocale(candidate);
		if (matched) return matched;
	}
	return "en";
}

/** Reads the persisted locale, falling back to the detected system locale. */
export function getStoredLocale(): Locale {
	if (typeof localStorage === "undefined") return detectSystemLocale();
	const stored = localStorage.getItem(STORAGE_KEY);
	if (isLocale(stored)) return stored;
	return detectSystemLocale();
}

/** Persists the chosen locale and updates the document root immediately. */
export function setStoredLocale(locale: Locale) {
	localStorage.setItem(STORAGE_KEY, locale);
	applyLocale(locale);
}

function applyLocale(locale: Locale) {
	if (typeof document === "undefined") return;
	document.documentElement.lang = locale;
}

export function getMessages(locale: Locale): Messages {
	return MESSAGES[locale];
}

type TranslateParams = Record<string, string | number>;

/**
 * Resolve a dotted key like `palette.options.correction` against a messages
 * tree. Returns the key itself when the path is missing so the failure is
 * visible in the UI during development.
 */
export function translate(
	messages: Messages,
	key: string,
	params?: TranslateParams,
): string {
	const segments = key.split(".");
	let current: unknown = messages;
	for (const segment of segments) {
		if (typeof current !== "object" || current === null) {
			return key;
		}
		current = (current as Record<string, unknown>)[segment];
	}
	if (typeof current !== "string") return key;
	if (!params) return current;
	return current.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
		const value = params[name];
		if (value === undefined) return `{{${name}}}`;
		return String(value);
	});
}

applyLocale(getStoredLocale());
