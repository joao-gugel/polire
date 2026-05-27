import type { Locale } from "./types";

const VALID_LOCALES: Locale[] = ["pt-BR", "en", "es"];

export function isLocale(value: unknown): value is Locale {
	return (
		typeof value === "string" &&
		(VALID_LOCALES as readonly string[]).includes(value)
	);
}

export function parseLocale(value: unknown): Locale {
	if (!isLocale(value)) throw new Error("Invalid locale.");
	return value;
}
