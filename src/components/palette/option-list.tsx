import {
	OptionItem,
	OptionItemHint,
	OptionItemIcon,
} from "@/components/ui/option-item";
import type { CommandOption } from "@/types";

type OptionListProps = {
	options: CommandOption[];
	selectedIndex: number;
	onHover: (index: number) => void;
	onSelect: (index: number) => void;
	confirmation?: { index: number; sequence: number };
};

export function OptionList({
	options,
	selectedIndex,
	onHover,
	onSelect,
	confirmation,
}: OptionListProps) {
	return (
		<div className="flex flex-col gap-0.5 px-2 py-2">
			{options.map((option, index) => (
				<OptionItem
					key={option.id}
					label={option.label}
					selected={index === selectedIndex}
					layoutId="palette-selection"
					disabled={option.disabled}
					confirmationSequence={
						confirmation?.index === index ? confirmation.sequence : undefined
					}
					leading={
						<OptionItemIcon
							icon={option.icon}
							selected={index === selectedIndex}
						/>
					}
					trailing={
						option.hint ? <OptionItemHint label={option.hint} /> : undefined
					}
					onHover={() => onHover(index)}
					onSelect={() => onSelect(index)}
				/>
			))}
		</div>
	);
}
