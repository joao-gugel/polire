import { motion } from "motion/react";
import type { ReactNode } from "react";

export type ResultPane = "original" | "result";

type PaneToggleProps = {
	pane: ResultPane;
	onChange: (pane: ResultPane) => void;
	originalLabel: string;
	resultLabel: string;
};

type PaneToggleOptionProps = {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
};

export function PaneToggle({
	pane,
	onChange,
	originalLabel,
	resultLabel,
}: PaneToggleProps) {
	return (
		<div className="relative inline-flex items-center rounded-lg bg-zinc-900/5 p-0.5 dark:bg-white/10">
			<PaneToggleOption
				active={pane === "original"}
				onClick={() => onChange("original")}
			>
				{originalLabel}
			</PaneToggleOption>
			<PaneToggleOption
				active={pane === "result"}
				onClick={() => onChange("result")}
			>
				{resultLabel}
			</PaneToggleOption>
		</div>
	);
}

function PaneToggleOption({
	active,
	onClick,
	children,
}: PaneToggleOptionProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="relative z-10 cursor-pointer rounded-md px-2.5 py-1 font-medium text-sm text-zinc-600 transition-colors dark:text-zinc-400 data-[active=true]:text-zinc-900 dark:data-[active=true]:text-zinc-50"
			data-active={active}
		>
			{active && (
				<motion.span
					layoutId="pane-toggle-indicator"
					className="absolute inset-0 -z-10 rounded-md bg-white shadow-sm dark:bg-white/15"
					transition={{ type: "spring", stiffness: 500, damping: 40 }}
				/>
			)}
			{children}
		</button>
	);
}
