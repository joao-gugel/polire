import { ipcRenderer } from "electron";
import { APP_CHANNELS } from "./channels";

export type AppApi = {
	openHomepage: () => Promise<void>;
};

export const appApi: AppApi = {
	openHomepage: () => ipcRenderer.invoke(APP_CHANNELS.openHomepage),
};
