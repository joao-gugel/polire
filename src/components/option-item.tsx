import type { CommandOption } from "../types";

type OptionItemProps = {
	option: CommandOption;
	selected: boolean;
	onHover: () => void;
	onSelect: () => void;
};

export function OptionItem({
	option,
	selected,
	onHover,
	onSelect,
}: OptionItemProps) {
	const Icon = option.icon;
	return (
		<button
			type="button"
			onClick={onSelect}
			onMouseEnter={onHover}
			className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-left text-sm outline-none transition-all focus:outline-none focus-visible:outline-none ${
				selected ? "bg-zinc-100" : "bg-transparent"
			}`}
		>
			<Icon
				size={20}
				weight="regular"
				className={`${selected ? "text-zinc-700" : "text-zinc-500"}`}
			/>
			<span
				className={`text-base ${selected ? "text-zinc-800" : "text-zinc-700"}`}
			>
				{option.label}
			</span>
		</button>
	);
}
