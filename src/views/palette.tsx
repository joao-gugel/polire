import {
	CheckIcon,
	GearIcon,
	MagicWandIcon,
	NotebookIcon,
	NotePencilIcon,
	TranslateIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { OptionList } from "@/components/option-list";
import { SearchInput } from "@/components/search-input";
import { Footer } from "@/components/ui/footer";
import { useCorrection } from "@/providers/correction";
import { useNav } from "@/providers/nav";
import { useNotes } from "@/providers/notes";
import { useTranslation } from "@/providers/translation";
import type { CommandOption } from "@/types";

function buildOptions(
	push: (view: "settings" | "correction" | "translation" | "notes") => void,
	correctText: (text: string) => Promise<void>,
	translateToEnglish: (text: string) => Promise<void>,
	saveAsNote: (text: string) => Promise<void>,
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
			action: () => push("notes"),
		},
		{
			id: "settings",
			label: "Configurações",
			icon: GearIcon,
			action: () => push("settings"),
		},
	];
}

export function Palette() {
	const { push, current } = useNav();
	const { correctText } = useCorrection();
	const { translateToEnglish } = useTranslation();
	const { createNote } = useNotes();
	const isActive = current === "palette";
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });
	const [saveFeedbackSequence, setSaveFeedbackSequence] = useState(0);
	const saveAsNote = useCallback(
		async (text: string) => {
			await createNote(text);
			setQuery("");
			setSaveFeedbackSequence((sequence) => sequence + 1);
		},
		[createNote],
	);
	const options = useMemo(
		() =>
			buildOptions(push, correctText, translateToEnglish, saveAsNote, query),
		[push, correctText, translateToEnglish, saveAsNote, query],
	);

	useEffect(() => {
		if (saveFeedbackSequence === 0) return;
		const timeout = window.setTimeout(() => setSaveFeedbackSequence(0), 1400);
		return () => window.clearTimeout(timeout);
	}, [saveFeedbackSequence]);

	useEffect(() => {
		if (!isActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setSelected((index) => (index + 1) % options.length);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setSelected((index) => (index - 1 + options.length) % options.length);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				setConfirmation((current) => ({
					index: selected,
					sequence: current.sequence + 1,
				}));
				options[selected].action();
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, options]);

	return (
		<>
			<div className="relative">
				<SearchInput
					value={query}
					onChange={setQuery}
					placeholder="Escreva ou cole seu texto..."
				/>
				<AnimatePresence>
					{saveFeedbackSequence > 0 && (
						<motion.div
							key={saveFeedbackSequence}
							initial={{ opacity: 0, y: 4, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -4, scale: 0.97 }}
							transition={{ duration: 0.16, ease: "easeOut" }}
							className="pointer-events-none absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-emerald-500/12 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300"
						>
							<CheckIcon size={13} weight="bold" />
							Nota salva
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
			<div className="flex-1 overflow-y-auto">
				<OptionList
					options={options}
					selectedIndex={selected}
					confirmation={confirmation}
					onHover={setSelected}
					onSelect={(index) => options[index].action()}
				/>
			</div>
			<Footer />
		</>
	);
}
