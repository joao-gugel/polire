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

type Props = {
	activeTheme: Theme;
	selected: number;
	confirmation: { index: number; sequence: number };
	onHover: (index: number) => void;
	onSelect: (theme: Theme) => void;
};

export function ThemeList({
	activeTheme,
	selected,
	confirmation,
	onHover,
	onSelect,
}: Props) {
	return (
		<div className="flex flex-col gap-0.5">
			{THEME_OPTIONS.map((option, index) => (
				<OptionItem
					key={option.id}
					label={option.label}
					selected={index === selected}
					layoutId="settings-selection"
					confirmationSequence={
						confirmation.index === index ? confirmation.sequence : undefined
					}
					leading={
						<OptionItemIcon icon={option.icon} selected={index === selected} />
					}
					trailing={option.id === activeTheme ? <OptionItemCheck /> : undefined}
					onHover={() => onHover(index)}
					onSelect={() => onSelect(option.id)}
				/>
			))}
		</div>
	);
}
