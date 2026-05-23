import { CheckIcon, type Icon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { Theme } from "../theme";

export type ThemeOption = {
	id: Theme;
	label: string;
	icon: Icon;
};

type Props = {
	option: ThemeOption;
	selected: boolean;
	isCurrent: boolean;
	onHover: () => void;
	onSelect: () => void;
};

const selectionTransition = { duration: 0.08, ease: "easeOut" } as const;

export function ThemeRow({
	option,
	selected,
	isCurrent,
	onHover,
	onSelect,
}: Props) {
	const Icon = option.icon;
	return (
		<button
			type="button"
			onClick={onSelect}
			onMouseEnter={onHover}
			className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-left text-sm outline-none focus:outline-none focus-visible:outline-none"
		>
			{selected && (
				<motion.div
					layoutId="theme-selection"
					transition={selectionTransition}
					className="absolute inset-0 rounded-xl bg-zinc-900/5 dark:bg-white/10"
				/>
			)}
			<Icon
				size={20}
				weight="regular"
				className={`relative transition-colors ${
					selected
						? "text-zinc-900 dark:text-zinc-50"
						: "text-zinc-600 dark:text-zinc-300"
				}`}
			/>
			<span
				className={`relative flex-1 text-base transition-colors ${
					selected
						? "text-zinc-900 dark:text-zinc-50"
						: "text-zinc-700 dark:text-zinc-200"
				}`}
			>
				{option.label}
			</span>
			{isCurrent && (
				<CheckIcon
					size={16}
					weight="bold"
					className="relative text-zinc-700 dark:text-zinc-300"
				/>
			)}
		</button>
	);
}
