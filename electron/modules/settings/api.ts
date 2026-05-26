import { ipcRenderer } from "electron";
import { SETTINGS_CHANNELS } from "./channels";
import type { Locale, Settings } from "./types";

const initialSettings = ipcRenderer.sendSync(SETTINGS_CHANNELS.get) as Settings;

export type SettingsApi = {
	initial: Settings;
	setLocale: (locale: Locale) => Promise<void>;
};

export const settingsApi: SettingsApi = {
	initial: initialSettings,
	setLocale: (locale) =>
		ipcRenderer.invoke(SETTINGS_CHANNELS.setLocale, locale),
};
