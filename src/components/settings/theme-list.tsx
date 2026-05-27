import { THEME_OPTIONS } from "@/components/settings/theme-options";
import {
	OptionItem,
	OptionItemCheck,
	OptionItemIcon,
} from "@/components/ui/option-item";
import { useI18n } from "@/hooks/use-i18n";
import type { Theme } from "@/theme";

type ThemeListProps = {
	activeTheme: Theme;
	selected: number;
	confirmation: { index: number; sequence: number };
	navigationIndexOffset?: number;
	onHover: (index: number) => void;
	onSelect: (theme: Theme) => void;
};

export function ThemeList({
	activeTheme,
	selected,
	confirmation,
	navigationIndexOffset = 0,
	onHover,
	onSelect,
}: ThemeListProps) {
	const { t } = useI18n();
	return (
		<div className="flex flex-col gap-0.5">
			{THEME_OPTIONS.map((option, index) => {
				const navigationIndex = index + navigationIndexOffset;
				return (
					<OptionItem
						key={option.id}
						label={t(`settings.theme.${option.labelKey}`)}
						selected={navigationIndex === selected}
						layoutId="settings-selection"
						confirmationSequence={
							confirmation.index === navigationIndex
								? confirmation.sequence
								: undefined
						}
						leading={
							<OptionItemIcon
								icon={option.icon}
								selected={navigationIndex === selected}
							/>
						}
						trailing={
							option.id === activeTheme ? <OptionItemCheck /> : undefined
						}
						onHover={() => onHover(navigationIndex)}
						onSelect={() => onSelect(option.id)}
					/>
				);
			})}
		</div>
	);
}
