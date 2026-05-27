import type { PreloadApi } from "../electron/preload-api";

declare global {
	interface Window {
		api: PreloadApi;
	}
}
