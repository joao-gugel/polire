import { contextBridge, ipcRenderer } from "electron";
import { AI_CHANNELS } from "./ai/channels";
import { APP_CHANNELS } from "./app/channels";
import { NOTES_CHANNELS } from "./notes/channels";
import type { PreloadApi } from "./preload-api";
import { SETTINGS_CHANNELS } from "./settings/channels";
import { TRAY_CHANNELS } from "./tray/channels";
import { UPDATE_CHANNELS } from "./update/channels";
import { WINDOW_CHANNELS } from "./window/channels";

const initialSettings = ipcRenderer.sendSync(
	SETTINGS_CHANNELS.get,
) as PreloadApi["settings"]["initial"];

const windowApi: Pick<PreloadApi, "hide" | "resizeForPaletteInput"> = {
	hide: () => ipcRenderer.invoke(WINDOW_CHANNELS.hide),
	resizeForPaletteInput: (extraHeight: number) =>
		ipcRenderer.invoke(WINDOW_CHANNELS.resizeForPaletteInput, extraHeight),
};

const trayApi: Pick<PreloadApi, "setTrayLabels"> = {
	setTrayLabels: (labels: { open: string; quit: string }) =>
		ipcRenderer.invoke(TRAY_CHANNELS.setLabels, labels),
};

const updateApi: Pick<
	PreloadApi,
	"setUpdateLabels" | "getUpdateStatus" | "onUpdateAvailable" | "openReleases"
> = {
	setUpdateLabels: (labels) =>
		ipcRenderer.invoke(UPDATE_CHANNELS.setLabels, labels),
	getUpdateStatus: () =>
		ipcRenderer.invoke(UPDATE_CHANNELS.getStatus) as Promise<string | null>,
	onUpdateAvailable: (cb: (version: string) => void) => {
		const listener = (_: unknown, version: string) => cb(version);
		ipcRenderer.on(UPDATE_CHANNELS.available, listener);
		return () =>
			ipcRenderer.removeListener(UPDATE_CHANNELS.available, listener);
	},
	openReleases: () => ipcRenderer.invoke(UPDATE_CHANNELS.openReleases),
};

const appApi: Pick<PreloadApi, "openHomepage"> = {
	openHomepage: () => ipcRenderer.invoke(APP_CHANNELS.openHomepage),
};

const settingsApi: PreloadApi["settings"] = {
	initial: initialSettings,
	setLocale: (locale) =>
		ipcRenderer.invoke(SETTINGS_CHANNELS.setLocale, locale),
};

const aiApi: PreloadApi["ai"] = {
	getSettings: () => ipcRenderer.invoke(AI_CHANNELS.getSettings),
	saveSettings: (settings) =>
		ipcRenderer.invoke(AI_CHANNELS.saveSettings, settings),
	saveApiKey: (provider, apiKey) =>
		ipcRenderer.invoke(AI_CHANNELS.saveApiKey, { provider, apiKey }),
	removeApiKey: (provider) =>
		ipcRenderer.invoke(AI_CHANNELS.removeApiKey, provider),
	transform: (request) => ipcRenderer.invoke(AI_CHANNELS.transform, request),
};

const notesApi: PreloadApi["notes"] = {
	list: () => ipcRenderer.invoke(NOTES_CHANNELS.list),
	create: (content) => ipcRenderer.invoke(NOTES_CHANNELS.create, content),
	update: (id, content) =>
		ipcRenderer.invoke(NOTES_CHANNELS.update, { id, content }),
	remove: (id) => ipcRenderer.invoke(NOTES_CHANNELS.remove, id),
};

/**
 * Bridge exposed on `window.api` in the renderer. Keep it minimal — anything
 * added here is implicitly part of the renderer-facing contract.
 */
const api: PreloadApi = {
	platform: process.platform,
	...windowApi,
	...trayApi,
	...updateApi,
	...appApi,
	settings: settingsApi,
	ai: aiApi,
	notes: notesApi,
};

contextBridge.exposeInMainWorld("api", api);
