import { GearIcon, NotebookIcon, NotePencilIcon } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "../components/footer";
import { OptionList } from "../components/option-list";
import { SearchInput } from "../components/search-input";
import type { CommandOption, View } from "../types";

type Props = {
	onNavigate: (view: View) => void;
};

function buildOptions(onNavigate: (view: View) => void): CommandOption[] {
	return [
		{
			id: "quick-note",
			label: "Nota rápida",
			icon: NotePencilIcon,
			action: () => console.log("quick-note"),
		},
		{
			id: "notebook",
			label: "Bloco de notas",
			icon: NotebookIcon,
			action: () => console.log("notebook"),
		},
		{
			id: "settings",
			label: "Configurações",
			icon: GearIcon,
			action: () => onNavigate("settings"),
		},
	];
}

export function Palette({ onNavigate }: Props) {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const options = useMemo(() => buildOptions(onNavigate), [onNavigate]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setSelected((index) => (index + 1) % options.length);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setSelected((index) => (index - 1 + options.length) % options.length);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				options[selected].action();
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selected, options]);

	return (
		<>
			<SearchInput
				value={query}
				onChange={setQuery}
				placeholder="Escreva ou cole seu texto..."
			/>
			<div className="h-px bg-zinc-900/8 dark:bg-white/10" />
			<div className="flex-1 overflow-y-auto">
				<OptionList
					options={options}
					selectedIndex={selected}
					onHover={setSelected}
					onSelect={(index) => options[index].action()}
				/>
			</div>
			<Footer />
		</>
	);
}
