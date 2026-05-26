import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { app } from "electron";

const VALID_LOCALES = ["pt-BR", "en", "es"] as const;
export type Locale = (typeof VALID_LOCALES)[number];

export type Settings = { locale: Locale | null };

const DEFAULTS: Settings = { locale: null };

function settingsPath(): string {
	return path.join(app.getPath("userData"), "settings.json");
}

function isLocale(value: unknown): value is Locale {
	return (
		typeof value === "string" &&
		(VALID_LOCALES as readonly string[]).includes(value)
	);
}

let cache: Settings | null = null;

function load(): Settings {
	try {
		const parsed = JSON.parse(readFileSync(settingsPath(), "utf-8"));
		return { locale: isLocale(parsed.locale) ? parsed.locale : null };
	} catch {
		return DEFAULTS;
	}
}

export function getSettings(): Settings {
	if (!cache) cache = load();
	return cache;
}

export function setLocale(locale: unknown): void {
	if (!isLocale(locale)) throw new Error("Invalid locale.");
	cache = { ...getSettings(), locale };
	writeFileSync(settingsPath(), JSON.stringify(cache, null, 2));
}
