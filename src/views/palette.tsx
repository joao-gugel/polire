import { useEffect, useState } from "react";
import { OptionList } from "@/components/palette/option-list";
import { buildPaletteOptions } from "@/components/palette/palette-options";
import { SavedNoteFeedback } from "@/components/palette/saved-note-feedback";
import { SearchInput } from "@/components/palette/search-input";
import { Footer } from "@/components/ui/footer";
import { useAiStatus } from "@/hooks/use-ai-status";
import { useCorrection } from "@/hooks/use-correction";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";
import { useNotes } from "@/hooks/use-notes";
import { useTranslation } from "@/hooks/use-translation";

export function Palette() {
	const { t } = useI18n();
	const { push, current } = useNav();
	const { status } = useAiStatus();
	const { correctText } = useCorrection();
	const { setDraft } = useTranslation();
	const { createNote, loadNotes } = useNotes();
	const isActive = current === "palette";
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });
	const [saveFeedbackSequence, setSaveFeedbackSequence] = useState(0);
	async function saveAsNote(text: string) {
		await createNote(text);
		setQuery("");
		setSaveFeedbackSequence((sequence) => sequence + 1);
	}

	async function openNotes() {
		await loadNotes();
		push("notes");
	}

	const options = buildPaletteOptions({
		t,
		push,
		correctText,
		startTranslation: setDraft,
		saveAsNote,
		openNotes,
		text: query,
		aiReady: status.hasApiKey,
	});

	const safeSelected =
		options.length === 0 ? 0 : Math.min(selected, options.length - 1);

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
			if (event.key === "Enter" && !event.shiftKey) {
				event.preventDefault();
				const target = options[safeSelected];
				if (!target || target.disabled) return;
				setConfirmation((current) => ({
					index: safeSelected,
					sequence: current.sequence + 1,
				}));
				target.action();
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, safeSelected, options]);

	function selectByMouse(index: number) {
		const target = options[index];
		if (!target || target.disabled) return;
		target.action();
	}

	return (
		<>
			<div className="relative">
				<SearchInput
					value={query}
					onChange={setQuery}
					placeholder={t("palette.placeholder")}
				/>
				<SavedNoteFeedback sequence={saveFeedbackSequence} />
			</div>
			<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
			<div className="flex-1 overflow-y-auto">
				<OptionList
					options={options}
					selectedIndex={safeSelected}
					confirmation={confirmation}
					onHover={setSelected}
					onSelect={selectByMouse}
				/>
			</div>
			<Footer />
		</>
	);
}
