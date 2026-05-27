import { Notification, shell } from "electron";
import { RELEASES_URL } from "../../constants";
import type { UpdateLabelSet, UpdateLabels } from "./types";

let labels: UpdateLabels = {
	available: {
		title: "New Polire version available",
		body: "Version {{version}} is out. Click to download.",
	},
	ready: {
		title: "Update ready",
		body: "Polire {{version}} will be installed when you quit the app.",
	},
};

export function setUpdateLabels(next: UpdateLabels) {
	labels = next;
}

function interpolate(template: string, version: string): string {
	return template.replace(/\{\{version\}\}/g, version);
}

function show(label: UpdateLabelSet, version: string) {
	const notification = new Notification({
		title: label.title,
		body: interpolate(label.body, version),
	});
	notification.on("click", () => shell.openExternal(RELEASES_URL));
	notification.show();
}

export function notifyUpdateAvailable(version: string) {
	show(labels.available, version);
}

export function notifyUpdateReady(version: string) {
	show(labels.ready, version);
}
