import { Menu, nativeImage, Tray } from "electron";
import { APP_NAME } from "./constants";
import { quit, showWindow, toggleWindow } from "./window";

let tray: Tray | null = null;

/** Create the system tray icon. Left-click toggles the window; menu has Open/Quit. */
export function createTray() {
	tray = new Tray(nativeImage.createEmpty());
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
