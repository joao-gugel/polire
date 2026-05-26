import type { BrowserWindow } from "electron";
import { registerAiIpcHandlers } from "../modules/ai/ipc";
import { registerAppIpcHandlers } from "../modules/app/ipc";
import { registerNotesIpcHandlers } from "../modules/notes/ipc";
import { registerSettingsIpcHandlers } from "../modules/settings/ipc";
import { registerTrayIpcHandlers } from "../modules/tray/ipc";
import { registerUpdateIpcHandlers } from "../modules/update/ipc";
import { registerWindowIpcHandlers } from "../modules/window/ipc";

/** Registers renderer-facing IPC handlers for the application's main window. */
export function registerIpcHandlers(window: BrowserWindow) {
	registerSettingsIpcHandlers();
	registerAiIpcHandlers(window);
	registerNotesIpcHandlers(window);
	registerWindowIpcHandlers(window);
	registerTrayIpcHandlers(window);
	registerUpdateIpcHandlers(window);
	registerAppIpcHandlers(window);
}
