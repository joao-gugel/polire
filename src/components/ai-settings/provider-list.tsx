import { PROVIDER_OPTIONS } from "@/components/ai-settings/provider-options";
import { OptionItem, OptionItemCheck } from "@/components/ui/option-item";
import type { AiProvider } from "../../../electron/ai/types";

type Props = {
	activeProvider: AiProvider | undefined;
	selected: number;
	confirmation: { index: number; sequence: number };
	onHover: (index: number) => void;
	onSelect: (provider: AiProvider) => void;
};

export function ProviderList({
	activeProvider,
	selected,
	confirmation,
	onHover,
	onSelect,
}: Props) {
	return (
		<div className="flex flex-col gap-0.5">
			{PROVIDER_OPTIONS.map((option, index) => (
				<OptionItem
					key={option.id}
					label={option.label}
					selected={index === selected}
					layoutId="ai-provider-selection"
					confirmationSequence={
						confirmation.index === index ? confirmation.sequence : undefined
					}
					leading={
						<img
							src={option.logo}
							alt=""
							className={`relative h-5 w-5 object-contain ${option.logoClassName ?? ""} ${
								option.invertInDarkMode ? "dark:invert" : ""
							}`}
						/>
					}
					trailing={
						option.id === activeProvider ? <OptionItemCheck /> : undefined
					}
					onHover={() => onHover(index)}
					onSelect={() => onSelect(option.id)}
				/>
			))}
		</div>
	);
}
