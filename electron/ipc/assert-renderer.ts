import { pathToFileURL } from "node:url";
import type { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from "electron";
import { DEV_URL, INDEX_HTML } from "../constants";

type RendererIpcEvent = Pick<
	IpcMainEvent | IpcMainInvokeEvent,
	"sender" | "senderFrame"
>;

function isTrustedRendererUrl(url: string): boolean {
	if (DEV_URL) return new URL(url).origin === new URL(DEV_URL).origin;
	return url === pathToFileURL(INDEX_HTML).toString();
}

/** Rejects IPC calls that did not originate from a trusted top-level app renderer. */
export function assertTrustedRendererSender(event: RendererIpcEvent) {
	if (event.senderFrame !== event.sender.mainFrame) {
		throw new Error("Unauthorized IPC sender.");
	}
	if (isTrustedRendererUrl(event.senderFrame.url)) return;
	throw new Error("Unauthorized IPC sender.");
}

/** Rejects IPC calls that were not made by the application's main window renderer. */
export function assertMainWindowSender(
	event: RendererIpcEvent,
	window: BrowserWindow,
) {
	assertTrustedRendererSender(event);
	if (event.sender !== window.webContents) {
		throw new Error("Unauthorized IPC sender.");
	}
}
