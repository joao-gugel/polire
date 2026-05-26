import { ipcRenderer } from "electron";
import { TRAY_CHANNELS } from "./channels";
import type { TrayLabels } from "./types";

export type TrayApi = {
	setTrayLabels: (labels: TrayLabels) => Promise<void>;
};

export const trayApi: TrayApi = {
	setTrayLabels: (labels: { open: string; quit: string }) =>
		ipcRenderer.invoke(TRAY_CHANNELS.setLabels, labels),
};
