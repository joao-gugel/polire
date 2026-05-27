import { ipcRenderer } from "electron";
import { APP_CHANNELS } from "./channels";

const version = ipcRenderer.sendSync(APP_CHANNELS.getVersion) as string;

export type AppApi = {
	version: string;
	openHomepage: () => Promise<void>;
};

export const appApi: AppApi = {
	version,
	openHomepage: () => ipcRenderer.invoke(APP_CHANNELS.openHomepage),
};
