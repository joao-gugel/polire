import type {
	AiProvider,
	AiSettings,
	AiSettingsStatus,
} from "../electron/ai/types";

/** Operating system identifier exposed by the main process via `process.platform`. */
type Platform =
	| "aix"
	| "android"
	| "cygwin"
	| "darwin"
	| "freebsd"
	| "haiku"
	| "linux"
	| "netbsd"
	| "openbsd"
	| "sunos"
	| "win32";

declare global {
	interface Window {
		api: {
			platform: Platform;
			ai: {
				getSettings: () => Promise<AiSettingsStatus>;
				saveSettings: (settings: AiSettings) => Promise<AiSettingsStatus>;
				saveApiKey: (
					provider: AiProvider,
					apiKey: string,
				) => Promise<AiSettingsStatus>;
				removeApiKey: (provider: AiProvider) => Promise<AiSettingsStatus>;
			};
		};
	}
}
