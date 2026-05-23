import { MonitorIcon, MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { type ThemeOption, ThemeRow } from "../components/theme-row";
import { useNav } from "../nav";
import { getStoredTheme, setTheme, type Theme } from "../theme";

const THEMES: ThemeOption[] = [
	{ id: "light", label: "Light", icon: SunIcon },
	{ id: "dark", label: "Dark", icon: MoonIcon },
	{ id: "system", label: "Sistema", icon: MonitorIcon },
];

export function Settings() {
	const { current, pop } = useNav();
	const isActive = current === "settings";
	const [activeTheme, setActiveTheme] = useState<Theme>(getStoredTheme);
	const [selected, setSelected] = useState(() =>
		THEMES.findIndex((option) => option.id === getStoredTheme()),
	);

	function applyTheme(next: Theme) {
		setTheme(next);
		setActiveTheme(next);
	}

	useEffect(() => {
		if (!isActive) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setSelected((index) => (index + 1) % THEMES.length);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setSelected((index) => (index - 1 + THEMES.length) % THEMES.length);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				const next = THEMES[selected].id;
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
	}, [isActive, selected, pop]);

	return (
		<PageLayout title="Configurações">
			<div className="px-2 py-3">
				<p className="px-3 pb-2 font-medium text-[11px] text-zinc-600 uppercase tracking-wider dark:text-zinc-400">
					Tema
				</p>
				<div className="flex flex-col gap-0.5">
					{THEMES.map((option, index) => (
						<ThemeRow
							key={option.id}
							option={option}
							selected={index === selected}
							isCurrent={option.id === activeTheme}
							onHover={() => setSelected(index)}
							onSelect={() => applyTheme(option.id)}
						/>
					))}
				</div>
			</div>
		</PageLayout>
	);
}
