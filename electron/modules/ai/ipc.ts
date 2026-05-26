import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { assertMainWindowSender } from "../../ipc/assert-renderer";
import { AI_CHANNELS } from "./channels";
import { hasApiKey, removeApiKey, saveApiKey } from "./secret-store";
import { loadAiSettings, saveAiSettings } from "./settings-store";
import { transformText } from "./transform";
import type { AiSettingsStatus } from "./types";
import {
	isAiProvider,
	parseSaveApiKeyInput,
	parseTransformRequest,
} from "./validation";

async function getSettingsStatus(): Promise<AiSettingsStatus> {
	const settings = await loadAiSettings();
	return {
		...settings,
		hasApiKey: await hasApiKey(settings.provider),
	};
}

/** Registers the limited AI configuration API available to the renderer. */
export function registerAiIpcHandlers(window: BrowserWindow) {
	ipcMain.handle(AI_CHANNELS.getSettings, async (event) => {
		assertMainWindowSender(event, window);
		return getSettingsStatus();
	});
	ipcMain.handle(AI_CHANNELS.saveSettings, async (event, input: unknown) => {
		assertMainWindowSender(event, window);
		await saveAiSettings(input);
		return getSettingsStatus();
	});
	ipcMain.handle(AI_CHANNELS.saveApiKey, async (event, input: unknown) => {
		assertMainWindowSender(event, window);
		const { provider, apiKey } = parseSaveApiKeyInput(input);
		await saveApiKey(provider, apiKey);
		return getSettingsStatus();
	});
	ipcMain.handle(AI_CHANNELS.removeApiKey, async (event, provider: unknown) => {
		assertMainWindowSender(event, window);
		if (!isAiProvider(provider)) throw new Error("Invalid AI provider.");
		await removeApiKey(provider);
		return getSettingsStatus();
	});
	ipcMain.handle(AI_CHANNELS.transform, async (event, input: unknown) => {
		assertMainWindowSender(event, window);
		return transformText(parseTransformRequest(input));
	});
}
