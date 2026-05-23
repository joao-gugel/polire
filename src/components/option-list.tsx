import { OptionItem, OptionItemIcon } from "@/components/ui/option-item";
import type { CommandOption } from "@/types";

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
					label={option.label}
					selected={index === selectedIndex}
					layoutId="palette-selection"
					leading={
						<OptionItemIcon
							icon={option.icon}
							selected={index === selectedIndex}
						/>
					}
					onHover={() => onHover(index)}
					onSelect={() => onSelect(index)}
				/>
			))}
		</div>
	);
}
