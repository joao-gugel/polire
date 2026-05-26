import { app, globalShortcut, Menu } from "electron";

import { SHORTCUT } from "./constants";
import { registerIpcHandlers } from "./ipc/register-handlers";

import { createTray } from "./modules/tray/manager";
import { initAutoUpdater } from "./modules/update/auto-updater";
import { initVersionCheck } from "./modules/update/version-check";
import { createWindow, toggleWindow } from "./modules/window/manager";

/** Enable portal-backed global shortcuts for native Wayland sessions on Linux. */
function enableLinuxGlobalShortcutsPortal() {
	if (process.platform !== "linux") return;
	app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");
}

enableLinuxGlobalShortcutsPortal();

/** Register the global hotkey. */
function registerShortcuts() {
	const ok = globalShortcut.register(SHORTCUT, toggleWindow);
	if (!ok) console.error(`Failed to register global shortcut ${SHORTCUT}`);
}

app.whenReady().then(() => {
	Menu.setApplicationMenu(null);

	const mainWindow = createWindow();
	registerIpcHandlers(mainWindow);

	createTray();
	registerShortcuts();
	initAutoUpdater();
	initVersionCheck();
});

app.on("will-quit", () => globalShortcut.unregisterAll());
// Keep the app alive in the tray when all windows are closed.
// Registering an empty listener overrides Electron's default quit-on-all-closed.
app.on("window-all-closed", () => {});
