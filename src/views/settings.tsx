import { SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { THEME_OPTIONS, ThemeList } from "@/components/settings/theme-list";
import {
	OptionItem,
	OptionItemCaret,
	OptionItemIcon,
} from "@/components/ui/option-item";
import { PageLayout } from "@/components/ui/page-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { useNav } from "@/hooks/use-nav";
import { getStoredTheme, setTheme, type Theme } from "@/theme";

const SELECTION_LAYOUT_ID = "settings-selection";
const NAV_INDEX_AI = THEME_OPTIONS.length;
const TOTAL_ITEMS = THEME_OPTIONS.length + 1;

export function Settings() {
	const { current, pop, push } = useNav();
	const isActive = current === "settings";
	const [activeTheme, setActiveTheme] = useState<Theme>(getStoredTheme);
	const [selected, setSelected] = useState(() =>
		THEME_OPTIONS.findIndex((option) => option.id === getStoredTheme()),
	);
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });

	function applyTheme(next: Theme) {
		setTheme(next);
		setActiveTheme(next);
	}

	useEffect(() => {
		if (!isActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setSelected((index) => (index + 1) % TOTAL_ITEMS);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setSelected((index) => (index - 1 + TOTAL_ITEMS) % TOTAL_ITEMS);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				setConfirmation((current) => ({
					index: selected,
					sequence: current.sequence + 1,
				}));
				if (selected === NAV_INDEX_AI) {
					push("ai-settings");
					return;
				}
				const next = THEME_OPTIONS[selected].id;
				setTheme(next);
				setActiveTheme(next);
				return;
			}
			if (event.key === "Backspace") {
				event.preventDefault();
				pop();
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, pop, push]);

	return (
		<PageLayout title="Configurações">
			<div className="flex flex-col gap-3 px-2 py-3">
				<section>
					<SectionHeader label="Tema" />
					<ThemeList
						activeTheme={activeTheme}
						selected={selected}
						confirmation={confirmation}
						onHover={setSelected}
						onSelect={applyTheme}
					/>
				</section>
				<section>
					<SectionHeader label="Geral" />
					<OptionItem
						label="IA"
						selected={selected === NAV_INDEX_AI}
						layoutId={SELECTION_LAYOUT_ID}
						confirmationSequence={
							confirmation.index === NAV_INDEX_AI
								? confirmation.sequence
								: undefined
						}
						leading={
							<OptionItemIcon
								icon={SparkleIcon}
								selected={selected === NAV_INDEX_AI}
							/>
						}
						trailing={<OptionItemCaret selected={selected === NAV_INDEX_AI} />}
						onHover={() => setSelected(NAV_INDEX_AI)}
						onSelect={() => push("ai-settings")}
					/>
				</section>
			</div>
		</PageLayout>
	);
}
