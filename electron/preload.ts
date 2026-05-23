import { contextBridge, ipcRenderer } from "electron";
import { AI_CHANNELS } from "./ai/channels";

/**
 * Bridge exposed on `window.api` in the renderer. Keep it minimal — anything
 * added here is implicitly part of the renderer-facing contract.
 */
contextBridge.exposeInMainWorld("api", {
	platform: process.platform,
	ai: {
		getSettings: () => ipcRenderer.invoke(AI_CHANNELS.getSettings),
		saveSettings: (settings: unknown) =>
			ipcRenderer.invoke(AI_CHANNELS.saveSettings, settings),
		saveApiKey: (provider: unknown, apiKey: unknown) =>
			ipcRenderer.invoke(AI_CHANNELS.saveApiKey, { provider, apiKey }),
		removeApiKey: (provider: unknown) =>
			ipcRenderer.invoke(AI_CHANNELS.removeApiKey, provider),
		transform: (request: unknown) =>
			ipcRenderer.invoke(AI_CHANNELS.transform, request),
	},
});
