import { contextBridge } from "electron";
import { aiApi } from "./modules/ai/api";
import { appApi } from "./modules/app/api";
import { notesApi } from "./modules/notes/api";
import { settingsApi } from "./modules/settings/api";
import { trayApi } from "./modules/tray/api";
import { updateApi } from "./modules/update/api";
import { windowApi } from "./modules/window/api";
import type { PreloadApi } from "./preload-api";

/**
 * Bridge exposed on `window.api` in the renderer. Keep it minimal — anything
 * added here is implicitly part of the renderer-facing contract.
 */
const api = {
	platform: process.platform,
	...windowApi,
	...trayApi,
	...updateApi,
	...appApi,
	settings: settingsApi,
	ai: aiApi,
	notes: notesApi,
} satisfies PreloadApi;

contextBridge.exposeInMainWorld("api", api);
