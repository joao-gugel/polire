import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { assertMainWindowSender } from "../ipc/assert-renderer";
import { TRAY_CHANNELS } from "./channels";
import { setTrayLabels } from "./manager";
import { parseTrayLabels } from "./validation";

/** Registers renderer requests that localize the native tray menu. */
export function registerTrayIpcHandlers(window: BrowserWindow) {
	ipcMain.handle(TRAY_CHANNELS.setLabels, (event, input: unknown) => {
		assertMainWindowSender(event, window);
		setTrayLabels(parseTrayLabels(input));
	});
}
