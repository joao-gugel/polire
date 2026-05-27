import { app } from "electron";
import { notifyUpdateAvailable } from "./notifications";
import { setAvailableVersion } from "./state";

const API_BASE_URL = process.env.POLIRE_API_URL ?? "https://api.polire.app";
const VERSION_ENDPOINT = `${API_BASE_URL}/api/v1/version`;
const REQUEST_TIMEOUT_MS = 5000;
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

function isNewer(remote: string, local: string): boolean {
	const [rMaj, rMin, rPatch] = remote.split(".").map(Number);
	const [lMaj, lMin, lPatch] = local.split(".").map(Number);
	if (rMaj !== lMaj) return rMaj > lMaj;
	if (rMin !== lMin) return rMin > lMin;
	return rPatch > lPatch;
}

async function checkRemoteVersion() {
	try {
		const res = await fetch(VERSION_ENDPOINT, {
			signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
		});
		const { version: remote } = (await res.json()) as { version: string };
		if (!isNewer(remote, app.getVersion())) return;
		setAvailableVersion(remote);
		notifyUpdateAvailable(remote);
	} catch {}
}

export function initVersionCheck() {
	if (!app.isPackaged) return;
	checkRemoteVersion();
	setInterval(checkRemoteVersion, FOUR_HOURS_MS);
}
