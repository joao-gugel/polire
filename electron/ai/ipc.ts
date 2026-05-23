import { pathToFileURL } from "node:url";
import type { BrowserWindow, IpcMainInvokeEvent } from "electron";
import { ipcMain } from "electron";
import { DEV_URL, INDEX_HTML } from "../constants";
import { AI_CHANNELS } from "./channels";
import { hasApiKey, removeApiKey, saveApiKey } from "./secret-store";
import { isAiProvider, loadAiSettings, saveAiSettings } from "./settings-store";
import type { AiProvider, AiSettingsStatus } from "./types";

type SaveApiKeyInput = {
	provider: AiProvider;
	apiKey: string;
};

function isTrustedRendererUrl(url: string): boolean {
	if (DEV_URL) return new URL(url).origin === new URL(DEV_URL).origin;
	return url === pathToFileURL(INDEX_HTML).toString();
}

function assertMainWindowSender(
	event: IpcMainInvokeEvent,
	window: BrowserWindow,
) {
	if (event.sender !== window.webContents)
		throw new Error("Unauthorized IPC sender.");
	if (event.senderFrame !== window.webContents.mainFrame) {
		throw new Error("Unauthorized IPC sender.");
	}
	if (isTrustedRendererUrl(event.senderFrame.url)) return;
	throw new Error("Unauthorized IPC sender.");
}

function parseSaveApiKeyInput(value: unknown): SaveApiKeyInput {
	if (!value || typeof value !== "object") {
		throw new Error("Invalid API key input.");
	}
	if (!("provider" in value) || !isAiProvider(value.provider)) {
		throw new Error("Invalid AI provider.");
	}
	if (!("apiKey" in value) || typeof value.apiKey !== "string") {
		throw new Error("Invalid API key input.");
	}
	return { provider: value.provider, apiKey: value.apiKey };
}

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
}
