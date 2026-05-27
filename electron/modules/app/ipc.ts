import type { BrowserWindow } from "electron";
import { app, ipcMain, shell } from "electron";
import { HOMEPAGE_URL } from "../../constants";
import { assertMainWindowSender } from "../../ipc/assert-renderer";
import { APP_CHANNELS } from "./channels";

/** Registers renderer requests that target application-level resources. */
export function registerAppIpcHandlers(window: BrowserWindow) {
	ipcMain.on(APP_CHANNELS.getVersion, (event) => {
		assertMainWindowSender(event, window);
		event.returnValue = app.getVersion();
	});
	ipcMain.handle(APP_CHANNELS.openHomepage, (event) => {
		assertMainWindowSender(event, window);
		return shell.openExternal(HOMEPAGE_URL);
	});
}
