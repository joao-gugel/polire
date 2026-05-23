import type { CommandOption } from "../types";
import { OptionItem } from "./option-item";

type OptionListProps = {
	options: CommandOption[];
	selectedIndex: number;
	onHover: (index: number) => void;
	onSelect: (index: number) => void;
};

export function OptionList({
	options,
	selectedIndex,
	onHover,
	onSelect,
}: OptionListProps) {
	return (
		<div className="flex flex-col gap-0.5 px-2 py-2">
			{options.map((option, index) => (
				<OptionItem
					key={option.id}
					option={option}
					selected={index === selectedIndex}
					onHover={() => onHover(index)}
					onSelect={() => onSelect(index)}
				/>
			))}
		</div>
	);
}
