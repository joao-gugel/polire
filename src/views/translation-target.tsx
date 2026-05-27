import { GlobeIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput } from "@/components/palette/search-input";
import {
	filterLanguages,
	findLanguage,
	type LanguageDef,
} from "@/components/translation-target/languages";
import {
	getRecentLanguages,
	pushRecentLanguage,
} from "@/components/translation-target/recents";
import { Footer } from "@/components/ui/footer";
import { OptionItem, OptionItemIcon } from "@/components/ui/option-item";
import { SectionHeader } from "@/components/ui/section-header";
import { useI18n } from "@/hooks/use-i18n";
import { useNav } from "@/hooks/use-nav";
import { useTranslation } from "@/hooks/use-translation";

const SELECTION_LAYOUT_ID = "translation-target-selection";

export function TranslationTarget() {
	const { t } = useI18n();
	const { current, pop, push } = useNav();
	const { draft, setDraft, translate } = useTranslation();
	const isActive = current === "translation-target";
	const filterInputRef = useRef<HTMLInputElement>(null);
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
		if (!draft.trim()) return;
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
		filterInputRef.current?.focus();
	}, [isActive]);

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
				if (!target || !draft.trim()) return;
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
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isActive, selected, flatList, push, pop, draft, translate]);

	return (
		<>
			<SearchInput
				value={draft}
				onChange={setDraft}
				placeholder={t("palette.placeholder")}
				autoFocus={false}
			/>
			<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
			<div className="relative px-2 py-2">
				<input
					ref={filterInputRef}
					type="text"
					value={query}
					onChange={(event) => changeQuery(event.target.value)}
					placeholder={t("translationTarget.searchPlaceholder")}
					className="h-11 w-full rounded-xl border border-zinc-900/5 pr-4 pl-12 text-base text-zinc-900 outline-none placeholder:text-zinc-500 dark:border-white/10 dark:text-zinc-50 dark:placeholder:text-zinc-400"
				/>
				<MagnifyingGlassIcon
					size={16}
					weight="bold"
					className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-6.5 text-zinc-500 dark:text-zinc-400"
				/>
			</div>
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
			<Footer />
		</>
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
