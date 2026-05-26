import { app } from "electron";
import pkg from "electron-updater";
import { notifyUpdateReady } from "./notifications";

const { autoUpdater } = pkg;

const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

/**
 * Linux auto-update via electron-updater only works inside an AppImage runtime
 * (it requires the APPIMAGE env var). .deb and dev runs must skip.
 */
function canAutoUpdate(): boolean {
	if (!app.isPackaged) return false;
	if (process.platform === "linux" && !process.env.APPIMAGE) return false;
	return true;
}

export function initAutoUpdater() {
	if (!canAutoUpdate()) return;

	autoUpdater.autoDownload = true;
	autoUpdater.autoInstallOnAppQuit = true;

	autoUpdater.on("error", (err) => console.error("[updater] error", err));
	autoUpdater.on("checking-for-update", () =>
		console.log("[updater] checking…"),
	);
	autoUpdater.on("update-available", (info) =>
		console.log(`[updater] update available: ${info.version}`),
	);
	autoUpdater.on("update-not-available", () =>
		console.log("[updater] up to date"),
	);
	autoUpdater.on("download-progress", (p) =>
		console.log(
			`[updater] ${p.percent.toFixed(0)}% (${(p.bytesPerSecond / 1024).toFixed(0)} KB/s)`,
		),
	);
	autoUpdater.on("update-downloaded", (info) => {
		console.log(`[updater] downloaded ${info.version} — will install on quit`);
		notifyUpdateReady(info.version);
	});

	autoUpdater
		.checkForUpdates()
		.catch((err) => console.error("[updater] initial check failed", err));
	setInterval(
		() =>
			autoUpdater
				.checkForUpdates()
				.catch((err) => console.error("[updater] check failed", err)),
		FOUR_HOURS_MS,
	);
}
