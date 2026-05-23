import { CaretRightIcon, type Icon } from "@phosphor-icons/react";
import { motion } from "motion/react";

type Props = {
	label: string;
	icon: Icon;
	selected: boolean;
	layoutId: string;
	onHover: () => void;
	onSelect: () => void;
};

const selectionTransition = { duration: 0.08, ease: "easeOut" } as const;

export function NavRow({
	label,
	icon: Icon,
	selected,
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
				{label}
			</span>
			<CaretRightIcon
				size={14}
				weight="bold"
				className={`relative transition-colors ${
					selected
						? "text-zinc-600 dark:text-zinc-300"
						: "text-zinc-400 dark:text-zinc-500"
				}`}
			/>
		</button>
	);
}
