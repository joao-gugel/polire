import { ipcMain } from "electron";
import { assertTrustedRendererSender } from "../ipc/assert-renderer";
import { SETTINGS_CHANNELS } from "./channels";
import { getSettings, setLocale } from "./store";
import { parseLocale } from "./validation";

export function registerSettingsIpcHandlers() {
	ipcMain.on(SETTINGS_CHANNELS.get, (event) => {
		assertTrustedRendererSender(event);
		event.returnValue = getSettings();
	});
	ipcMain.handle(SETTINGS_CHANNELS.setLocale, (event, locale: unknown) => {
		assertTrustedRendererSender(event);
		setLocale(parseLocale(locale));
	});
}
