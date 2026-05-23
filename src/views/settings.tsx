import {
	ArrowLeftIcon,
	MonitorIcon,
	MoonIcon,
	SunIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Footer } from "../components/footer";
import { type ThemeOption, ThemeRow } from "../components/theme-row";
import { getStoredTheme, setTheme, type Theme } from "../theme";
import type { View } from "../types";

type Props = {
	onNavigate: (view: View) => void;
};

const THEMES: ThemeOption[] = [
	{ id: "light", label: "Light", icon: SunIcon },
	{ id: "dark", label: "Dark", icon: MoonIcon },
	{ id: "system", label: "Sistema", icon: MonitorIcon },
];

export function Settings({ onNavigate }: Props) {
	const [current, setCurrent] = useState<Theme>(getStoredTheme);
	const [selected, setSelected] = useState(() =>
		THEMES.findIndex((option) => option.id === getStoredTheme()),
	);

	function applyTheme(next: Theme) {
		setTheme(next);
		setCurrent(next);
	}

	useEffect(() => {
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
				setCurrent(next);
				return;
			}
			if (event.key === "Backspace") {
				event.preventDefault();
				onNavigate("palette");
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selected, onNavigate]);

	return (
		<>
			<header className="flex items-center gap-3 px-4 py-4">
				<button
					type="button"
					onClick={() => onNavigate("palette")}
					className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-zinc-700 outline-none transition-colors hover:bg-zinc-900/5 focus:outline-none focus-visible:outline-none dark:text-zinc-300 dark:hover:bg-white/10"
				>
					<ArrowLeftIcon size={16} weight="regular" />
				</button>
				<h1 className="font-medium text-base text-zinc-900 dark:text-zinc-50">
					Configurações
				</h1>
			</header>
			<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
			<div className="flex-1 overflow-y-auto px-2 py-3">
				<p className="px-3 pb-2 font-medium text-[11px] text-zinc-600 uppercase tracking-wider dark:text-zinc-400">
					Tema
				</p>
				<div className="flex flex-col gap-0.5">
					{THEMES.map((option, index) => (
						<ThemeRow
							key={option.id}
							option={option}
							selected={index === selected}
							isCurrent={option.id === current}
							onHover={() => setSelected(index)}
							onSelect={() => applyTheme(option.id)}
						/>
					))}
				</div>
			</div>
			<Footer />
		</>
	);
}
