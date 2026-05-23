import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { app } from "electron";
import type { AiProvider, AiSettings } from "./types";

const SETTINGS_FILE = "ai-settings.json";
const MAX_MODEL_LENGTH = 128;

const DEFAULT_SETTINGS: AiSettings = {
	provider: "openai",
	model: "gpt-4.1-mini",
};

export function isAiProvider(value: unknown): value is AiProvider {
	return (
		value === "openai" ||
		value === "anthropic" ||
		value === "google" ||
		value === "deepseek"
	);
}

function isSettings(value: unknown): value is AiSettings {
	if (!value || typeof value !== "object") return false;
	if (!("provider" in value) || !isAiProvider(value.provider)) return false;
	if (!("model" in value) || typeof value.model !== "string") return false;
	const model = value.model.trim();
	return model.length > 0 && model.length <= MAX_MODEL_LENGTH;
}

function getSettingsPath() {
	return path.join(app.getPath("userData"), SETTINGS_FILE);
}

/** Loads local provider preferences, returning defaults before first setup or after invalid data. */
export async function loadAiSettings(): Promise<AiSettings> {
	try {
		const savedSettings = JSON.parse(
			await readFile(getSettingsPath(), "utf8"),
		) as unknown;
		if (isSettings(savedSettings)) return savedSettings;
		return DEFAULT_SETTINGS;
	} catch {
		return DEFAULT_SETTINGS;
	}
}

/** Saves local provider preferences without storing credentials. */
export async function saveAiSettings(settings: unknown): Promise<AiSettings> {
	if (!isSettings(settings)) throw new Error("Invalid AI settings.");
	await writeFile(
		getSettingsPath(),
		JSON.stringify(settings, null, "\t"),
		"utf8",
	);
	return settings;
}
