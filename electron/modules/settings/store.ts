import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { app } from "electron";
import type { Locale, Settings } from "./types";
import { isLocale } from "./validation";

const DEFAULTS: Settings = { locale: null };

function settingsPath(): string {
	return path.join(app.getPath("userData"), "settings.json");
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

export function setLocale(locale: Locale): void {
	cache = { ...getSettings(), locale };
	writeFileSync(settingsPath(), JSON.stringify(cache, null, 2));
}
