import type { BrowserWindow } from "electron";
import { ipcMain } from "electron";
import { assertMainWindowSender } from "./ipc/assert-renderer";
import { setTrayLabels, type TrayLabels } from "./tray";
import { hideWindow, resizeWindowForPaletteInput } from "./window";
import { WINDOW_CHANNELS } from "./window-channels";

const MAX_TRAY_LABEL_LENGTH = 64;

function parseExtraHeight(value: unknown): number {
	if (typeof value !== "number" || !Number.isFinite(value)) {
		throw new Error("Invalid window height.");
	}
	return value;
}

function parseTrayLabel(value: unknown): string {
	if (typeof value !== "string") throw new Error("Invalid tray label.");
	const trimmed = value.trim();
	if (!trimmed) throw new Error("Tray label cannot be empty.");
	if (trimmed.length > MAX_TRAY_LABEL_LENGTH)
		throw new Error("Tray label is too long.");
	return trimmed;
}

function parseTrayLabels(value: unknown): TrayLabels {
	if (!value || typeof value !== "object")
		throw new Error("Invalid tray labels.");
	if (!("open" in value) || !("quit" in value))
		throw new Error("Invalid tray labels.");
	return {
		open: parseTrayLabel((value as { open: unknown }).open),
		quit: parseTrayLabel((value as { quit: unknown }).quit),
	};
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
	ipcMain.handle(WINDOW_CHANNELS.setTrayLabels, (event, input: unknown) => {
		assertMainWindowSender(event, window);
		setTrayLabels(parseTrayLabels(input));
	});
}
