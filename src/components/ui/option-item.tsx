import { CaretRightIcon, CheckIcon, type Icon } from "@phosphor-icons/react";
import { motion, useAnimationControls } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";

type OptionItemProps = {
	label: string;
	selected: boolean;
	layoutId: string;
	leading: ReactNode;
	trailing?: ReactNode;
	/** Small muted line rendered below the label. */
	description?: ReactNode;
	confirmationSequence?: number;
	disabled?: boolean;
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
	description,
	confirmationSequence,
	disabled = false,
	onHover,
	onSelect,
}: OptionItemProps) {
	const confirmationControls = useAnimationControls();
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!confirmationSequence) return;
		void confirmationControls.start({
			scale: [1, 0.965, 1.008, 1],
			transition: confirmationTransition,
		});
	}, [confirmationSequence, confirmationControls]);

	useEffect(() => {
		if (!selected) return;
		buttonRef.current?.scrollIntoView({ block: "nearest" });
	}, [selected]);

	function handleClick() {
		if (disabled) return;
		onSelect();
	}

	const interactionClass = disabled
		? "cursor-not-allowed opacity-55"
		: "cursor-pointer";

	return (
		<motion.button
			ref={buttonRef}
			type="button"
			onClick={handleClick}
			onMouseEnter={onHover}
			aria-disabled={disabled || undefined}
			animate={confirmationControls}
			whileTap={disabled ? undefined : { scale: 0.965 }}
			transition={tapTransition}
			className={`relative flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm outline-none focus:outline-none focus-visible:outline-none ${interactionClass}`}
		>
			{selected && !disabled && (
				<motion.div
					layoutId={layoutId}
					transition={selectionTransition}
					className="absolute inset-0 rounded-xl bg-zinc-900/5 dark:bg-white/3"
				/>
			)}
			{leading}
			<span className="relative flex min-w-0 flex-1 flex-col gap-0.5">
				<span
					className={`text-base transition-colors ${
						selected && !disabled
							? "text-zinc-950 dark:text-zinc-50"
							: "text-zinc-500 dark:text-zinc-300"
					}`}
				>
					{label}
				</span>
				{description && (
					<span className="text-xs text-zinc-500 dark:text-zinc-400">
						{description}
					</span>
				)}
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
					? "text-zinc-950 dark:text-zinc-50"
					: "text-zinc-500 dark:text-zinc-300"
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

type OptionItemHintProps = {
	label: string;
};

/** Small muted label rendered on the right of an OptionItem — typically a "why is this disabled" hint. */
export function OptionItemHint({ label }: OptionItemHintProps) {
	return (
		<span className="relative text-xs text-zinc-500 dark:text-zinc-400">
			{label}
		</span>
	);
}
