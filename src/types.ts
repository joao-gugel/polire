import type { Icon } from "@phosphor-icons/react";

/** A selectable command shown in the palette. */
export type CommandOption = {
	id: string;
	label: string;
	icon: Icon;
	action: () => void;
	/** When true, the option is shown but cannot be activated by click or Enter. */
	disabled?: boolean;
	/** Small muted text rendered on the right of the row — used to explain why an option is disabled. */
	hint?: string;
};

/** Top-level views the window can show. */
export type View =
	| "palette"
	| "settings"
	| "onboarding"
	| "ai-settings"
	| "correction"
	| "tone-target"
	| "translation-target"
	| "translation"
	| "notes";
