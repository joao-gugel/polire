import { BrowserWindow } from "electron";
import { UPDATE_CHANNELS } from "./channels";

let availableVersion: string | null = null;

export function getAvailableVersion(): string | null {
	return availableVersion;
}

export function setAvailableVersion(version: string) {
	if (availableVersion === version) return;
	availableVersion = version;
	for (const win of BrowserWindow.getAllWindows()) {
		win.webContents.send(UPDATE_CHANNELS.available, version);
	}
}
