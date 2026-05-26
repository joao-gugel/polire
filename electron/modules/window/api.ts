import { ipcRenderer } from "electron";
import { WINDOW_CHANNELS } from "./channels";

export type WindowApi = {
	hide: () => Promise<void>;
	resizeForPaletteInput: (extraHeight: number) => Promise<void>;
};

export const windowApi: WindowApi = {
	hide: () => ipcRenderer.invoke(WINDOW_CHANNELS.hide),
	resizeForPaletteInput: (extraHeight: number) =>
		ipcRenderer.invoke(WINDOW_CHANNELS.resizeForPaletteInput, extraHeight),
};
