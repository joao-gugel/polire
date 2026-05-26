import type { BrowserWindow } from "electron";
import { ipcMain, shell } from "electron";
import { HOMEPAGE_URL, RELEASES_URL } from "./constants";
import { assertMainWindowSender } from "./ipc/assert-renderer";
import { setTrayLabels, type TrayLabels } from "./tray";
import { setUpdateLabels, type UpdateLabels } from "./update-notifications";
import { getAvailableVersion } from "./update-state";
import { hideWindow, resizeWindowForPaletteInput } from "./window";
import { WINDOW_CHANNELS } from "./window-channels";

const MAX_TRAY_LABEL_LENGTH = 64;
const MAX_UPDATE_LABEL_LENGTH = 256;

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
	ipcMain.handle(WINDOW_CHANNELS.setUpdateLabels, (event, input: unknown) => {
		assertMainWindowSender(event, window);
		setUpdateLabels(parseUpdateLabels(input));
	});
	ipcMain.handle(WINDOW_CHANNELS.getUpdateStatus, () => getAvailableVersion());
	ipcMain.handle(WINDOW_CHANNELS.openReleases, () =>
		shell.openExternal(RELEASES_URL),
	);
	ipcMain.handle(WINDOW_CHANNELS.openHomepage, () =>
		shell.openExternal(HOMEPAGE_URL),
	);
}

function parseUpdateLabelText(value: unknown): string {
	if (typeof value !== "string") throw new Error("Invalid update label.");
	const trimmed = value.trim();
	if (!trimmed) throw new Error("Update label cannot be empty.");
	if (trimmed.length > MAX_UPDATE_LABEL_LENGTH)
		throw new Error("Update label is too long.");
	return trimmed;
}

function parseUpdateLabelSet(value: unknown): { title: string; body: string } {
	if (!value || typeof value !== "object")
		throw new Error("Invalid update label set.");
	if (!("title" in value) || !("body" in value))
		throw new Error("Invalid update label set.");
	return {
		title: parseUpdateLabelText((value as { title: unknown }).title),
		body: parseUpdateLabelText((value as { body: unknown }).body),
	};
}

function parseUpdateLabels(value: unknown): UpdateLabels {
	if (!value || typeof value !== "object")
		throw new Error("Invalid update labels.");
	if (!("available" in value) || !("ready" in value))
		throw new Error("Invalid update labels.");
	return {
		available: parseUpdateLabelSet((value as { available: unknown }).available),
		ready: parseUpdateLabelSet((value as { ready: unknown }).ready),
	};
}
