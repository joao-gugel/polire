import type {
	AiProvider,
	AiSettings,
	AiSettingsStatus,
	TransformRequest,
	TransformResult,
} from "./ai/types";
import type { Note } from "./notes/types";
import type { Locale, Settings } from "./settings/types";
import type { UpdateLabels } from "./update/types";

export type Platform =
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

export type PreloadApi = {
	platform: Platform;
	hide: () => Promise<void>;
	resizeForPaletteInput: (extraHeight: number) => Promise<void>;
	setTrayLabels: (labels: { open: string; quit: string }) => Promise<void>;
	setUpdateLabels: (labels: UpdateLabels) => Promise<void>;
	getUpdateStatus: () => Promise<string | null>;
	onUpdateAvailable: (callback: (version: string) => void) => () => void;
	openReleases: () => Promise<void>;
	openHomepage: () => Promise<void>;
	settings: {
		initial: Settings;
		setLocale: (locale: Locale) => Promise<void>;
	};
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
