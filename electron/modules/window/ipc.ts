import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { assertMainWindowSender } from "../../ipc/assert-renderer";
import { WINDOW_CHANNELS } from "./channels";
import { hideWindow, resizeWindowForPaletteInput } from "./manager";
import { parseExtraHeight } from "./validation";

/** Registers renderer requests that control the existing application window. */
export function registerWindowIpcHandlers(window: BrowserWindow) {
	ipcMain.handle(WINDOW_CHANNELS.hide, (event) => {
		assertMainWindowSender(event, window);
		hideWindow();
	});
	ipcMain.handle(
		WINDOW_CHANNELS.resizeForPaletteInput,
		(event, extraHeight: unknown) => {
			assertMainWindowSender(event, window);
			resizeWindowForPaletteInput(parseExtraHeight(extraHeight));
		},
	);
}
