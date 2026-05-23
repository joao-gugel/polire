import { GearIcon, NotebookIcon, NotePencilIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Footer } from "./components/footer";
import { OptionList } from "./components/option-list";
import { SearchInput } from "./components/search-input";
import type { CommandOption } from "./types";

const OPTIONS: CommandOption[] = [
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
		action: () => console.log("settings"),
	},
];

export default function App() {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				event.preventDefault();
				setSelected((index) => (index + 1) % OPTIONS.length);
				return;
			}
			if (event.key === "ArrowUp") {
				event.preventDefault();
				setSelected((index) => (index - 1 + OPTIONS.length) % OPTIONS.length);
				return;
			}
			if (event.key === "Enter") {
				event.preventDefault();
				OPTIONS[selected].action();
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selected]);

	return (
		<div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
			<SearchInput
				value={query}
				onChange={setQuery}
				placeholder="Escreva ou cole seu texto..."
			/>
			<div className="h-px bg-zinc-200/60" />
			<div className="flex-1 overflow-y-auto">
				<OptionList
					options={OPTIONS}
					selectedIndex={selected}
					onHover={setSelected}
					onSelect={(index) => OPTIONS[index].action()}
				/>
			</div>
			<Footer />
		</div>
	);
}
