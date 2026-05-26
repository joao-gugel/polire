import { ipcMain } from "electron";
import { SETTINGS_CHANNELS } from "./channels";
import { getSettings, setLocale } from "./store";

export function registerSettingsIpcHandlers() {
	ipcMain.on(SETTINGS_CHANNELS.get, (event) => {
		event.returnValue = getSettings();
	});
	ipcMain.handle(SETTINGS_CHANNELS.setLocale, (_, locale: unknown) => {
		setLocale(locale);
	});
}
