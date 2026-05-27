import {
	type Icon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
} from "@phosphor-icons/react";
import type { Theme } from "@/theme";

export type ThemeOption = {
	id: Theme;
	labelKey: "light" | "dark" | "system";
	icon: Icon;
};

export const THEME_OPTIONS: ThemeOption[] = [
	{ id: "light", labelKey: "light", icon: SunIcon },
	{ id: "dark", labelKey: "dark", icon: MoonIcon },
	{ id: "system", labelKey: "system", icon: MonitorIcon },
];
