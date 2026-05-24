import {
	type Icon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
} from "@phosphor-icons/react";
import {
	OptionItem,
	OptionItemCheck,
	OptionItemIcon,
} from "@/components/ui/option-item";
import type { Theme } from "@/theme";

type ThemeOption = {
	id: Theme;
	label: string;
	icon: Icon;
};

export const THEME_OPTIONS: ThemeOption[] = [
	{ id: "light", label: "Light", icon: SunIcon },
	{ id: "dark", label: "Dark", icon: MoonIcon },
	{ id: "system", label: "Sistema", icon: MonitorIcon },
];

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
	return (
		<div className="flex flex-col gap-0.5">
			{THEME_OPTIONS.map((option, index) => {
				const navigationIndex = index + navigationIndexOffset;
				return (
					<OptionItem
						key={option.id}
						label={option.label}
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
