import {
	type Icon,
	MonitorIcon,
	MoonIcon,
	SparkleIcon,
	SunIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { PageLayout } from "@/components/page-layout";
import {
	OptionItem,
	OptionItemCaret,
	OptionItemCheck,
	OptionItemIcon,
} from "@/components/ui/option-item";
import { useNav } from "@/providers/nav";
import { getStoredTheme, setTheme, type Theme } from "@/theme";

type ThemeOption = {
	id: Theme;
	label: string;
	icon: Icon;
};

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
	const [confirmation, setConfirmation] = useState({ index: -1, sequence: 0 });

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
				setConfirmation((current) => ({
					index: selected,
					sequence: current.sequence + 1,
				}));
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
							<OptionItem
								key={option.id}
								label={option.label}
								selected={index === selected}
								layoutId={SELECTION_LAYOUT_ID}
								confirmationSequence={
									confirmation.index === index
										? confirmation.sequence
										: undefined
								}
								leading={
									<OptionItemIcon
										icon={option.icon}
										selected={index === selected}
									/>
								}
								trailing={
									option.id === activeTheme ? <OptionItemCheck /> : undefined
								}
								onHover={() => setSelected(index)}
								onSelect={() => applyTheme(option.id)}
							/>
						))}
					</div>
				</section>
				<section>
					<SectionHeader label="Geral" />
					<OptionItem
						label="IA"
						selected={selected === NAV_INDEX_AI}
						layoutId={SELECTION_LAYOUT_ID}
						confirmationSequence={
							confirmation.index === NAV_INDEX_AI
								? confirmation.sequence
								: undefined
						}
						leading={
							<OptionItemIcon
								icon={SparkleIcon}
								selected={selected === NAV_INDEX_AI}
							/>
						}
						trailing={<OptionItemCaret selected={selected === NAV_INDEX_AI} />}
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
