import { CheckIcon } from "@phosphor-icons/react";
import { motion } from "motion/react";
import type { AiProvider } from "../../electron/ai/types";

export type ProviderOption = {
	id: AiProvider;
	label: string;
	logo: string;
	invertInDarkMode?: boolean;
	logoClassName?: string;
};

type Props = {
	option: ProviderOption;
	selected: boolean;
	isCurrent: boolean;
	layoutId: string;
	onHover: () => void;
	onSelect: () => void;
};

const selectionTransition = { duration: 0.08, ease: "easeOut" } as const;

export function ProviderRow({
	option,
	selected,
	isCurrent,
	layoutId,
	onHover,
	onSelect,
}: Props) {
	return (
		<button
			type="button"
			onClick={onSelect}
			onMouseEnter={onHover}
			className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-left text-sm outline-none focus:outline-none focus-visible:outline-none"
		>
			{selected && (
				<motion.div
					layoutId={layoutId}
					transition={selectionTransition}
					className="absolute inset-0 rounded-xl bg-zinc-900/5 dark:bg-white/10"
				/>
			)}
			<img
				src={option.logo}
				alt=""
				className={`relative h-5 w-5 object-contain ${option.logoClassName ?? ""} ${
					option.invertInDarkMode ? "dark:invert" : ""
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
