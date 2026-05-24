import {
	GearIcon,
	MagicWandIcon,
	NotebookIcon,
	NotePencilIcon,
	TranslateIcon,
} from "@phosphor-icons/react";
import type { CommandOption } from "@/types";

type PaletteDestination =
	| "settings"
	| "correction"
	| "translation-target"
	| "notes";

type Translate = (key: string) => string;

export function buildPaletteOptions(
	t: Translate,
	push: (view: PaletteDestination) => void,
	correctText: (text: string) => Promise<void>,
	startTranslation: (text: string) => void,
	saveAsNote: (text: string) => Promise<void>,
	openNotes: () => Promise<void>,
	text: string,
): CommandOption[] {
	return [
		{
			id: "correction",
			label: t("palette.options.correction"),
			icon: MagicWandIcon,
			action: () => {
				if (!text.trim()) return;
				void correctText(text);
				push("correction");
			},
		},
		{
			id: "translation",
			label: t("palette.options.translation"),
			icon: TranslateIcon,
			action: () => {
				if (!text.trim()) return;
				startTranslation(text);
				push("translation-target");
			},
		},
		{
			id: "quick-note",
			label: t("palette.options.saveNote"),
			icon: NotePencilIcon,
			action: () => {
				if (!text.trim()) return;
				void saveAsNote(text);
			},
		},
		{
			id: "notes",
			label: t("palette.options.openNotes"),
			icon: NotebookIcon,
			action: () => void openNotes(),
		},
		{
			id: "settings",
			label: t("palette.options.settings"),
			icon: GearIcon,
			action: () => push("settings"),
		},
	];
}
