import { ipcRenderer } from "electron";
import { UPDATE_CHANNELS } from "./channels";
import type { UpdateLabels } from "./types";

export type UpdateAvailableCallback = (version: string) => void;
export type RemoveUpdateAvailableListener = () => void;

export type UpdateApi = {
	setUpdateLabels: (labels: UpdateLabels) => Promise<void>;
	getUpdateStatus: () => Promise<string | null>;
	onUpdateAvailable: (
		cb: UpdateAvailableCallback,
	) => RemoveUpdateAvailableListener;
	openReleases: () => Promise<void>;
};

export const updateApi: UpdateApi = {
	setUpdateLabels: (labels) =>
		ipcRenderer.invoke(UPDATE_CHANNELS.setLabels, labels),
	getUpdateStatus: () =>
		ipcRenderer.invoke(UPDATE_CHANNELS.getStatus) as Promise<string | null>,
	onUpdateAvailable: (cb: (version: string) => void) => {
		const listener = (_: unknown, version: string) => cb(version);
		ipcRenderer.on(UPDATE_CHANNELS.available, listener);
		return () =>
			ipcRenderer.removeListener(UPDATE_CHANNELS.available, listener);
	},
	openReleases: () => ipcRenderer.invoke(UPDATE_CHANNELS.openReleases),
};
