import { contextBridge, ipcRenderer } from "electron";
import { AI_CHANNELS } from "./ai/channels";
import { NOTES_CHANNELS } from "./notes/channels";
import { WINDOW_CHANNELS } from "./window-channels";

/**
 * Bridge exposed on `window.api` in the renderer. Keep it minimal — anything
 * added here is implicitly part of the renderer-facing contract.
 */
contextBridge.exposeInMainWorld("api", {
	platform: process.platform,
	hide: () => ipcRenderer.invoke(WINDOW_CHANNELS.hide),
	resizeForPaletteInput: (extraHeight: number) =>
		ipcRenderer.invoke(WINDOW_CHANNELS.resizeForPaletteInput, extraHeight),
	setTrayLabels: (labels: { open: string; quit: string }) =>
		ipcRenderer.invoke(WINDOW_CHANNELS.setTrayLabels, labels),
	setUpdateLabels: (labels: {
		available: { title: string; body: string };
		ready: { title: string; body: string };
	}) => ipcRenderer.invoke(WINDOW_CHANNELS.setUpdateLabels, labels),
	getUpdateStatus: () =>
		ipcRenderer.invoke(WINDOW_CHANNELS.getUpdateStatus) as Promise<
			string | null
		>,
	onUpdateAvailable: (cb: (version: string) => void) => {
		const listener = (_: unknown, version: string) => cb(version);
		ipcRenderer.on(WINDOW_CHANNELS.updateAvailable, listener);
		return () =>
			ipcRenderer.removeListener(WINDOW_CHANNELS.updateAvailable, listener);
	},
	openReleases: () => ipcRenderer.invoke(WINDOW_CHANNELS.openReleases),
	openHomepage: () => ipcRenderer.invoke(WINDOW_CHANNELS.openHomepage),
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
	notes: {
		list: () => ipcRenderer.invoke(NOTES_CHANNELS.list),
		create: (content: unknown) =>
			ipcRenderer.invoke(NOTES_CHANNELS.create, content),
		update: (id: unknown, content: unknown) =>
			ipcRenderer.invoke(NOTES_CHANNELS.update, { id, content }),
		remove: (id: unknown) => ipcRenderer.invoke(NOTES_CHANNELS.remove, id),
	},
});
