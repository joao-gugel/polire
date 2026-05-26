import { Menu, nativeImage, Tray } from "electron";
import { APP_NAME, TRAY_ICON } from "../constants";
import { quit, showWindow, toggleWindow } from "../window/manager";
import type { TrayLabels } from "./types";

let tray: Tray | null = null;
let labels: TrayLabels = { open: "Open", quit: "Quit" };

function applyContextMenu() {
	if (!tray) return;
	tray.setContextMenu(
		Menu.buildFromTemplate([
			{ label: labels.open, click: showWindow },
			{ type: "separator" },
			{ label: labels.quit, click: quit },
		]),
	);
}

/** Create the system tray icon. Left-click toggles the window; menu has Open/Quit. */
export function createTray() {
	const trayIcon = nativeImage.createFromPath(TRAY_ICON);
	if (trayIcon.isEmpty()) throw new Error("Tray icon could not be loaded.");
	tray = new Tray(trayIcon);
	tray.setToolTip(APP_NAME);
	applyContextMenu();
	tray.on("click", toggleWindow);
}

/** Update the tray menu labels — called from the renderer when the locale changes. */
export function setTrayLabels(next: TrayLabels) {
	labels = next;
	applyContextMenu();
}
