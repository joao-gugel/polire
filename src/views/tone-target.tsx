import { useEffect, useState } from "react";
import { SearchInput } from "@/components/palette/search-input";
import { TONE_OPTIONS, type ToneOption } from "@/components/tone-target/tones";
import { Footer } from "@/components/ui/footer";
import { OptionItem, OptionItemIcon } from "@/components/ui/option-item";
import { useCorrection } from "@/hooks/use-correction";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";

const SELECTION_LAYOUT_ID = "tone-target-selection";

export function ToneTarget() {
	const { t } = useI18n();
	const { current, pop, push } = useNav();
	const { draft, setDraft, correctText } = useCorrection();
	const isActive = current === "tone-target";
	const [selected, setSelected] = useState(0);
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });

	function pickTone(tone: ToneOption, index: number) {
		if (!draft.trim()) return;
		setConfirmation((value) => ({
			index,
			sequence: value.sequence + 1,
		}));
		void correctText(draft, tone.id);
		push("correction");
	}

	useEffect(() => {
		if (!isActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				pop();
				return;
			}
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setSelected((index) => (index + 1) % TONE_OPTIONS.length);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setSelected(
					(index) => (index - 1 + TONE_OPTIONS.length) % TONE_OPTIONS.length,
				);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				const target = TONE_OPTIONS[selected];
				if (!target || !draft.trim()) return;
				setConfirmation((value) => ({
					index: selected,
					sequence: value.sequence + 1,
				}));
				void correctText(draft, target.id);
				push("correction");
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, pop, draft, correctText, push]);

	return (
		<>
			<SearchInput
				value={draft}
				onChange={setDraft}
				placeholder={t("palette.placeholder")}
				autoFocus={false}
			/>
			<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
			<div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
				{TONE_OPTIONS.map((tone, index) => {
					const isSelected = index === selected;
					return (
						<OptionItem
							key={tone.id}
							label={t(`toneTarget.tones.${tone.id}`)}
							selected={isSelected}
							layoutId={SELECTION_LAYOUT_ID}
							confirmationSequence={
								confirmation.index === index ? confirmation.sequence : undefined
							}
							leading={
								<OptionItemIcon icon={tone.icon} selected={isSelected} />
							}
							onHover={() => setSelected(index)}
							onSelect={() => pickTone(tone, index)}
						/>
					);
				})}
			</div>
			<Footer />
		</>
	);
}
