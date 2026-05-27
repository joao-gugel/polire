import { GlobeIcon } from "@phosphor-icons/react";
import {
	OptionItem,
	OptionItemCheck,
	OptionItemIcon,
} from "@/components/ui/option-item";
import { useI18n } from "@/hooks/use-i18n";
import { LOCALES, type Locale } from "@/i18n";

type LanguageListProps = {
	activeLocale: Locale;
	selected: number;
	confirmation: { index: number; sequence: number };
	navigationIndexOffset?: number;
	onHover: (index: number) => void;
	onSelect: (locale: Locale) => void;
};

export function LanguageList({
	activeLocale,
	selected,
	confirmation,
	navigationIndexOffset = 0,
	onHover,
	onSelect,
}: LanguageListProps) {
	const { t } = useI18n();
	return (
		<div className="flex flex-col gap-0.5">
			{LOCALES.map((locale, index) => {
				const navigationIndex = index + navigationIndexOffset;
				return (
					<OptionItem
						key={locale}
						label={t(`settings.language.${locale}`)}
						selected={navigationIndex === selected}
						layoutId="settings-selection"
						confirmationSequence={
							confirmation.index === navigationIndex
								? confirmation.sequence
								: undefined
						}
						leading={
							<OptionItemIcon
								icon={GlobeIcon}
								selected={navigationIndex === selected}
							/>
						}
						trailing={locale === activeLocale ? <OptionItemCheck /> : undefined}
						onHover={() => onHover(navigationIndex)}
						onSelect={() => onSelect(locale)}
					/>
				);
			})}
		</div>
	);
}
