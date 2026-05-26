import type { BrowserWindow } from "electron";
import { ipcMain, shell } from "electron";
import { HOMEPAGE_URL } from "../constants";
import { assertMainWindowSender } from "../ipc/assert-renderer";
import { APP_CHANNELS } from "./channels";

/** Registers renderer requests that target application-level resources. */
export function registerAppIpcHandlers(window: BrowserWindow) {
	ipcMain.handle(APP_CHANNELS.openHomepage, (event) => {
		assertMainWindowSender(event, window);
		return shell.openExternal(HOMEPAGE_URL);
	});
}
