import {
	GearIcon,
	MagicWandIcon,
	NotebookIcon,
	NotePencilIcon,
	TranslateIcon,
} from "@phosphor-icons/react";
import type { CommandOption } from "@/types";

type PaletteDestination = "settings" | "correction" | "translation" | "notes";

export function buildPaletteOptions(
	push: (view: PaletteDestination) => void,
	correctText: (text: string) => Promise<void>,
	translateToEnglish: (text: string) => Promise<void>,
	saveAsNote: (text: string) => Promise<void>,
	openNotes: () => Promise<void>,
	text: string,
): CommandOption[] {
	return [
		{
			id: "correction",
			label: "Corrigir texto",
			icon: MagicWandIcon,
			action: () => {
				if (!text.trim()) return;
				void correctText(text);
				push("correction");
			},
		},
		{
			id: "translation",
			label: "Traduzir para inglês",
			icon: TranslateIcon,
			action: () => {
				if (!text.trim()) return;
				void translateToEnglish(text);
				push("translation");
			},
		},
		{
			id: "quick-note",
			label: "Salvar nota",
			icon: NotePencilIcon,
			action: () => {
				if (!text.trim()) return;
				void saveAsNote(text);
			},
		},
		{
			id: "notes",
			label: "Abrir notas",
			icon: NotebookIcon,
			action: () => void openNotes(),
		},
		{
			id: "settings",
			label: "Configurações",
			icon: GearIcon,
			action: () => push("settings"),
		},
	];
}
