import { app, globalShortcut, Menu } from "electron";
import { SHORTCUT } from "./constants";
import { registerAiIpcHandlers } from "./modules/ai/ipc";
import { registerAppIpcHandlers } from "./modules/app/ipc";
import { registerNotesIpcHandlers } from "./modules/notes/ipc";
import { registerSettingsIpcHandlers } from "./modules/settings/ipc";
import { registerTrayIpcHandlers } from "./modules/tray/ipc";
import { createTray } from "./modules/tray/manager";
import { initAutoUpdater } from "./modules/update/auto-updater";
import { registerUpdateIpcHandlers } from "./modules/update/ipc";
import { initVersionCheck } from "./modules/update/version-check";
import { registerWindowIpcHandlers } from "./modules/window/ipc";
import { createWindow, toggleWindow } from "./modules/window/manager";

/** Enable portal-backed global shortcuts for native Wayland sessions on Linux. */
function enableLinuxGlobalShortcutsPortal() {
	if (process.platform !== "linux") return;
	app.commandLine.appendSwitch("enable-features", "GlobalShortcutsPortal");
}

enableLinuxGlobalShortcutsPortal();

/** Register the global hotkey. Logs an error if the OS refuses the binding (already in use, missing permission, etc). */
function registerShortcuts() {
	const ok = globalShortcut.register(SHORTCUT, toggleWindow);
	if (!ok) console.error(`Failed to register global shortcut ${SHORTCUT}`);
}

app.whenReady().then(() => {
	Menu.setApplicationMenu(null);
	registerSettingsIpcHandlers();
	const mainWindow = createWindow();
	registerAiIpcHandlers(mainWindow);
	registerNotesIpcHandlers(mainWindow);
	registerWindowIpcHandlers(mainWindow);
	registerTrayIpcHandlers(mainWindow);
	registerUpdateIpcHandlers(mainWindow);
	registerAppIpcHandlers(mainWindow);
	createTray();
	registerShortcuts();
	initAutoUpdater();
	initVersionCheck();
});

app.on("will-quit", () => globalShortcut.unregisterAll());
// Keep the app alive in the tray when all windows are closed.
// Registering an empty listener overrides Electron's default quit-on-all-closed.
app.on("window-all-closed", () => {});
