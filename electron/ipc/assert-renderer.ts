import { pathToFileURL } from "node:url";
import type { BrowserWindow, IpcMainInvokeEvent } from "electron";
import { DEV_URL, INDEX_HTML } from "../constants";

function isTrustedRendererUrl(url: string): boolean {
	if (DEV_URL) return new URL(url).origin === new URL(DEV_URL).origin;
	return url === pathToFileURL(INDEX_HTML).toString();
}

/** Rejects IPC calls that were not made by the application's top-level renderer. */
export function assertMainWindowSender(
	event: IpcMainInvokeEvent,
	window: BrowserWindow,
) {
	if (event.sender !== window.webContents) {
		throw new Error("Unauthorized IPC sender.");
	}
	if (event.senderFrame !== window.webContents.mainFrame) {
		throw new Error("Unauthorized IPC sender.");
	}
	if (isTrustedRendererUrl(event.senderFrame.url)) return;
	throw new Error("Unauthorized IPC sender.");
}
