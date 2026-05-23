import type { Icon } from "@phosphor-icons/react";

/** A selectable command shown in the palette. */
export type CommandOption = {
	id: string;
	label: string;
	icon: Icon;
	action: () => void;
};

/** Top-level views the window can show. */
export type View = "palette" | "settings" | "ai-settings";
