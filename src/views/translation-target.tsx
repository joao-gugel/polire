import { GlobeIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	filterLanguages,
	findLanguage,
	type LanguageDef,
} from "@/components/translation-target/languages";
import {
	getRecentLanguages,
	pushRecentLanguage,
} from "@/components/translation-target/recents";
import { OptionItem, OptionItemIcon } from "@/components/ui/option-item";
import { PageLayout } from "@/components/ui/page-layout";
import { SectionHeader } from "@/components/ui/section-header";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";
import { useTranslation } from "@/hooks/use-translation";

const SELECTION_LAYOUT_ID = "translation-target-selection";

export function TranslationTarget() {
	const { t } = useI18n();
	const { current, pop, push } = useNav();
	const { draft, translate } = useTranslation();
	const isActive = current === "translation-target";
	const inputRef = useRef<HTMLInputElement>(null);
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const [recents, setRecents] = useState(getRecentLanguages);
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });

	const { recentLanguages, otherLanguages, flatList } = useMemo(() => {
		const localizedName = (code: LanguageDef["code"]) =>
			t(`translationTarget.languages.${code}`);
		const filtered = filterLanguages(query, localizedName);
		const filteredCodes = new Set(filtered.map((language) => language.code));
		const recentList = recents
			.map(findLanguage)
			.filter((language): language is LanguageDef => language !== undefined)
			.filter((language) => filteredCodes.has(language.code));
		const recentCodes = new Set(recentList.map((language) => language.code));
		const others = filtered.filter(
			(language) => !recentCodes.has(language.code),
		);
		return {
			recentLanguages: recentList,
			otherLanguages: others,
			flatList: [...recentList, ...others],
		};
	}, [query, recents, t]);

	function pickLanguage(language: LanguageDef) {
		const nextRecents = pushRecentLanguage(language.code);
		setRecents(nextRecents);
		void translate(draft, language.englishName);
		push("translation");
	}

	function changeQuery(next: string) {
		setQuery(next);
		setSelected(0);
	}

	useEffect(() => {
		if (!isActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				if (flatList.length === 0) return;
				setSelected((index) => (index + 1) % flatList.length);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				if (flatList.length === 0) return;
				setSelected((index) => (index - 1 + flatList.length) % flatList.length);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				const target = flatList[selected];
				if (!target) return;
				setConfirmation((value) => ({
					index: selected,
					sequence: value.sequence + 1,
				}));
				const nextRecents = pushRecentLanguage(target.code);
				setRecents(nextRecents);
				void translate(draft, target.englishName);
				push("translation");
				return;
			}
			if (event.key === "Backspace") {
				const inInput = event.target === inputRef.current;
				if (inInput && (event.target as HTMLInputElement).value !== "") return;
				event.preventDefault();
				pop();
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, flatList, pop, push, draft, translate]);

	return (
		<PageLayout title={t("translationTarget.title")}>
			<div className="flex h-full flex-col">
				{draft && (
					<>
						<p className="truncate px-5 pt-3 pb-5 text-sm text-zinc-500 italic dark:text-zinc-400">
							“{draft}”
						</p>
						<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
					</>
				)}
				<input
					ref={inputRef}
					// biome-ignore lint/a11y/noAutofocus: keyboard-first picker; focus must land on the input.
					autoFocus
					type="text"
					value={query}
					onChange={(event) => changeQuery(event.target.value)}
					placeholder={t("translationTarget.searchPlaceholder")}
					className="w-full bg-transparent px-5 py-3 text-base text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-50 dark:placeholder:text-zinc-400"
				/>
				<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
				<div className="flex flex-1 flex-col gap-3 overflow-y-auto px-2 py-3">
					{recentLanguages.length > 0 && (
						<section>
							<SectionHeader label={t("translationTarget.recents")} />
							<LanguageOptions
								languages={recentLanguages}
								offset={0}
								selected={selected}
								confirmation={confirmation}
								onHover={setSelected}
								onSelect={pickLanguage}
							/>
						</section>
					)}
					{otherLanguages.length > 0 && (
						<section>
							<SectionHeader label={t("translationTarget.all")} />
							<LanguageOptions
								languages={otherLanguages}
								offset={recentLanguages.length}
								selected={selected}
								confirmation={confirmation}
								onHover={setSelected}
								onSelect={pickLanguage}
							/>
						</section>
					)}
					{flatList.length === 0 && (
						<p className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">
							{t("translationTarget.empty")}
						</p>
					)}
				</div>
			</div>
		</PageLayout>
	);
}

type LanguageOptionsProps = {
	languages: LanguageDef[];
	offset: number;
	selected: number;
	confirmation: { index: number; sequence: number };
	onHover: (index: number) => void;
	onSelect: (language: LanguageDef) => void;
};

function LanguageOptions({
	languages,
	offset,
	selected,
	confirmation,
	onHover,
	onSelect,
}: LanguageOptionsProps) {
	const { t } = useI18n();
	return (
		<div className="flex flex-col gap-0.5">
			{languages.map((language, index) => {
				const navigationIndex = index + offset;
				const isSelected = navigationIndex === selected;
				return (
					<OptionItem
						key={language.code}
						label={t(`translationTarget.languages.${language.code}`)}
						selected={isSelected}
						layoutId={SELECTION_LAYOUT_ID}
						confirmationSequence={
							confirmation.index === navigationIndex
								? confirmation.sequence
								: undefined
						}
						leading={<OptionItemIcon icon={GlobeIcon} selected={isSelected} />}
						onHover={() => onHover(navigationIndex)}
						onSelect={() => onSelect(language)}
					/>
				);
			})}
		</div>
	);
}
