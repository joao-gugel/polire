import { CaretRightIcon, CheckIcon, type Icon } from "@phosphor-icons/react";
import { motion, useAnimationControls } from "motion/react";
import { type ReactNode, useEffect } from "react";

type OptionItemProps = {
	label: string;
	selected: boolean;
	layoutId: string;
	leading: ReactNode;
	trailing?: ReactNode;
	confirmationSequence?: number;
	onHover: () => void;
	onSelect: () => void;
};

type OptionItemIconProps = {
	icon: Icon;
	selected: boolean;
};

type OptionItemCaretProps = {
	selected: boolean;
};

const selectionTransition = { duration: 0.08, ease: "easeOut" } as const;
const tapTransition = {
	type: "spring" as const,
	stiffness: 600,
	damping: 22,
	mass: 0.6,
};
const confirmationTransition = {
	duration: 0.34,
	times: [0, 0.22, 0.6, 1],
	ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
};

export function OptionItem({
	label,
	selected,
	layoutId,
	leading,
	trailing,
	confirmationSequence,
	onHover,
	onSelect,
}: OptionItemProps) {
	const confirmationControls = useAnimationControls();

	useEffect(() => {
		if (!confirmationSequence) return;
		void confirmationControls.start({
			scale: [1, 0.965, 1.008, 1],
			transition: confirmationTransition,
		});
	}, [confirmationSequence, confirmationControls]);

	return (
		<motion.button
			type="button"
			onClick={onSelect}
			onMouseEnter={onHover}
			animate={confirmationControls}
			whileTap={{ scale: 0.965 }}
			transition={tapTransition}
			className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-left text-sm outline-none focus:outline-none focus-visible:outline-none"
		>
			{selected && (
				<motion.div
					layoutId={layoutId}
					transition={selectionTransition}
					className="absolute inset-0 rounded-xl bg-zinc-900/5 dark:bg-white/10"
				/>
			)}
			{leading}
			<span
				className={`relative flex-1 text-base transition-colors ${
					selected
						? "text-zinc-900 dark:text-zinc-50"
						: "text-zinc-700 dark:text-zinc-200"
				}`}
			>
				{label}
			</span>
			{trailing}
		</motion.button>
	);
}

export function OptionItemIcon({ icon: Icon, selected }: OptionItemIconProps) {
	return (
		<Icon
			size={20}
			weight="regular"
			className={`relative transition-colors ${
				selected
					? "text-zinc-900 dark:text-zinc-50"
					: "text-zinc-600 dark:text-zinc-300"
			}`}
		/>
	);
}

export function OptionItemCheck() {
	return (
		<CheckIcon
			size={16}
			weight="bold"
			className="relative text-zinc-700 dark:text-zinc-300"
		/>
	);
}

export function OptionItemCaret({ selected }: OptionItemCaretProps) {
	return (
		<CaretRightIcon
			size={14}
			weight="bold"
			className={`relative transition-colors ${
				selected
					? "text-zinc-600 dark:text-zinc-300"
					: "text-zinc-400 dark:text-zinc-500"
			}`}
		/>
	);
}
