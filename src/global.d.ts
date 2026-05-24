import type {
	AiProvider,
	AiSettings,
	AiSettingsStatus,
	TransformRequest,
	TransformResult,
} from "../electron/ai/types";
import type { Note } from "../electron/notes/types";

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
			hide: () => Promise<void>;
			ai: {
				getSettings: () => Promise<AiSettingsStatus>;
				saveSettings: (settings: AiSettings) => Promise<AiSettingsStatus>;
				saveApiKey: (
					provider: AiProvider,
					apiKey: string,
				) => Promise<AiSettingsStatus>;
				removeApiKey: (provider: AiProvider) => Promise<AiSettingsStatus>;
				transform: (request: TransformRequest) => Promise<TransformResult>;
			};
			notes: {
				list: () => Promise<Note[]>;
				create: (content: string) => Promise<Note>;
				update: (id: string, content: string) => Promise<Note>;
				remove: (id: string) => Promise<void>;
			};
		};
	}
}
