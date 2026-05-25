import { SparkleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { LanguageList } from "@/components/settings/language-list";
import { ThemeList } from "@/components/settings/theme-list";
import { THEME_OPTIONS } from "@/components/settings/theme-options";
import {
	OptionItem,
	OptionItemCaret,
	OptionItemIcon,
} from "@/components/ui/option-item";
import { PageLayout } from "@/components/ui/page-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";
import { LOCALES } from "@/i18n";
import { getStoredTheme, setTheme, type Theme } from "@/theme";

const SELECTION_LAYOUT_ID = "settings-selection";
const NAV_INDEX_AI = 0;
const THEME_INDEX_OFFSET = 1;
const LANGUAGE_INDEX_OFFSET = THEME_INDEX_OFFSET + THEME_OPTIONS.length;
const TOTAL_ITEMS = 1 + THEME_OPTIONS.length + LOCALES.length;

export function Settings() {
	const { t, locale, setLocale } = useI18n();
	const { current, pop, push } = useNav();
	const isActive = current === "settings";
	const [activeTheme, setActiveTheme] = useState<Theme>(getStoredTheme);
	const [selected, setSelected] = useState(
		() =>
			THEME_OPTIONS.findIndex((option) => option.id === getStoredTheme()) +
			THEME_INDEX_OFFSET,
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
				if (selected < LANGUAGE_INDEX_OFFSET) {
					const next = THEME_OPTIONS[selected - THEME_INDEX_OFFSET].id;
					setTheme(next);
					setActiveTheme(next);
					return;
				}
				const nextLocale = LOCALES[selected - LANGUAGE_INDEX_OFFSET];
				setLocale(nextLocale);
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
	}, [isActive, selected, pop, push, setLocale]);

	return (
		<PageLayout title={t("settings.title")}>
			<div className="flex h-full flex-col gap-3 overflow-y-auto px-2 py-3">
				<section>
					<SectionHeader label={t("settings.sections.general")} />
					<OptionItem
						label={t("settings.ai")}
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
				<section>
					<SectionHeader label={t("settings.sections.theme")} />
					<ThemeList
						activeTheme={activeTheme}
						selected={selected}
						confirmation={confirmation}
						navigationIndexOffset={THEME_INDEX_OFFSET}
						onHover={setSelected}
						onSelect={applyTheme}
					/>
				</section>
				<section>
					<SectionHeader label={t("settings.sections.language")} />
					<LanguageList
						activeLocale={locale}
						selected={selected}
						confirmation={confirmation}
						navigationIndexOffset={LANGUAGE_INDEX_OFFSET}
						onHover={setSelected}
						onSelect={setLocale}
					/>
				</section>
			</div>
		</PageLayout>
	);
}
