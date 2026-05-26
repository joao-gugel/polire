import type { BrowserWindow } from "electron";
import { ipcMain, shell } from "electron";
import { RELEASES_URL } from "../../constants";
import { assertMainWindowSender } from "../../ipc/assert-renderer";
import { UPDATE_CHANNELS } from "./channels";
import { setUpdateLabels } from "./notifications";
import { getAvailableVersion } from "./state";
import { parseUpdateLabels } from "./validation";

/** Registers renderer requests related to application update status and UI. */
export function registerUpdateIpcHandlers(window: BrowserWindow) {
	ipcMain.handle(UPDATE_CHANNELS.setLabels, (event, input: unknown) => {
		assertMainWindowSender(event, window);
		setUpdateLabels(parseUpdateLabels(input));
	});
	ipcMain.handle(UPDATE_CHANNELS.getStatus, (event) => {
		assertMainWindowSender(event, window);
		return getAvailableVersion();
	});
	ipcMain.handle(UPDATE_CHANNELS.openReleases, (event) => {
		assertMainWindowSender(event, window);
		return shell.openExternal(RELEASES_URL);
	});
}
