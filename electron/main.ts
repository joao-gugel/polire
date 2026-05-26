import { app, globalShortcut, Menu } from "electron";
import { registerAiIpcHandlers } from "./ai/ipc";
import { registerAppIpcHandlers } from "./app/ipc";
import { SHORTCUT } from "./constants";
import { registerNotesIpcHandlers } from "./notes/ipc";
import { registerSettingsIpcHandlers } from "./settings/ipc";
import { registerTrayIpcHandlers } from "./tray/ipc";
import { createTray } from "./tray/manager";
import { initAutoUpdater } from "./update/auto-updater";
import { registerUpdateIpcHandlers } from "./update/ipc";
import { initVersionCheck } from "./update/version-check";
import { registerWindowIpcHandlers } from "./window/ipc";
import { createWindow, toggleWindow } from "./window/manager";

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
