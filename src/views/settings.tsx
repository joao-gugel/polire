import {
	MonitorIcon,
	MoonIcon,
	SparkleIcon,
	SunIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { NavRow } from "../components/nav-row";
import { PageLayout } from "../components/page-layout";
import { type ThemeOption, ThemeRow } from "../components/theme-row";
import { useNav } from "../nav";
import { getStoredTheme, setTheme, type Theme } from "../theme";

const SELECTION_LAYOUT_ID = "settings-selection";

const THEMES: ThemeOption[] = [
	{ id: "light", label: "Light", icon: SunIcon },
	{ id: "dark", label: "Dark", icon: MoonIcon },
	{ id: "system", label: "Sistema", icon: MonitorIcon },
];

const NAV_INDEX_AI = THEMES.length;
const TOTAL_ITEMS = THEMES.length + 1;

export function Settings() {
	const { current, pop, push } = useNav();
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
				if (selected === NAV_INDEX_AI) {
					push("ai-settings");
					return;
				}
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
	}, [isActive, selected, pop, push]);

	return (
		<PageLayout title="Configurações">
			<div className="flex flex-col gap-3 px-2 py-3">
				<section>
					<SectionHeader label="Tema" />
					<div className="flex flex-col gap-0.5">
						{THEMES.map((option, index) => (
							<ThemeRow
								key={option.id}
								option={option}
								selected={index === selected}
								isCurrent={option.id === activeTheme}
								layoutId={SELECTION_LAYOUT_ID}
								onHover={() => setSelected(index)}
								onSelect={() => applyTheme(option.id)}
							/>
						))}
					</div>
				</section>
				<section>
					<SectionHeader label="Geral" />
					<NavRow
						label="IA"
						icon={SparkleIcon}
						selected={selected === NAV_INDEX_AI}
						layoutId={SELECTION_LAYOUT_ID}
						onHover={() => setSelected(NAV_INDEX_AI)}
						onSelect={() => push("ai-settings")}
					/>
				</section>
			</div>
		</PageLayout>
	);
}

function SectionHeader({ label }: { label: string }) {
	return (
		<p className="px-3 pb-2 font-medium text-[11px] text-zinc-600 uppercase tracking-wider dark:text-zinc-400">
			{label}
		</p>
	);
}
