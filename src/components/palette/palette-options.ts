import {
	GearIcon,
	MagicWandIcon,
	NotebookIcon,
	NotePencilIcon,
	SparkleIcon,
	TranslateIcon,
} from "@phosphor-icons/react";
import type { CommandOption } from "@/types";

type PaletteDestination =
	| "settings"
	| "onboarding"
	| "correction"
	| "translation-target"
	| "notes";

type Translate = (key: string) => string;

type PaletteOptionsInput = {
	t: Translate;
	push: (view: PaletteDestination) => void;
	correctText: (text: string) => Promise<void>;
	startTranslation: (text: string) => void;
	saveAsNote: (text: string) => Promise<void>;
	openNotes: () => Promise<void>;
	text: string;
	aiReady: boolean;
};

const noop = () => undefined;

export function buildPaletteOptions({
	t,
	push,
	correctText,
	startTranslation,
	saveAsNote,
	openNotes,
	text,
	aiReady,
}: PaletteOptionsInput): CommandOption[] {
	const hasText = text.trim().length > 0;
	const aiHint = aiReady ? undefined : t("palette.disabledAiHint");
	const aiDisabled = !aiReady;

	const onboardingOption: CommandOption | null = !aiReady
		? {
				id: "onboard-ai",
				label: t("palette.options.onboardAi"),
				icon: SparkleIcon,
				action: () => push("onboarding"),
			}
		: null;

	const baseOptions: CommandOption[] = [
		{
			id: "correction",
			label: t("palette.options.correction"),
			icon: MagicWandIcon,
			disabled: aiDisabled,
			hint: aiHint,
			action: aiDisabled
				? noop
				: () => {
						if (!hasText) return;
						void correctText(text);
						push("correction");
					},
		},
		{
			id: "translation",
			label: t("palette.options.translation"),
			icon: TranslateIcon,
			disabled: aiDisabled,
			hint: aiHint,
			action: aiDisabled
				? noop
				: () => {
						if (!hasText) return;
						startTranslation(text);
						push("translation-target");
					},
		},
		{
			id: "quick-note",
			label: t("palette.options.saveNote"),
			icon: NotePencilIcon,
			action: () => {
				if (!hasText) return;
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

	return onboardingOption ? [onboardingOption, ...baseOptions] : baseOptions;
}
