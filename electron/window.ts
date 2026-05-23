import { app, BrowserWindow } from "electron";
import {
	DEV_URL,
	INDEX_HTML,
	PRELOAD,
	WINDOW_HEIGHT,
	WINDOW_WIDTH,
} from "./constants";

let win: BrowserWindow | null = null;
let isQuitting = false;

/** Load the dev server in development, or the built index.html in production. */
function loadRenderer(window: BrowserWindow) {
	if (DEV_URL) return window.loadURL(DEV_URL);
	return window.loadFile(INDEX_HTML);
}

/** Hide the window when Esc is pressed while it has focus. */
function hideOnEscape(_event: Electron.Event, input: Electron.Input) {
	if (input.type !== "keyDown") return;
	if (input.key !== "Escape") return;
	win?.hide();
}

/** Show and focus the window. No-op if it hasn't been created yet. */
export function showWindow() {
	if (!win) return;
	win.show();
	win.focus();
}

/** Hide the window if it is visible and focused; otherwise show and focus it. No-op if it hasn't been created yet. */
export function toggleWindow() {
	if (!win) return;
	if (win.isVisible() && win.isFocused()) return win.hide();
	showWindow();
}

/** Flag the app as quitting and request Electron to exit. */
export function quit() {
	isQuitting = true;
	app.quit();
}

/** Create the main window hidden, and wire close-to-tray behavior (closing only hides until `quit()` runs). */
export function createWindow() {
	win = new BrowserWindow({
		webPreferences: { preload: PRELOAD },
		height: WINDOW_HEIGHT,
		width: WINDOW_WIDTH,
		show: false,
		frame: false,
		transparent: true,
		backgroundColor: "#00000000",
		resizable: false,
		hasShadow: true,
		vibrancy: "under-window",
		backgroundMaterial: "acrylic",
	});
	loadRenderer(win);
	win.webContents.on("before-input-event", hideOnEscape);
	win.on("close", (event) => {
		if (isQuitting) return;
		event.preventDefault();
		win?.hide();
	});
}
