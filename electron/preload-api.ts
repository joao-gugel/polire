import type { AiApi } from "./modules/ai/api";
import type { AppApi } from "./modules/app/api";
import type { NotesApi } from "./modules/notes/api";
import type { SettingsApi } from "./modules/settings/api";
import type { TrayApi } from "./modules/tray/api";
import type { UpdateApi } from "./modules/update/api";
import type { WindowApi } from "./modules/window/api";

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
	settings: SettingsApi;
	platform: Platform;
	update: UpdateApi;
	window: WindowApi;
	notes: NotesApi;
	tray: TrayApi;
	app: AppApi;
	ai: AiApi;
};
