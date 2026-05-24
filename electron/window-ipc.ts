import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { assertMainWindowSender } from "./ipc/assert-renderer";
import { hideWindow, resizeWindowForPaletteInput } from "./window";
import { WINDOW_CHANNELS } from "./window-channels";

function parseExtraHeight(value: unknown): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error("Invalid window height.");
	}
	return value;
}

/** Registers renderer requests that control the existing application window. */
export function registerWindowIpcHandlers(window: BrowserWindow) {
	ipcMain.handle(WINDOW_CHANNELS.hide, () => hideWindow());
	ipcMain.handle(
		WINDOW_CHANNELS.resizeForPaletteInput,
		(event, extraHeight: unknown) => {
			assertMainWindowSender(event, window);
			resizeWindowForPaletteInput(parseExtraHeight(extraHeight));
		},
	);
}
