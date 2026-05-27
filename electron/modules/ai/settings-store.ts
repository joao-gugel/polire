import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { app } from "electron";
import type { AiSettings } from "./types";
import { isAiSettings } from "./validation";

const SETTINGS_FILE = "ai-settings.json";

const DEFAULT_SETTINGS: AiSettings = {
	provider: "openai",
	model: "gpt-5.4",
};

function getSettingsPath() {
	return path.join(app.getPath("userData"), SETTINGS_FILE);
}

/** Loads local provider preferences, returning defaults before first setup or after invalid data. */
export async function loadAiSettings(): Promise<AiSettings> {
	try {
		const savedSettings = JSON.parse(
			await readFile(getSettingsPath(), "utf8"),
		) as unknown;
		if (isAiSettings(savedSettings)) return savedSettings;
		return DEFAULT_SETTINGS;
	} catch {
		return DEFAULT_SETTINGS;
	}
}

/** Saves local provider preferences without storing credentials. */
export async function saveAiSettings(settings: unknown): Promise<AiSettings> {
	if (!isAiSettings(settings)) throw new Error("Invalid AI settings.");
	await writeFile(
		getSettingsPath(),
		JSON.stringify(settings, null, "\t"),
		"utf8",
	);
	return settings;
}
