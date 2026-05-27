import { ipcRenderer } from "electron";
import { AI_CHANNELS } from "./channels";
import type {
	AiProvider,
	AiSettings,
	AiSettingsStatus,
	TransformRequest,
	TransformResult,
} from "./types";

export type AiApi = {
	getSettings: () => Promise<AiSettingsStatus>;
	saveSettings: (settings: AiSettings) => Promise<AiSettingsStatus>;
	saveApiKey: (
		provider: AiProvider,
		apiKey: string,
	) => Promise<AiSettingsStatus>;
	removeApiKey: (provider: AiProvider) => Promise<AiSettingsStatus>;
	transform: (request: TransformRequest) => Promise<TransformResult>;
};

export const aiApi: AiApi = {
	getSettings: () => ipcRenderer.invoke(AI_CHANNELS.getSettings),
	saveSettings: (settings) =>
		ipcRenderer.invoke(AI_CHANNELS.saveSettings, settings),
	saveApiKey: (provider, apiKey) =>
		ipcRenderer.invoke(AI_CHANNELS.saveApiKey, { provider, apiKey }),
	removeApiKey: (provider) =>
		ipcRenderer.invoke(AI_CHANNELS.removeApiKey, provider),
	transform: (request) => ipcRenderer.invoke(AI_CHANNELS.transform, request),
};
