import {
	GearIcon,
	MagicWandIcon,
	NotebookIcon,
	NotePencilIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "../components/footer";
import { OptionList } from "../components/option-list";
import { SearchInput } from "../components/search-input";
import { useCorrection } from "../correction";
import { useNav } from "../nav";
import type { CommandOption } from "../types";

function buildOptions(
	push: (view: "settings" | "correction") => void,
	correctText: (text: string) => Promise<void>,
	text: string,
): CommandOption[] {
	return [
		{
			id: "correction",
			label: "Corrigir texto",
			icon: MagicWandIcon,
			action: () => {
				if (!text.trim()) return;
				void correctText(text);
				push("correction");
			},
		},
		{
			id: "quick-note",
			label: "Salvar nota",
			icon: NotePencilIcon,
			action: () => console.log("quick-note"),
		},
		{
			id: "notes",
			label: "Abrir notas",
			icon: NotebookIcon,
			action: () => console.log("notes"),
		},
		{
			id: "settings",
			label: "Configurações",
			icon: GearIcon,
			action: () => push("settings"),
		},
	];
}

export function Palette() {
	const { push, current } = useNav();
	const { correctText } = useCorrection();
	const isActive = current === "palette";
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState(0);
	const options = useMemo(
		() => buildOptions(push, correctText, query),
		[push, correctText, query],
	);

	useEffect(() => {
		if (!isActive) return;
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
	}, [isActive, selected, options]);

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
