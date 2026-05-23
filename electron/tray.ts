import { Menu, nativeImage, Tray } from "electron";
import { APP_NAME, TRAY_ICON } from "./constants";
import { quit, showWindow, toggleWindow } from "./window";

let tray: Tray | null = null;

/** Create the system tray icon. Left-click toggles the window; menu has Open/Quit. */
export function createTray() {
	const trayIcon = nativeImage.createFromPath(TRAY_ICON);
	if (trayIcon.isEmpty()) throw new Error("Tray icon could not be loaded.");
	tray = new Tray(trayIcon);
	tray.setToolTip(APP_NAME);
	tray.setContextMenu(
		Menu.buildFromTemplate([
			{ label: "Abrir", click: showWindow },
			{ type: "separator" },
			{ label: "Sair", click: quit },
		]),
	);
	tray.on("click", toggleWindow);
}
