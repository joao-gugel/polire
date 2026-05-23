import { contextBridge } from "electron";

/**
 * Bridge exposed on `window.api` in the renderer. Keep it minimal — anything
 * added here is implicitly part of the renderer-facing contract.
 */
contextBridge.exposeInMainWorld("api", {
	platform: process.platform,
});
